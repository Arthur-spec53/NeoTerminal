import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>'
    const output = sanitizeHtml(input)
    expect(output).toContain('<p>')
    expect(output).not.toContain('<script>')
  })

  it('should allow basic formatting tags', () => {
    const input = '<p><strong>Bold</strong> and <em>italic</em></p>'
    const output = sanitizeHtml(input)
    expect(output).toContain('<strong>Bold</strong>')
    expect(output).toContain('<em>italic</em>')
  })

  it('should allow safe links but strip event handlers', () => {
    const input = '<a href="https://example.com" onclick="alert(1)">link</a>'
    const output = sanitizeHtml(input)
    expect(output).toContain('href="https://example.com"')
    expect(output).not.toContain('onclick')
  })
})


