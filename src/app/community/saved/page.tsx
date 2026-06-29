import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/community/PostCard'
import type { Metadata } from 'next'
import type { Post } from '@/types/community'

export const metadata: Metadata = {
  title: 'Saved Posts — Diamond Community',
  description: 'Your saved posts from the DiamondCritics community.',
}

export default async function SavedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/community/login')

  // Fetch saved post IDs ordered by save date
  const { data: saves } = await supabase
    .from('saved_posts')
    .select('post_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  let posts: Post[] = []

  if (saves?.length) {
    const postIds = saves.map(s => s.post_id)
    const { data: rawPosts } = await supabase
      .from('posts')
      .select('*')
      .in('id', postIds)
      .eq('is_deleted', false)

    if (rawPosts?.length) {
      const authorIds = [...new Set(rawPosts.map(p => p.author_id).filter(Boolean))]
      const communityIds = [...new Set(rawPosts.map(p => p.community_id).filter(Boolean))]

      const [{ data: authors }, { data: communities }] = await Promise.all([
        authorIds.length ? supabase.from('profiles').select('id,username,avatar_url').in('id', authorIds) : Promise.resolve({ data: [] }),
        communityIds.length ? supabase.from('communities').select('id,slug,name').in('id', communityIds) : Promise.resolve({ data: [] }),
      ])

      const authorMap = Object.fromEntries((authors ?? []).map(a => [a.id, a]))
      const communityMap = Object.fromEntries((communities ?? []).map(c => [c.id, c]))

      // User votes
      const { data: votes } = await supabase.from('post_votes').select('post_id, vote').eq('user_id', user.id).in('post_id', postIds)
      const voteMap = Object.fromEntries((votes ?? []).map(v => [v.post_id, v.vote]))

      // Re-order to match save order
      const postMap = Object.fromEntries(rawPosts.map(p => [p.id, p]))
      posts = postIds
        .filter(id => postMap[id])
        .map(id => ({
          ...postMap[id],
          author: authorMap[postMap[id].author_id] ?? null,
          community: communityMap[postMap[id].community_id] ?? null,
          user_vote: voteMap[id] ?? 0,
        })) as Post[]
    }
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '20px', fontWeight: 600, color: '#1C1209', marginBottom: '4px' }}>
          Saved Posts
        </h1>
        <p style={{ fontSize: '13px', color: '#9A8F87' }}>
          {posts.length === 0 ? 'No saved posts yet.' : `${posts.length} saved post${posts.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2DDD7', padding: '48px', textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4C8BE" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '12px' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#3A2208', marginBottom: '6px' }}>Nothing saved yet</p>
          <p style={{ fontSize: '13px', color: '#9A8F87', marginBottom: '16px' }}>Tap Save on any post to find it here later.</p>
          <Link href="/community" style={{
            display: 'inline-block', padding: '8px 20px', borderRadius: '8px',
            background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>
            Browse community
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} userId={user.id} />
          ))}
        </div>
      )}
    </div>
  )
}
