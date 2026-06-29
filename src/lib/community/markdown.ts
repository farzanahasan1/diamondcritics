import { marked, Renderer } from 'marked'

// Custom renderer — opens external links in new tab, strips javascript: hrefs
const renderer = new Renderer()
renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
  const safe = href && /^https?:\/\//i.test(href) ? href : '#'
  const t = title ? ` title="${title}"` : ''
  const external = safe !== '#' ? ' target="_blank" rel="nofollow noopener noreferrer"' : ''
  return `<a href="${safe}"${t}${external}>${text}</a>`
}

marked.use({ renderer })

// Strip XSS vectors: script tags, ALL inline event handlers, dangerous protocols, SVG abuse
function sanitize(html: string): string {
  return html
    // Remove <script> blocks entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove <style> blocks (can contain expression() exploits)
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove on* event handlers regardless of quote style (onerror, onload, onclick, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    // Neutralise javascript: and data: URIs in href/src/action
    .replace(/(href|src|action)\s*=\s*["']\s*(?:javascript|data|vbscript):/gi, '$1="#blocked:')
    // Remove <iframe>, <object>, <embed>, <base>, <form> — not needed in comments
    .replace(/<\/?(iframe|object|embed|base|form|input|button|select|textarea)\b[^>]*>/gi, '')
    // Remove SVG event attributes (onload etc. inside <svg ...>)
    .replace(/<svg[^>]*>/gi, '<svg>')
}

export function renderMarkdown(text: string): string {
  const html = marked.parse(text, { breaks: true, gfm: true }) as string
  return sanitize(html)
}
