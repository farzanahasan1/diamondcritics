import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '@/lib/community/markdown'

describe('renderMarkdown XSS sanitizer', () => {
  it('renders basic markdown to HTML', () => {
    const result = renderMarkdown('**bold** and _italic_')
    expect(result).toContain('<strong>')
    expect(result).toContain('<em>')
  })

  it('strips script tags', () => {
    const result = renderMarkdown('<script>alert("xss")</script>hello')
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert')
  })

  it('strips inline event handlers', () => {
    const result = renderMarkdown('<img src="x" onerror="alert(1)">')
    expect(result).not.toContain('onerror')
  })

  it('strips javascript: href', () => {
    const result = renderMarkdown('[click](javascript:alert(1))')
    expect(result).not.toContain('javascript:')
  })

  it('strips data: src', () => {
    const result = renderMarkdown('<img src="data:text/html,<script>alert(1)</script>">')
    expect(result).not.toContain('data:text')
  })

  it('strips iframe tags', () => {
    const result = renderMarkdown('<iframe src="https://evil.com"></iframe>')
    expect(result).not.toContain('iframe')
  })

  it('strips form/input tags', () => {
    const result = renderMarkdown('<form action="/hack"><input type="text"></form>')
    expect(result).not.toContain('<form')
    expect(result).not.toContain('<input')
  })

  it('allows safe markdown links', () => {
    const result = renderMarkdown('[Blue Nile](https://bluenile.com)')
    expect(result).toContain('href="https://bluenile.com"')
    expect(result).toContain('Blue Nile')
  })

  it('preserves code blocks', () => {
    const result = renderMarkdown('`const x = 1`')
    expect(result).toContain('<code>')
  })
})
