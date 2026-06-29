import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/community/PostCard'
import type { Post } from '@/types/community'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  return {
    title: `u/${username} — Diamond Community`,
    description: `View ${username}'s posts and activity in the DiamondCritics diamond community.`,
    alternates: { canonical: `https://diamondcritics.com/community/u/${username}` },
    openGraph: {
      title: `u/${username} — Diamond Community`,
      description: `View ${username}'s posts and activity in the DiamondCritics diamond community.`,
      url: `https://diamondcritics.com/community/u/${username}`,
      type: 'profile',
    },
    twitter: { card: 'summary' },
  }
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles').select('id,username,avatar_url,display_name,bio,user_flair,post_karma,comment_karma,is_admin,is_banned,created_at').eq('username', username).single()
  if (!profile) redirect('/community')

  const { data: userBadges } = await supabase
    .from('user_badges').select('id,user_id,badge_id,awarded_at,badge:badges(id,name,description,icon,color)').eq('user_id', profile.id)

  const { data: rawPostsData } = await supabase
    .from('posts')
    .select('id,community_id,author_id,title,body,url,image_url,link_preview_image,flair,type,score,comment_count,is_deleted,is_draft,is_pinned,created_at,updated_at')
    .eq('author_id', profile.id).eq('is_deleted', false)
    .order('created_at', { ascending: false }).limit(20)

  // Fetch communities for these posts separately (avoids FK constraint dependency)
  const communityIds = [...new Set((rawPostsData ?? []).map(p => p.community_id).filter(Boolean))]
  type CommunityRow = { id: string; slug: string; name: string }
  let communitiesMap: Record<string, CommunityRow> = {}
  if (communityIds.length) {
    const { data: comms } = await supabase.from('communities').select('id,slug,name').in('id', communityIds)
    if (comms) communitiesMap = Object.fromEntries(comms.map(c => [c.id, c]))
  }

  let userVotes: Record<string, -1 | 1> = {}
  if (user && rawPostsData?.length) {
    const { data: votes } = await supabase
      .from('post_votes').select('post_id, vote')
      .eq('user_id', user.id).in('post_id', rawPostsData.map(p => p.id))
    if (votes) userVotes = Object.fromEntries(votes.map(v => [v.post_id, v.vote]))
  }

  const posts: Post[] = (rawPostsData ?? []).map(p => ({
    ...p,
    author: { id: profile.id, username: profile.username, avatar_url: profile.avatar_url },
    community: communitiesMap[p.community_id] ?? null,
    user_vote: userVotes[p.id] ?? 0,
  }))
  const totalKarma = profile.post_karma + profile.comment_karma
  const isOwnProfile = user?.id === profile.id

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
    overflow: 'hidden',
  }

  return (
    <div className="c-layout">

      {/* ── Posts column ── */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A8F87', marginBottom: '12px' }}>
          Posts by u/{username}
        </div>

        {posts.length === 0 ? (
          <div style={{ ...card, padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#9A8F87' }}>No posts yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts.map(post => <PostCard key={post.id} post={post} userId={user?.id} />)}
          </div>
        )}
      </div>

      {/* ── Profile sidebar ── */}
      <aside className="c-profile-sidebar">
        <div style={{ ...card, marginBottom: '12px' }}>
          {/* Banner */}
          <div style={{ height: '72px', background: 'linear-gradient(135deg, #1C1209 0%, #3A2208 100%)' }} />

          {/* Avatar */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ marginTop: '-28px', marginBottom: '12px' }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={username} width={56} height={56} loading="lazy" decoding="async" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', outline: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(145deg, #D4A843, #B8881E)', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                  {username[0].toUpperCase()}
                </div>
              )}
            </div>

            <div style={{ fontWeight: 700, fontSize: '16px', color: '#1C1209', marginBottom: '2px' }}>u/{username}</div>
            {profile.display_name && (
              <div style={{ fontSize: '13px', color: '#7A6F66', marginBottom: '4px' }}>{profile.display_name}</div>
            )}

            {/* Badges */}
            {userBadges && userBadges.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px', marginBottom: '4px' }}>
                {userBadges.map((ub: { badge: { id: string; icon: string; name: string; color: string }; badge_id: string }) => (
                  <span key={ub.badge_id} title={ub.badge.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: '#fff', background: ub.badge.color }}>
                    {ub.badge.icon} {ub.badge.name}
                  </span>
                ))}
              </div>
            )}

            {profile.bio && (
              <p style={{ fontSize: '13px', color: '#5A504A', lineHeight: 1.6, marginTop: '10px' }}>{profile.bio}</p>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #EDE8E1' }}>
              {[
                { value: totalKarma.toLocaleString(), label: 'Karma' },
                { value: String(posts.length), label: 'Posts' },
              ].map(s => (
                <div key={s.label} style={{ background: '#FAF8F5', borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C1209' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#9A8F87', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: '#B0A89E', marginTop: '12px' }}>
              🎂 Joined {joinDate}
            </div>

            {profile.is_banned && (
              <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA', fontSize: '12px', color: '#B91C1C' }}>
                ⚠️ This account has been suspended
              </div>
            )}

            {isOwnProfile && (
              <Link href={`/community/u/${username}/edit`} style={{
                display: 'block', textAlign: 'center', marginTop: '14px',
                padding: '9px 16px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '13px', fontWeight: 600,
                background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff',
              }}>
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Privacy note */}
        <div style={{ ...card, padding: '14px 16px' }}>
          <p style={{ fontSize: '12px', color: '#9A8F87', lineHeight: 1.55 }}>
            🔒 <strong style={{ color: '#5A504A' }}>Privacy:</strong> Only your username is public. Your email is never visible to anyone.
          </p>
        </div>
      </aside>

    </div>
  )
}
