import { createCache } from '../utils/cache.js'
import { describe, it, expect, jest } from '@jest/globals'

describe('createCache', () => {
  it('returns null for a key that was never set', () => {
    const cache = createCache(5000)
    expect(cache.get('missing')).toBeNull()
  })

  it('returns the stored value immediately after set', () => {
    const cache = createCache(5000)
    cache.set('k', { data: 42 })
    expect(cache.get('k')).toEqual({ data: 42 })
  })

  it('returns null for a deleted key', () => {
    const cache = createCache(5000)
    cache.set('k', 'value')
    cache.del('k')
    expect(cache.get('k')).toBeNull()
  })

  it('returns null after TTL has expired', () => {
    jest.useFakeTimers()
    const TTL = 1000
    const cache = createCache(TTL)
    cache.set('k', 'value')

    // Advance time just past the TTL
    jest.advanceTimersByTime(TTL + 1)
    expect(cache.get('k')).toBeNull()
    jest.useRealTimers()
  })

  it('returns the value before TTL has expired', () => {
    jest.useFakeTimers()
    const TTL = 1000
    const cache = createCache(TTL)
    cache.set('k', 'hello')

    jest.advanceTimersByTime(TTL - 1)
    expect(cache.get('k')).toBe('hello')
    jest.useRealTimers()
  })

  it('overwrites an existing entry on a second set', () => {
    const cache = createCache(5000)
    cache.set('k', 'first')
    cache.set('k', 'second')
    expect(cache.get('k')).toBe('second')
  })

  it('isolates entries between two independent cache instances', () => {
    const a = createCache(5000)
    const b = createCache(5000)
    a.set('shared', 'from-a')
    expect(b.get('shared')).toBeNull()
  })
})
