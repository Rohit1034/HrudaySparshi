/**
 * Simple in-memory cache with TTL.
 * Creates an isolated cache store per call so each controller
 * can maintain its own namespace.
 */
export function createCache(ttlMs) {
  const store = new Map()

  function get(key) {
    const entry = store.get(key)
    if (!entry) return null
    if (Date.now() - entry.ts > ttlMs) {
      store.delete(key)
      return null
    }
    return entry.value
  }

  function set(key, value) {
    store.set(key, { value, ts: Date.now() })
  }

  function del(key) {
    store.delete(key)
  }

  return { get, set, del }
}
