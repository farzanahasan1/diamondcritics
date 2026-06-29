import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { FLAIR_OPTIONS } from '@/types/community'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — Community Search` : 'Search Community',
    description: `Search the DiamondCritics community for posts about ${q ?? 'diamonds'}.`,
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return days < 30 ? `${days}d ago` : new Date(dateStr).toLocaleDateString()
}

// Bold-highlight every occurrence of `term` inside `text`
function highlight(text: string, term: string): React.ReactNode[] {
  if (!term) return [text]
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} style={{ background: '#FEF3C7', color: '#92400E', borderRadius: '2px', padding: '0 1px' }}>{part}</mark>
      : part
  )
}

// Return a snippet of body text around the first match
function snippet(body: string | null, term: string, maxLen = 160): string {
  if (!body) return ''
  const idx = body.toLowerCase().indexOf(term.toLowerCase())
  if (idx === -1) return body.slice(0, maxLen) + (body.length > maxLen ? '…' : '')
  const start = Math.max(0, idx - 60)
  const end = Math.min(body.length, idx + 100)
  return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '')
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let posts: any[] = []
  let error = false

  if (query.length >= 2) {
    const safe = query.replace(/[%_]/g, '\\$&') // escape ILIKE wildcards
    const { data, error: err } = await supabase
      .from('posts')
      .select('id, title, body, type, flair, score, comment_count, created_at, author_id, community_id')
      .eq('is_deleted', false)
      .eq('is_draft', false)
      .or(`title.ilike.%${safe}%,body.ilike.%${safe}%`)
      .order('score', { ascending: false })
      .limit(30)

    if (err) { error = true } else { posts = data ?? [] }

    // Fetch authors + communities separately
    if (posts.length) {
      const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))]
      const communityIds = [...new Set(posts.map(p => p.community_id).filter(Boolean))]

      const [{ data: authors }, { data: communities }] = await Promise.all([
        authorIds.length ? supabase.from('profiles').select('id, username').in('id', authorIds) : Promise.resolve({ data: [] }),
        communityIds.length ? supabase.from('communities').select('id, slug, name').in('id', communityIds) : Promise.resolve({ data: [] }),
      ])

      const authorMap = Object.fromEntries((authors ?? []).map(a => [a.id, a]))
      const communityMap = Object.fromEntries((communities ?? []).map(c => [c.id, c]))

      posts = posts.map(p => ({
        ...p,
        author: authorMap[p.author_id] ?? null,
        community: communityMap[p.community_id] ?? null,
      }))
    }
  }

  const typeIcon = (type: string) => {
    if (type === 'image') return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
      </svg>
    )
    if (type === 'link') return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    )
    return null
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 0' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '20px', fontWeight: 600, color: '#1C1209', marginBottom: '4px' }}>
          {query ? `Search results for "${query}"` : 'Search the community'}
        </h1>
        {query && !error && (
          <p style={{ fontSize: '13px', color: '#9A8F87' }}>
            {posts.length === 0
              ? 'No posts found. Try different keywords.'
              : `${posts.length} post${posts.length === 1 ? '' : 's'} found`}
          </p>
        )}
      </div>

      {/* Search hint when empty */}
      {!query && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', padding: '40px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4C8BE" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '12px' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#3A2208', marginBottom: '6px' }}>Search for anything</p>
          <p style={{ fontSize: '13px', color: '#9A8F87' }}>Try "VS2 clarity", "princess cut", "Blue Nile", "engagement ring"…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#DC2626' }}>
          Search failed. Please try again.
        </div>
      )}

      {/* Too short */}
      {query && query.length < 2 && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', padding: '24px', fontSize: '13px', color: '#9A8F87', textAlign: 'center' }}>
          Please enter at least 2 characters to search.
        </div>
      )}

      {/* Results */}
      {posts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map(post => {
            const flair = post.flair ? FLAIR_OPTIONS.find(f => f.value === post.flair) : null
            const bodySnip = snippet(post.body, query)

            return (
              <Link
                key={post.id}
                href={`/community/post/${post.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article className="c-search-result" style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #E2DDD7',
                  padding: '14px 16px',
                }}>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#9A8F87', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {post.community && (
                      <span style={{ fontWeight: 600, color: '#3A2208' }}>r/{post.community.slug}</span>
                    )}
                    {post.community && <span style={{ color: '#D4C8BE' }}>·</span>}
                    {post.author && <span>u/{post.author.username}</span>}
                    <span style={{ color: '#D4C8BE' }}>·</span>
                    <span>{timeAgo(post.created_at)}</span>
                    {post.type !== 'text' && (
                      <>
                        <span style={{ color: '#D4C8BE' }}>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#B0A89E' }}>
                          {typeIcon(post.type)}
                          {post.type}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Flair */}
                  {flair && (
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: 700, background: flair.bg, color: flair.color,
                      marginBottom: '5px',
                    }}>
                      {flair.label}
                    </span>
                  )}

                  {/* Title */}
                  <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1C1209', lineHeight: 1.4, marginBottom: bodySnip ? '6px' : '0' }}>
                    {highlight(post.title, query)}
                  </h2>

                  {/* Body snippet */}
                  {bodySnip && (
                    <p style={{ fontSize: '13px', color: '#7A6F66', lineHeight: 1.55, margin: 0 }}>
                      {highlight(bodySnip, query)}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', fontSize: '12px', color: '#9A8F87' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      {post.score}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                      </svg>
                      {post.comment_count}
                    </span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}

      {/* No results */}
      {query.length >= 2 && !error && posts.length === 0 && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', padding: '40px', textAlign: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4C8BE" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '12px' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#3A2208', marginBottom: '6px' }}>No results for "{query}"</p>
          <p style={{ fontSize: '13px', color: '#9A8F87', marginBottom: '16px' }}>Try shorter or different keywords.</p>
          <Link href="/community" style={{
            display: 'inline-block', padding: '8px 20px', borderRadius: '8px',
            background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>
            Browse all posts
          </Link>
        </div>
      )}

    </div>
  )
}
