'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/app/community/actions'

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
  return `${Math.floor(s / 86400)}d ago`
}

function notifText(n: Notif) {
  const who = n.actor?.username ?? 'Someone'
  const title = n.post?.title
    ? `"${n.post.title.length > 45 ? n.post.title.slice(0, 45) + '…' : n.post.title}"`
    : 'your post'
  switch (n.type) {
    case 'comment_on_post':   return { main: `u/${who} commented on your post`, sub: title }
    case 'reply_to_comment':  return { main: `u/${who} replied to your comment`, sub: title }
    case 'post_upvote':       return { main: `u/${who} upvoted your post`, sub: title }
    case 'comment_upvote':    return { main: `u/${who} upvoted your comment in`, sub: title }
    default:                  return { main: 'New notification', sub: '' }
  }
}

function notifIcon(type: Notif['type']) {
  if (type === 'comment_on_post' || type === 'reply_to_comment') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

function Avatar({ actor }: { actor: Notif['actor'] }) {
  const initial = actor?.username?.[0]?.toUpperCase() ?? '?'
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'linear-gradient(145deg, #D4A843, #B8881E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
      {actor?.avatar_url
        ? <img src={actor.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial}
    </div>
  )
}

export default function NotificationBell() {
  const [open, setOpen]     = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const res = await getNotifications()
    setNotifs(res.notifications as unknown as Notif[])
    setUnread(res.unreadCount)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => { if (open) load() }, [open, load])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleMarkAll = async () => {
    await markAllNotificationsRead()
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  const handleClick = async (n: Notif) => {
    if (!n.read) {
      await markNotificationRead(n.id)
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
      setUnread(prev => Math.max(0, prev - 1))
    }
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Notifications"
        style={{
          position: 'relative', background: open ? 'rgba(255,255,255,0.08)' : 'transparent',
          border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? '#F0D88A' : 'rgba(255,255,255,0.55)',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 3, right: 3,
            background: '#FF4500', color: '#fff',
            fontSize: 9, fontWeight: 800, lineHeight: 1,
            borderRadius: 999, minWidth: 15, height: 15,
            padding: '0 3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid #1C1209',
          }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)',
          width: 360, background: '#fff',
          borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
          border: '1px solid #E5E1DA',
          zIndex: 200, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0EDE8' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1C1C1C', letterSpacing: '-0.01em' }}>Notifications</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {unread > 0 && (
                <button onClick={handleMarkAll} style={{ background: 'none', border: 'none', color: '#0079D3', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                  Mark all read
                </button>
              )}
              <Link href="/community/notifications" onClick={() => setOpen(false)} style={{ color: '#878A8C', fontSize: 12, textDecoration: 'none' }}>
                See all
              </Link>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#878A8C', fontSize: 13 }}>Loading…</div>
            ) : notifs.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
                <p style={{ margin: 0, color: '#1C1C1C', fontWeight: 600, fontSize: 14 }}>No notifications yet</p>
                <p style={{ margin: '4px 0 0', color: '#878A8C', fontSize: 13 }}>When someone comments or upvotes, you'll see it here.</p>
              </div>
            ) : (
              notifs.map(n => {
                const { main, sub } = notifText(n)
                return (
                  <Link
                    key={n.id}
                    href={n.post_id ? `/community/post/${n.post_id}` : '/community/notifications'}
                    onClick={() => handleClick(n)}
                    style={{
                      display: 'flex', gap: 10, padding: '10px 14px',
                      textDecoration: 'none',
                      background: n.read ? 'transparent' : '#F6F7FE',
                      borderBottom: '1px solid #F0EDE8',
                      alignItems: 'flex-start',
                      transition: 'background 0.1s',
                    }}
                  >
                    {/* Avatar */}
                    <Avatar actor={n.actor} />

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, color: '#1C1C1C', lineHeight: 1.45 }}>
                        <strong style={{ fontWeight: 600 }}>{main}</strong>
                        {sub && <span style={{ color: '#0079D3' }}> {sub}</span>}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: 11, color: '#878A8C' }}>{timeAgo(n.created_at)}</p>
                    </div>

                    {/* Type icon + unread dot */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <div style={{ color: n.type.includes('upvote') ? '#FF4500' : '#0079D3' }}>
                        {notifIcon(n.type)}
                      </div>
                      {!n.read && (
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0079D3' }} />
                      )}
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid #F0EDE8', background: '#FAFAFA', textAlign: 'center' }}>
              <Link href="/community/notifications" onClick={() => setOpen(false)} style={{ color: '#0079D3', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
