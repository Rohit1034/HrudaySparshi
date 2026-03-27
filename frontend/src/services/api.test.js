import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'

// Mock firebase so the module loads without real credentials
vi.mock('../config/firebase', () => ({
  auth: { currentUser: null }
}))

const { default: api } = await import('./api')

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('api – configuration', () => {
  it('has a 30-second timeout', () => {
    expect(api.defaults.timeout).toBe(30000)
  })
})

describe('api – retry interceptor', () => {
  let mock

  beforeEach(() => {
    // Use a fresh mock adapter and bypass the fake-timer complexity
    // by using real timers with very short delays (we override the 1500ms delay).
    // Since we cannot easily control the retry delay inside api.js, we just
    // assert the number of HTTP attempts, not exact timing.
    mock = new MockAdapter(api, { delayResponse: 0 })
  })

  afterEach(() => {
    mock.restore()
  })

  it('returns data on a successful first attempt', async () => {
    mock.onGet('/products').reply(200, [{ id: '1', name: 'Chakli' }])

    const res = await api.get('/products')

    expect(res.status).toBe(200)
    expect(res.data).toHaveLength(1)
  })

  it('does NOT retry on a 404 client error', async () => {
    mock.onGet('/products').reply(404, { error: 'Not found' })

    await expect(api.get('/products')).rejects.toMatchObject({
      response: { status: 404 }
    })
    // Only 1 attempt
    expect(mock.history.get.length).toBe(1)
  })

  it('does NOT retry on a 401 unauthorised error', async () => {
    mock.onGet('/products').reply(401, { error: 'Unauthorized' })

    await expect(api.get('/products')).rejects.toMatchObject({
      response: { status: 401 }
    })
    expect(mock.history.get.length).toBe(1)
  })

  it('retries up to 2 times on a 500 server error and eventually succeeds', async () => {
    // First two calls return 500, third succeeds
    mock
      .onGet('/products')
      .replyOnce(500, { error: 'Server error' })
      .onGet('/products')
      .replyOnce(500, { error: 'Server error' })
      .onGet('/products')
      .replyOnce(200, [{ id: '1' }])

    // Override the delay so the test doesn't take 4.5 seconds
    vi.spyOn(global, 'setTimeout').mockImplementation((fn) => { fn(); return 0 })

    const res = await api.get('/products')

    expect(res.status).toBe(200)
    expect(mock.history.get.length).toBe(3) // original + 2 retries

    vi.restoreAllMocks()
  }, 10000)

  it('retries up to 2 times on a network error and eventually succeeds', async () => {
    // First two calls are network errors, third succeeds
    mock
      .onGet('/products')
      .networkErrorOnce()
      .onGet('/products')
      .networkErrorOnce()
      .onGet('/products')
      .replyOnce(200, [{ id: '1' }])

    vi.spyOn(global, 'setTimeout').mockImplementation((fn) => { fn(); return 0 })

    const res = await api.get('/products')

    expect(res.status).toBe(200)
    expect(mock.history.get.length).toBe(3)

    vi.restoreAllMocks()
  }, 10000)

  it('throws after exhausting 2 retries on persistent 500 errors', async () => {
    mock.onGet('/products').reply(500, { error: 'Always failing' })

    vi.spyOn(global, 'setTimeout').mockImplementation((fn) => { fn(); return 0 })

    await expect(api.get('/products')).rejects.toMatchObject({
      response: { status: 500 }
    })
    expect(mock.history.get.length).toBe(3) // original + 2 retries

    vi.restoreAllMocks()
  }, 10000)

  it('throws after exhausting 2 retries on persistent network errors', async () => {
    mock.onGet('/products').networkError()

    vi.spyOn(global, 'setTimeout').mockImplementation((fn) => { fn(); return 0 })

    await expect(api.get('/products')).rejects.toBeDefined()
    expect(mock.history.get.length).toBe(3)

    vi.restoreAllMocks()
  }, 10000)
})
