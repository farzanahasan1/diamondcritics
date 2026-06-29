import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { timeAgo } from '@/lib/community/timeAgo'
import { hotScore } from '@/lib/community/hotScore'

// ── timeAgo ──────────────────────────────────────────────────────────────────
describe('timeAgo', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('returns "just now" for 0 seconds ago', () => {
    const now = new Date('2026-01-01T12:00:00Z')
    vi.setSystemTime(now)
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('just now')
  })

  it('returns "just now" for 30 seconds ago', () => {
    vi.setSystemTime(new Date('2026-01-01T12:00:30Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('just now')
  })

  it('returns "1m ago" for 1 minute ago', () => {
    vi.setSystemTime(new Date('2026-01-01T12:01:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('1m ago')
  })

  it('returns "5m ago" for 5 minutes ago', () => {
    vi.setSystemTime(new Date('2026-01-01T12:05:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('5m ago')
  })

  it('returns "59m ago" for 59 minutes ago', () => {
    vi.setSystemTime(new Date('2026-01-01T12:59:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('59m ago')
  })

  it('returns "1h ago" for 1 hour ago', () => {
    vi.setSystemTime(new Date('2026-01-01T13:00:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('1h ago')
  })

  it('returns "3h ago" for 3 hours ago', () => {
    vi.setSystemTime(new Date('2026-01-01T15:00:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('3h ago')
  })

  it('returns "23h ago" for 23 hours ago', () => {
    vi.setSystemTime(new Date('2026-01-02T11:00:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('23h ago')
  })

  it('returns "1d ago" for 1 day ago', () => {
    vi.setSystemTime(new Date('2026-01-02T12:00:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('1d ago')
  })

  it('returns "7d ago" for 7 days ago', () => {
    vi.setSystemTime(new Date('2026-01-08T12:00:00Z'))
    expect(timeAgo('2026-01-01T12:00:00Z')).toBe('7d ago')
  })

  it('returns a date string for 30+ days ago', () => {
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'))
    const result = timeAgo('2026-01-01T12:00:00Z')
    expect(result).not.toContain('ago')
    expect(result.length).toBeGreaterThan(0)
  })
})

// ── hotScore ──────────────────────────────────────────────────────────────────
describe('hotScore', () => {
  it('returns a number', () => {
    expect(typeof hotScore(10, new Date().toISOString())).toBe('number')
  })

  it('higher-score post beats same-age lower-score post', () => {
    const now = new Date().toISOString()
    expect(hotScore(100, now)).toBeGreaterThan(hotScore(1, now))
  })

  it('newer post beats equally-scored older post', () => {
    const old = new Date(Date.now() - 48 * 3_600_000).toISOString()
    const fresh = new Date(Date.now() - 1 * 3_600_000).toISOString()
    expect(hotScore(5, fresh)).toBeGreaterThan(hotScore(5, old))
  })

  it('handles score=0 without throwing (clamps to 1)', () => {
    expect(() => hotScore(0, new Date().toISOString())).not.toThrow()
    expect(hotScore(0, new Date().toISOString())).toBe(hotScore(1, new Date().toISOString()))
  })

  it('handles negative score identically to 0 (clamped to 1)', () => {
    const now = new Date().toISOString()
    expect(hotScore(-5, now)).toBe(hotScore(1, now))
  })

  it('old high-score post can still beat new low-score post', () => {
    const old = new Date(Date.now() - 10 * 3_600_000).toISOString()
    const fresh = new Date(Date.now() - 1 * 3_600_000).toISOString()
    expect(hotScore(10000, old)).toBeGreaterThan(hotScore(1, fresh))
  })
})
