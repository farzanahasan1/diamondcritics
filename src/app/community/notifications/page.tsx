import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { markAllNotificationsRead } from '../actions'

export const metadata: Metadata = {
  title: 'Notifications — Diamond Community',
  robots: { index: false, follow: false },
}

type Notif = {
  id: string
  type: 'comment_on_post' | 'reply_to_comment' | 'post_upvote' | 'comment_upvote'
  read: boolean
  created_at: string
  post_id: string | null
  comment_id: string | null
  actor: { username: string; avatar_url: string | null } | null
  post: { title: string } | null
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function notifLabel(n: Notif) {
  const who = n.actor?.username ?? 'Someone'
  const title = n.post?.title ?? 'your post'
  switch (n.type) {
    case 'comment_on_post':  return { action: `u/${who} commented on your post`, title }
    case 'reply_to_comment': return { action: `u/${who} replied to your comment`, title }
    case 'post_upvote':      return { action: `u/${who} upvoted your post`, title }
    case 'comment_upvote':   return { action: `u/${who} upvoted your comment in`, title }
    default:                 return { action: 'New notification', title: '' }
  }
}

function TypeBadge({ type }: { type: Notif['type'] }) {
  const isVote = type.includes('upvote')
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: isVote ? '#FFF0EB' : '#EDF5FF',
      color: isVote ? '#FF4500' : '#0079D3',
    }}>
      {isVote ? '↑ Upvote' : type === 'reply_to_comment' ? '↩ Reply' : '💬 Comment'}
    </span>
  )
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/community/login')

  const { data } = await supabase
    .from('notifications')
    .select('id, type, read, created_at, post_id, comment_id, actor:profiles!actor_id(username, avatar_url), post:posts!post_id(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const notifs = (data ?? []) as unknown as Notif[]
  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 48px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1C1C1C', letterSpacing: '-0.02em' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#878A8C' }}>
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsRead}>
            <button style={{
              background: 'none', border: '1px solid #EDEFF1', borderRadius: 20,
              padding: '7px 14px', fontSize: 13, fontWeight: 600,
              color: '#0079D3', cursor: 'pointer',
            }}>
              Mark all as read
            </button>
          </form>
        )}
      </div>

      {/* Notifications list */}
      {notifs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 12, border: '1px solid #EDEFF1' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1C1C1C' }}>No notifications yet</h2>
          <p style={{ margin: '8px 0 20px', color: '#878A8C', fontSize: 14 }}>
            When someone comments on your posts or upvotes your content, you&apos;ll see it here.
          </p>
          <Link href="/community/r/diamonds" style={{ display: 'inline-block', padding: '9px 20px', borderRadius: 20, background: '#FF4500', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Start participating →
          </Link>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EDEFF1', overflow: 'hidden' }}>
          {notifs.map((n, i) => {
            const { action, title } = notifLabel(n)
            const href = n.post_id ? `/community/post/${n.post_id}` : '/community'
            return (
              <Link
                key={n.id}
                href={href}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px',
                  textDecoration: 'none',
                  background: n.read ? 'transparent' : '#F6F7FE',
                  borderBottom: i < notifs.length - 1 ? '1px solid #EDEFF1' : 'none',
                  transition: 'background 0.1s',
                }}
              >
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(145deg, #D4A843, #B8881E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
                  {n.actor?.avatar_url
                    ? <img src={n.actor.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (n.actor?.username?.[0]?.toUpperCase() ?? '?')}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <TypeBadge type={n.type} />
                    <span style={{ fontSize: 11, color: '#878A8C' }}>{timeAgo(n.created_at)}</span>
                    {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0079D3', display: 'inline-block', flexShrink: 0 }} />}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: '#1C1C1C', lineHeight: 1.5 }}>
                    {action}
                  </p>
                  {title && (
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: '#0079D3', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                      {title}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <span style={{ color: '#878A8C', fontSize: 16, flexShrink: 0, marginTop: 8 }}>›</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
