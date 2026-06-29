import { describe, it, expect } from 'vitest'
import { containsSpam, isDisposableEmail } from '@/lib/community/moderation'

describe('containsSpam', () => {
  it('returns false for normal diamond discussion', () => {
    expect(containsSpam('What do you think about a VS2 G color round brilliant?')).toBe(false)
    expect(containsSpam('Looking for advice on a 1.5ct princess cut from Blue Nile')).toBe(false)
  })

  it('detects crypto giveaway spam', () => {
    expect(containsSpam('Win a crypto giveaway just click here')).toBe(true)
  })

  it('detects excessive URLs', () => {
    expect(containsSpam('Visit https://a.com and https://b.com and https://c.com')).toBe(true)
  })

  it('detects known spam phrases', () => {
    expect(containsSpam('whatsapp me for best price')).toBe(true)
    expect(containsSpam('dm me for price on this ring')).toBe(true)
  })

  it('detects online casino spam', () => {
    expect(containsSpam('Best online casino for diamond lovers')).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(containsSpam('FREE BITCOIN for diamond buyers')).toBe(true)
  })
})

describe('isDisposableEmail', () => {
  it('rejects known disposable domains', () => {
    expect(isDisposableEmail('user@mailinator.com')).toBe(true)
    expect(isDisposableEmail('test@yopmail.com')).toBe(true)
    expect(isDisposableEmail('hello@guerrillamail.com')).toBe(true)
  })

  it('allows legitimate email domains', () => {
    expect(isDisposableEmail('user@gmail.com')).toBe(false)
    expect(isDisposableEmail('buyer@outlook.com')).toBe(false)
    expect(isDisposableEmail('expert@icloud.com')).toBe(false)
  })

  it('handles emails without @ gracefully', () => {
    expect(isDisposableEmail('notanemail')).toBe(false)
  })
})
