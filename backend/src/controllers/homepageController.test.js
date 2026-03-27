import { describe, it, expect, jest, beforeEach } from '@jest/globals'

// ── Firebase mock ─────────────────────────────────────────────────────────────
const mockDocGet = jest.fn()
const mockDocSet = jest.fn()
const mockDocRef = jest.fn(() => ({ get: mockDocGet, set: mockDocSet }))
const mockCollection = jest.fn(() => ({ doc: mockDocRef }))

jest.unstable_mockModule('../config/firebase.js', () => ({
  db: { collection: mockCollection }
}))

const { getHomepageContent, updateHomepageContent } =
  await import('../controllers/homepageController.js')

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeRes() {
  const res = {}
  res.json   = jest.fn(() => res)
  res.status = jest.fn(() => res)
  return res
}

function rewireMocks() {
  mockCollection.mockReturnValue({ doc: mockDocRef })
  mockDocRef.mockReturnValue({ get: mockDocGet, set: mockDocSet })
}

// Bust the in-module cache by running an update (which calls homepageCache.del)
async function bustCache() {
  mockDocSet.mockResolvedValueOnce(undefined)
  await updateHomepageContent({ query: {}, params: {}, body: {} }, makeRes())
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('homepageController – getHomepageContent', () => {
  beforeEach(async () => {
    jest.resetAllMocks()
    rewireMocks()
    await bustCache()
  })

  it('returns content from Firestore when the document exists', async () => {
    const content = { businessName: 'Hruday Sparshi', heroTitle: 'Welcome' }
    mockDocGet.mockResolvedValue({ exists: true, data: () => content })

    const res = makeRes()
    await getHomepageContent({}, res)

    expect(res.json).toHaveBeenCalledWith(content)
  })

  it('returns default content when the Firestore document does not exist', async () => {
    mockDocGet.mockResolvedValue({ exists: false })

    const res = makeRes()
    await getHomepageContent({}, res)

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        businessName: 'Hruday Sparshi',
        heroTitle: 'Welcome to Hruday Sparshi'
      })
    )
  })

  it('returns cached data on second call without hitting Firestore again', async () => {
    const content = { businessName: 'Hruday Sparshi', heroTitle: 'Welcome' }
    mockDocGet.mockResolvedValue({ exists: true, data: () => content })

    // First call – populates cache
    await getHomepageContent({}, makeRes())
    const callsAfterFirst = mockDocGet.mock.calls.length

    // Second call – should use cache
    const res2 = makeRes()
    await getHomepageContent({}, res2)

    expect(mockDocGet.mock.calls.length).toBe(callsAfterFirst)
    expect(res2.json).toHaveBeenCalledWith(content)
  })

  it('returns 500 when Firestore throws', async () => {
    mockDocGet.mockRejectedValue(new Error('DB unavailable'))

    const res = makeRes()
    await getHomepageContent({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'DB unavailable' })
  })
})

describe('homepageController – updateHomepageContent', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    rewireMocks()
  })

  it('saves content to Firestore and returns the updated content', async () => {
    mockDocSet.mockResolvedValue(undefined)

    const body = { businessName: 'Test Business', heroTitle: 'Hello!' }
    const res = makeRes()
    await updateHomepageContent({ query: {}, params: {}, body }, res)

    expect(mockDocSet).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Homepage content updated successfully', businessName: 'Test Business' })
    )
  })

  it('invalidates cache so the next GET re-fetches from Firestore', async () => {
    // Prime the cache
    const initial = { businessName: 'Old', heroTitle: 'Old title' }
    mockDocGet.mockResolvedValue({ exists: true, data: () => initial })
    await getHomepageContent({}, makeRes())
    const callsBefore = mockDocGet.mock.calls.length

    // Update – should bust cache
    mockDocSet.mockResolvedValue(undefined)
    await updateHomepageContent({ query: {}, params: {}, body: { businessName: 'New' } }, makeRes())

    // Next GET should call Firestore again
    const updated = { businessName: 'New', heroTitle: 'Updated title' }
    mockDocGet.mockResolvedValue({ exists: true, data: () => updated })
    const res = makeRes()
    await getHomepageContent({}, res)

    expect(mockDocGet.mock.calls.length).toBe(callsBefore + 1)
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  it('returns 500 when Firestore throws on update', async () => {
    mockDocSet.mockRejectedValue(new Error('Write failed'))

    const res = makeRes()
    await updateHomepageContent({ query: {}, params: {}, body: {} }, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Write failed' })
  })
})
