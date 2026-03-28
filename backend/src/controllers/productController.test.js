import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// ── Firebase mock ─────────────────────────────────────────────────────────────
const mockDocGet     = jest.fn()
const mockDocSet     = jest.fn()
const mockDocUpdate  = jest.fn()
const mockDocDelete  = jest.fn()
const mockDocRef     = jest.fn(() => ({ get: mockDocGet, set: mockDocSet, update: mockDocUpdate, delete: mockDocDelete }))
const mockQueryGet   = jest.fn()
const mockWhere      = jest.fn()
const mockOrderBy    = jest.fn()
const mockLimit      = jest.fn()
const mockStartAfter = jest.fn()
const mockCollection = jest.fn()

// Chainable query builder: every chain method returns the same `queryChain`
// object so that any combination of .where().orderBy().limit().startAfter()
// ultimately resolves to mockQueryGet when .get() is called.
const queryChain = {
  where: mockWhere,
  orderBy: mockOrderBy,
  limit: mockLimit,
  startAfter: mockStartAfter,
  get: mockQueryGet
}
mockWhere.mockReturnValue(queryChain)
mockOrderBy.mockReturnValue(queryChain)
mockLimit.mockReturnValue(queryChain)
mockStartAfter.mockReturnValue(queryChain)
mockCollection.mockReturnValue({ doc: mockDocRef, ...queryChain })

jest.unstable_mockModule('../config/firebase.js', () => ({ db: { collection: mockCollection } }))
jest.unstable_mockModule('uuid', () => ({ v4: () => 'test-uuid-1234' }))

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = await import('../controllers/productController.js')

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRes() {
  const res = {}
  res.json   = jest.fn(() => res)
  res.status = jest.fn(() => res)
  return res
}

function makeReq(overrides = {}) {
  return { query: {}, params: {}, body: {}, ...overrides }
}

const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'Chakli', category: 'snacks', price: 150, priceUnit: '/KG' },
  { id: 'p2', name: 'Laddu',  category: 'laddus', price: 300, priceUnit: '/KG' }
]

// Produces a Firestore-like snapshot; id is on doc.id, data() returns the rest
function makeSnapshot(docs) {
  return {
    forEach: (cb) => docs.forEach(({ id, ...rest }) => cb({ id, data: () => rest }))
  }
}

// Re-wires mock return values (called after jest.resetAllMocks() drops them)
function rewireMocks() {
  mockCollection.mockReturnValue({ doc: mockDocRef, ...queryChain })
  mockDocRef.mockReturnValue({ get: mockDocGet, set: mockDocSet, update: mockDocUpdate, delete: mockDocDelete })
  mockWhere.mockReturnValue(queryChain)
  mockOrderBy.mockReturnValue(queryChain)
  mockLimit.mockReturnValue(queryChain)
  mockStartAfter.mockReturnValue(queryChain)
}

// Bust the in-module cache by triggering a delete (which calls productCache.del)
async function bustCache() {
  mockDocGet.mockResolvedValueOnce({ exists: true, data: () => ({}) })
  mockDocDelete.mockResolvedValueOnce(undefined)
  await deleteProduct(makeReq({ params: { productId: 'bust' } }), makeRes())
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('productController – getProducts', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
    rewireMocks()
    // Ensure cache is cold before each test
    await bustCache()
  })

  it('fetches from Firestore on first call and returns all products', async () => {
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))

    const res = makeRes()
    await getProducts(makeReq(), res)

    expect(mockCollection).toHaveBeenCalledWith('products')
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'p1', name: 'Chakli' }),
        expect.objectContaining({ id: 'p2', name: 'Laddu' })
      ])
    )
  })

  it('returns cached data on second call without hitting Firestore again', async () => {
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))

    // First call populates cache
    await getProducts(makeReq(), makeRes())
    const callsAfterFirst = mockQueryGet.mock.calls.length

    // Second call should use cache
    const res2 = makeRes()
    await getProducts(makeReq(), res2)

    expect(mockQueryGet.mock.calls.length).toBe(callsAfterFirst) // no new Firestore call
    expect(res2.json).toHaveBeenCalled()
  })

  it('does NOT cache results when a category filter is supplied', async () => {
    mockQueryGet.mockResolvedValue(makeSnapshot([SAMPLE_PRODUCTS[0]]))

    const req = makeReq({ query: { category: 'snacks' } })
    await getProducts(req, makeRes())
    await getProducts(req, makeRes())

    // Should call Firestore both times since filtered results are not cached
    expect(mockQueryGet.mock.calls.length).toBe(2)
  })

  it('returns 500 when Firestore throws', async () => {
    mockQueryGet.mockRejectedValue(new Error('Firestore down'))

    const res = makeRes()
    await getProducts(makeReq(), res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Firestore down' })
  })
})

describe('productController – getProductById', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    rewireMocks()
  })

  it('returns the product when it exists', async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ name: 'Chakli', price: 150 }) })

    const res = makeRes()
    await getProductById(makeReq({ params: { productId: 'p1' } }), res)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1', name: 'Chakli' }))
  })

  it('returns 404 when the product does not exist', async () => {
    mockDocGet.mockResolvedValue({ exists: false })

    const res = makeRes()
    await getProductById(makeReq({ params: { productId: 'nope' } }), res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' })
  })
})

describe('productController – createProduct', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    rewireMocks()
  })

  it('returns 400 when required fields are missing', async () => {
    const res = makeRes()
    await createProduct(makeReq({ body: { name: 'Test' } }), res) // missing category & price

    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('creates product and returns 201 with the new id', async () => {
    mockDocSet.mockResolvedValue(undefined)

    const res = makeRes()
    await createProduct(makeReq({ body: { name: 'Chakli', category: 'snacks', price: '150' } }), res)

    expect(mockDocSet).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-uuid-1234', name: 'Chakli' }))
  })

  it('invalidates the products cache after creating a product', async () => {
    // Prime cache
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))
    await getProducts(makeReq(), makeRes())
    const callsBefore = mockQueryGet.mock.calls.length

    // Create a product – should bust cache
    mockDocSet.mockResolvedValue(undefined)
    await createProduct(makeReq({ body: { name: 'New', category: 'snacks', price: '100' } }), makeRes())

    // Next GET should call Firestore again
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))
    await getProducts(makeReq(), makeRes())

    expect(mockQueryGet.mock.calls.length).toBe(callsBefore + 1)
  })
})

describe('productController – updateProduct', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    rewireMocks()
  })

  it('returns 404 when product does not exist', async () => {
    mockDocGet.mockResolvedValue({ exists: false })

    const res = makeRes()
    await updateProduct(makeReq({ params: { productId: 'ghost' }, body: { name: 'X' } }), res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('updates the product and invalidates cache', async () => {
    // Prime cache
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))
    await getProducts(makeReq(), makeRes())
    const callsBefore = mockQueryGet.mock.calls.length

    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ name: 'Old', price: 100 }) })
    mockDocUpdate.mockResolvedValue(undefined)
    await updateProduct(makeReq({ params: { productId: 'p1' }, body: { name: 'Updated' } }), makeRes())

    // Next GET should hit Firestore
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))
    await getProducts(makeReq(), makeRes())

    expect(mockQueryGet.mock.calls.length).toBe(callsBefore + 1)
  })
})

describe('productController – deleteProduct', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    rewireMocks()
  })

  it('returns 404 when product does not exist', async () => {
    mockDocGet.mockResolvedValue({ exists: false })

    const res = makeRes()
    await deleteProduct(makeReq({ params: { productId: 'ghost' } }), res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('deletes product, returns success message, and invalidates cache', async () => {
    // Prime cache
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))
    await getProducts(makeReq(), makeRes())
    const callsBefore = mockQueryGet.mock.calls.length

    mockDocGet.mockResolvedValue({ exists: true, data: () => ({}) })
    mockDocDelete.mockResolvedValue(undefined)
    const res = makeRes()
    await deleteProduct(makeReq({ params: { productId: 'p1' } }), res)

    expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' })

    // Next GET should hit Firestore
    mockQueryGet.mockResolvedValue(makeSnapshot([SAMPLE_PRODUCTS[1]]))
    await getProducts(makeReq(), makeRes())

    expect(mockQueryGet.mock.calls.length).toBe(callsBefore + 1)
  })
})

describe('productController – getProducts (paginated)', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
    rewireMocks()
    await bustCache()
  })

  it('returns paginated products wrapped in { products, hasMore, lastDocId }', async () => {
    mockQueryGet.mockResolvedValue(makeSnapshot(SAMPLE_PRODUCTS))

    const res = makeRes()
    await getProducts(makeReq({ query: { limit: '8' } }), res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({ id: 'p1', name: 'Chakli' }),
          expect.objectContaining({ id: 'p2', name: 'Laddu' })
        ]),
        hasMore: false,
        lastDocId: 'p2'
      })
    )
  })

  it('sets hasMore=true when the number of returned docs equals the limit', async () => {
    const fullPage = Array.from({ length: 3 }, (_, i) => ({
      id: `p${i}`, name: `Product ${i}`, category: 'snacks', price: 100
    }))
    mockQueryGet.mockResolvedValue(makeSnapshot(fullPage))

    const res = makeRes()
    await getProducts(makeReq({ query: { limit: '3' } }), res)

    const call = res.json.mock.calls[0][0]
    expect(call.hasMore).toBe(true)
    expect(call.products).toHaveLength(3)
    expect(call.lastDocId).toBe('p2')
  })

  it('fetches cursor document and passes it to startAfter when lastDocId is given', async () => {
    mockDocGet.mockResolvedValue({ exists: true, data: () => ({ name: 'cursor' }) })
    mockQueryGet.mockResolvedValue(makeSnapshot([SAMPLE_PRODUCTS[1]]))

    const res = makeRes()
    await getProducts(makeReq({ query: { limit: '8', lastDocId: 'p1' } }), res)

    // The cursor doc must be fetched via doc().get()
    expect(mockDocGet).toHaveBeenCalled()
    // startAfter should have been called with the cursor document
    expect(mockStartAfter).toHaveBeenCalled()
    const call = res.json.mock.calls[0][0]
    expect(call.products).toHaveLength(1)
  })

  it('filters by category in paginated mode', async () => {
    mockQueryGet.mockResolvedValue(makeSnapshot([SAMPLE_PRODUCTS[0]]))

    const res = makeRes()
    await getProducts(makeReq({ query: { limit: '8', category: 'snacks' } }), res)

    expect(mockWhere).toHaveBeenCalledWith('category', '==', 'snacks')
    const call = res.json.mock.calls[0][0]
    expect(call.products[0].category).toBe('snacks')
  })

  it('returns 500 when Firestore throws in paginated mode', async () => {
    mockQueryGet.mockRejectedValue(new Error('Firestore paginated error'))

    const res = makeRes()
    await getProducts(makeReq({ query: { limit: '8' } }), res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Firestore paginated error' })
  })
})
