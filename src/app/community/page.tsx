import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/community/PostCard'
import CommunitySidebar from '@/components/community/CommunitySidebar'
import Link from 'next/link'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diamond Community — Ask, Share & Discover | DiamondCritics',
  description: 'Join the Diamond Community at DiamondCritics. Ask diamond questions, share engagement ring photos, get GIA-backed advice, and connect with diamond enthusiasts worldwide.',
}

type SortMode = 'hot' | 'new' | 'top'

function hotScore(score: number, createdAt: string) {
  const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3600000
  return Math.log(Math.max(score, 1)) - ageHours / 45
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; registered?: string }>
}) {
  const { sort, registered } = await searchParams
  const sortMode: SortMode = sort === 'new' ? 'new' : sort === 'top' ? 'top' : 'hot'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select('*, author:profiles(id,username,avatar_url), community:communities(id,slug,name)')
    .eq('is_deleted', false)

  if (sortMode === 'new') query = query.order('created_at', { ascending: false })
  else if (sortMode === 'top') query = query.order('score', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: rawPosts } = await query.limit(50)

  let userVotes: Record<string, -1 | 1> = {}
  if (user && rawPosts?.length) {
    const { data: votes } = await supabase
      .from('post_votes').select('post_id, vote')
      .eq('user_id', user.id)
      .in('post_id', rawPosts.map(p => p.id))
    if (votes) userVotes = Object.fromEntries(votes.map(v => [v.post_id, v.vote]))
  }

  let posts: Post[] = (rawPosts ?? []).map(p => ({ ...p, user_vote: userVotes[p.id] ?? 0 }))
  if (sortMode === 'hot') {
    posts = posts.sort((a, b) => hotScore(b.score, b.created_at) - hotScore(a.score, a.created_at))
  }

  const { data: communities } = await supabase
    .from('communities').select('*').order('member_count', { ascending: false })

  const sortTabs: { key: SortMode; label: string; emoji: string }[] = [
    { key: 'hot', label: 'Hot', emoji: '🔥' },
    { key: 'new', label: 'New', emoji: '✨' },
    { key: 'top', label: 'Top', emoji: '📈' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>

      {/* ── Main column ── */}
      <div>

        {/* Email confirmation banner */}
        {registered === '1' && (
          <div style={{
            background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px',
            padding: '12px 16px', marginBottom: '16px',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            fontSize: '13px', color: '#92400E',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,12 2,6"/>
            </svg>
            <span><strong>Check your email.</strong> We sent you a confirmation link. Click it to activate your account, then log in.</span>
          </div>
        )}

        {/* Sort bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '12px',
        }}>
          {sortTabs.map(tab => (
            <Link key={tab.key} href={`/community?sort=${tab.key}`} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              transition: 'all 0.15s',
              ...(sortMode === tab.key
                ? { background: '#F0E8D8', color: '#1C1209', fontWeight: 600 }
                : { color: '#9A8F87' }
              ),
            }}>
              <span>{tab.emoji}</span>
              {tab.label}
            </Link>
          ))}

          {user && communities?.[0] && (
            <Link href={`/community/r/${communities[0].slug}/submit`} style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(145deg, #D4A843, #B8881E)',
              color: '#fff', fontWeight: 600, fontSize: '13px',
              padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Post
            </Link>
          )}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
            padding: '60px 32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 16px',
              background: 'linear-gradient(145deg, #F5EDD8, #EDD8AA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="#B8881E" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="#B8881E" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '18px', color: '#1C1209', marginBottom: '8px' }}>
              No posts yet
            </p>
            <p style={{ fontSize: '13px', color: '#9A8F87', marginBottom: '24px' }}>
              Be the first to share something in this community
            </p>
            <Link href={user && communities?.[0] ? `/community/r/${communities[0].slug}/submit` : '/community/register'}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(145deg, #D4A843, #B8881E)',
                color: '#fff', fontWeight: 600, fontSize: '13px',
                padding: '10px 24px', borderRadius: '8px', textDecoration: 'none',
              }}>
              {user ? 'Create First Post' : 'Join & Post'}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)}
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <CommunitySidebar communities={communities ?? []} user={user} />
    </div>
  )
}
