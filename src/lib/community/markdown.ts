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

// Strip event handlers and script tags from any HTML that slips through
function sanitize(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, 'blocked:')
}

export function renderMarkdown(text: string): string {
  const html = marked.parse(text, { breaks: true, gfm: true }) as string
  return sanitize(html)
}
