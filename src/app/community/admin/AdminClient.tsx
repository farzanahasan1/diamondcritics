'use client'

import { useState, useTransition, useEffect } from 'react'
import { createCommunity, banUser, awardBadge, revokeBadge, resolveReport, refreshLinkPreviews } from '@/app/community/actions'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Profile {
  id: string; username: string; is_banned: boolean; is_admin: boolean
  post_karma: number; comment_karma: number; created_at: string
}
interface Badge { id: string; name: string; icon: string; color: string }
interface UserBadge { user_id: string; badge_id: string; badge: Badge }
interface Report {
  id: string; target_type: 'post' | 'comment' | 'user'; target_id: string
  reason: string; status: string; created_at: string
  reporter: { username: string } | null
}

const card: React.CSSProperties = {
  background: '#fff', borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)',
  overflow: 'hidden',
}
const input: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1.5px solid #E8E2DA', borderRadius: '8px',
  padding: '9px 13px', fontSize: '13px', color: '#1C1209',
  background: '#FAFAF9', outline: 'none', fontFamily: 'inherit',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  color: '#7A6F66', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px',
}
const goldBtn: React.CSSProperties = {
  padding: '9px 20px', borderRadius: '8px', border: 'none',
  background: 'linear-gradient(145deg, #D4A843, #B8881E)',
  color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
}

export default function AdminClient() {
  const [tab, setTab] = useState<'communities' | 'users' | 'badges' | 'reports'>('communities')
  const [users, setUsers] = useState<Profile[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  useEffect(() => {
    if (tab === 'users' || tab === 'badges') {
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100)
        .then(({ data }) => setUsers(data ?? []))
      supabase.from('badges').select('*').then(({ data }) => setBadges(data ?? []))
      supabase.from('user_badges').select('*, badge:badges(*)').then(({ data }) => setUserBadges(data ?? []))
    }
    if (tab === 'reports') {
      supabase.from('reports').select('*, reporter:profiles!reporter_id(username)')
        .eq('status', 'pending').order('created_at', { ascending: false }).limit(100)
        .then(({ data }) => setReports(data ?? []))
    }
  }, [tab])

  function msg(m: string) { setMessage(m); setTimeout(() => setMessage(''), 4000) }
  function err(e: string) { setError(e); setTimeout(() => setError(''), 6000) }

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()))

  const tabs = [
    { key: 'communities', label: '🏘 Communities' },
    { key: 'users', label: '👥 Users' },
    { key: 'badges', label: '🏅 Badges' },
    { key: 'reports', label: reports.length > 0 ? `🚩 Reports (${reports.length})` : '🚩 Reports' },
  ] as const

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1C1209', margin: 0 }}>⚙ Admin Panel</h1>
          <p style={{ fontSize: '13px', color: '#9A8F87', marginTop: '4px' }}>Manage your Diamond Community</p>
        </div>
        <button
          onClick={() => startTransition(async () => {
            const result = await refreshLinkPreviews()
            if ('error' in result) err(result.error as string)
            else msg(`Updated ${result.updated} of ${result.total} link preview images.`)
          })}
          disabled={isPending}
          style={{
            flexShrink: 0, padding: '9px 16px', borderRadius: '8px', border: 'none',
            background: '#1C1209', color: '#fff', fontSize: '12px', fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          🖼 Refresh Link Previews
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div style={{ marginBottom: '14px', padding: '10px 16px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '13px', color: '#166534' }}>
          ✓ {message}
        </div>
      )}
      {error && (
        <div style={{ marginBottom: '14px', padding: '10px 16px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA', fontSize: '13px', color: '#B91C1C' }}>
          ✗ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="c-sort-bar" style={{ marginBottom: '16px', background: '#fff', borderRadius: '10px', padding: '4px', boxShadow: '0 1px 4px rgba(28,18,9,0.07)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              flexShrink: 0, padding: '8px 12px', borderRadius: '7px', border: 'none',
              background: tab === t.key ? 'linear-gradient(145deg, #D4A843, #B8881E)' : 'transparent',
              color: tab === t.key ? '#fff' : '#7A6F66',
              fontSize: '12px', fontWeight: tab === t.key ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Communities tab ── */}
      {tab === 'communities' && (
        <div style={card}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0ECE5' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1209' }}>Create New Community</p>
          </div>
          <form
            action={(formData) => startTransition(async () => {
              const result = await createCommunity(formData)
              if (result?.error) err(result.error)
              else msg('Community created!')
            })}
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={label}>Name</label>
                <input name="name" type="text" required placeholder="Engagement Rings" style={input}
                  onFocus={e => (e.target.style.borderColor = '#D4A843')} onBlur={e => (e.target.style.borderColor = '#E8E2DA')} />
              </div>
              <div>
                <label style={label}>Slug (URL)</label>
                <input name="slug" type="text" required placeholder="engagement-rings" pattern="[a-z0-9\-]+" style={input}
                  onFocus={e => (e.target.style.borderColor = '#D4A843')} onBlur={e => (e.target.style.borderColor = '#E8E2DA')} />
                <p style={{ fontSize: '11px', color: '#B0A89E', marginTop: '4px' }}>Will appear as: r/engagement-rings</p>
              </div>
            </div>
            <div>
              <label style={label}>Description</label>
              <input name="description" type="text" placeholder="Community description" style={input}
                onFocus={e => (e.target.style.borderColor = '#D4A843')} onBlur={e => (e.target.style.borderColor = '#E8E2DA')} />
            </div>
            <div>
              <label style={label}>Rules (one per line)</label>
              <textarea name="rules" rows={4} placeholder={'1. Be respectful\n2. No spam'}
                style={{ ...input, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => (e.target.style.borderColor = '#D4A843')} onBlur={e => (e.target.style.borderColor = '#E8E2DA')} />
            </div>
            <div>
              <button type="submit" disabled={isPending} style={{ ...goldBtn, opacity: isPending ? 0.6 : 1 }}>
                {isPending ? 'Creating…' : 'Create Community'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <div style={card}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0ECE5' }}>
            <input type="text" placeholder="Search username…" value={search}
              onChange={e => setSearch(e.target.value)} style={input}
              onFocus={e => (e.target.style.borderColor = '#D4A843')} onBlur={e => (e.target.style.borderColor = '#E8E2DA')} />
          </div>
          {filteredUsers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#B0A89E', fontSize: '13px', padding: '32px' }}>No users found.</p>
          ) : filteredUsers.map((u, i) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              padding: '12px 16px',
              borderBottom: i < filteredUsers.length - 1 ? '1px solid #F5F0EA' : 'none',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link href={`/community/u/${u.username}`} style={{ fontSize: '14px', fontWeight: 600, color: '#1C1209', textDecoration: 'none' }}>
                    u/{u.username}
                  </Link>
                  {u.is_admin && <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: 'linear-gradient(145deg, #D4A843, #B8881E)', padding: '2px 7px', borderRadius: '20px' }}>Admin</span>}
                  {u.is_banned && <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: '#EF4444', padding: '2px 7px', borderRadius: '20px' }}>Banned</span>}
                </div>
                <p style={{ fontSize: '12px', color: '#9A8F87', marginTop: '2px' }}>
                  Karma: {u.post_karma + u.comment_karma} · Joined {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => startTransition(async () => {
                  const result = await banUser(u.id, !u.is_banned)
                  if (result?.error) err(result.error)
                  else {
                    msg(u.is_banned ? 'User unbanned.' : 'User banned.')
                    setUsers(prev => prev.map(p => p.id === u.id ? { ...p, is_banned: !p.is_banned } : p))
                  }
                })}
                disabled={isPending || u.is_admin}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: '6px', border: 'none',
                  background: u.is_banned ? '#F0FDF4' : '#FEF2F2',
                  color: u.is_banned ? '#166534' : '#B91C1C',
                  fontSize: '12px', fontWeight: 600, cursor: (isPending || u.is_admin) ? 'not-allowed' : 'pointer',
                  opacity: u.is_admin ? 0.4 : 1,
                }}
              >
                {u.is_banned ? 'Unban' : 'Ban'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Badges tab ── */}
      {tab === 'badges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={card}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0ECE5' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1209' }}>Award a Badge</p>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select id="badge-user" style={{ ...input, flex: 1, minWidth: '160px' }}>
                <option value="">Select user…</option>
                {users.map(u => <option key={u.id} value={u.id}>u/{u.username}</option>)}
              </select>
              <select id="badge-badge" style={{ ...input, flex: 1, minWidth: '160px' }}>
                <option value="">Select badge…</option>
                {badges.map(b => <option key={b.id} value={b.id}>{b.icon} {b.name}</option>)}
              </select>
              <button disabled={isPending}
                onClick={() => {
                  const userId = (document.getElementById('badge-user') as HTMLSelectElement)?.value
                  const badgeId = (document.getElementById('badge-badge') as HTMLSelectElement)?.value
                  if (userId && badgeId) startTransition(async () => {
                    const result = await awardBadge(userId, badgeId)
                    if (result?.error) err(result.error)
                    else msg('Badge awarded!')
                  })
                }}
                style={{ ...goldBtn, opacity: isPending ? 0.6 : 1, flexShrink: 0 }}
              >
                Award
              </button>
            </div>
          </div>

          <div style={card}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0ECE5' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1209' }}>All Badges</p>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {badges.map(b => (
                <span key={b.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#fff', background: b.color }}>
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0ECE5' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1209' }}>Awarded Badges</p>
            </div>
            {userBadges.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#B0A89E', fontSize: '13px', padding: '32px' }}>No badges awarded yet.</p>
            ) : userBadges.map((ub, i) => {
              const u = users.find(u => u.id === ub.user_id)
              return (
                <div key={`${ub.user_id}-${ub.badge_id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                  padding: '11px 20px',
                  borderBottom: i < userBadges.length - 1 ? '1px solid #F5F0EA' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1209' }}>u/{u?.username ?? '…'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, color: '#fff', background: ub.badge.color }}>
                      {ub.badge.icon} {ub.badge.name}
                    </span>
                  </div>
                  <button onClick={() => startTransition(async () => {
                    const result = await revokeBadge(ub.user_id, ub.badge_id)
                    if (result?.error) err(result.error)
                    else msg('Badge revoked.')
                  })} disabled={isPending}
                    style={{ fontSize: '12px', color: '#EF9999', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    Revoke
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Reports tab ── */}
      {tab === 'reports' && (
        <div style={card}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0ECE5' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1209' }}>Pending Reports</p>
            <p style={{ fontSize: '11px', color: '#9A8F87', marginTop: '3px' }}>Auto-hidden content appears when a post/comment reaches 5 reports.</p>
          </div>
          {reports.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#B0A89E', fontSize: '13px', padding: '32px' }}>No pending reports.</p>
          ) : reports.map((r, i) => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
              padding: '12px 20px',
              borderBottom: i < reports.length - 1 ? '1px solid #F5F0EA' : 'none',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
                    background: r.target_type === 'post' ? '#EFF6FF' : r.target_type === 'comment' ? '#F5F3FF' : '#FFF7ED',
                    color: r.target_type === 'post' ? '#1D4ED8' : r.target_type === 'comment' ? '#7C3AED' : '#C2410C',
                  }}>
                    {r.target_type}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#3A2208' }}>{r.reason}</span>
                  <span style={{ fontSize: '11px', color: '#B0A89E' }}>by u/{r.reporter?.username ?? '?'}</span>
                  <span style={{ fontSize: '11px', color: '#B0A89E' }}>· {new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#9A8F87', fontFamily: 'monospace' }}>ID: {r.target_id}</p>
                {r.target_type === 'post' && (
                  <Link href={`/community/post/${r.target_id}`} target="_blank"
                    style={{ fontSize: '12px', color: '#C6973E', textDecoration: 'none', fontWeight: 500 }}>
                    View post ↗
                  </Link>
                )}
              </div>
              <button
                onClick={() => startTransition(async () => {
                  const result = await resolveReport(r.id)
                  if (result?.error) err(result.error)
                  else { msg('Report resolved.'); setReports(prev => prev.filter(x => x.id !== r.id)) }
                })}
                disabled={isPending}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: '6px', border: 'none',
                  background: '#F0FDF4', color: '#166534', fontSize: '12px', fontWeight: 600,
                  cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.6 : 1,
                }}
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
