import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { timeAgo } from '@/lib/community/timeAgo'

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('returns "just now" for timestamps under 1 minute ago', () => {
    const now = new Date('2026-01-01T11:59:30Z').toISOString()
    expect(timeAgo(now)).toBe('just now')
  })

  it('returns minutes for timestamps under 1 hour ago', () => {
    const thirtyMinsAgo = new Date('2026-01-01T11:30:00Z').toISOString()
    expect(timeAgo(thirtyMinsAgo)).toBe('30m ago')
  })

  it('returns hours for timestamps under 24 hours ago', () => {
    const threeHoursAgo = new Date('2026-01-01T09:00:00Z').toISOString()
    expect(timeAgo(threeHoursAgo)).toBe('3h ago')
  })

  it('returns days for timestamps under 30 days ago', () => {
    const fiveDaysAgo = new Date('2025-12-27T12:00:00Z').toISOString()
    expect(timeAgo(fiveDaysAgo)).toBe('5d ago')
  })

  it('returns a locale date string for timestamps over 30 days ago', () => {
    const twoMonthsAgo = new Date('2025-10-01T12:00:00Z').toISOString()
    const result = timeAgo(twoMonthsAgo)
    expect(result).not.toMatch(/ago$/)
    expect(result).toMatch(/\d{4}|\w+ \d+/)
  })
})
