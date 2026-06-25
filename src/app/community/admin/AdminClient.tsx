'use client'

import { useState, useTransition, useEffect } from 'react'
import { createCommunity, banUser, awardBadge, revokeBadge, resolveReport } from '@/app/community/actions'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Profile {
  id: string
  username: string
  is_banned: boolean
  is_admin: boolean
  post_karma: number
  comment_karma: number
  created_at: string
}

interface Badge {
  id: string
  name: string
  icon: string
  color: string
}

interface UserBadge {
  user_id: string
  badge_id: string
  badge: Badge
}

interface Report {
  id: string
  target_type: 'post' | 'comment' | 'user'
  target_id: string
  reason: string
  status: string
  created_at: string
  reporter: { username: string } | null
}

export default function AdminPage() {
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

  // Auth guard is handled server-side in page.tsx

  useEffect(() => {
    if (tab === 'users' || tab === 'badges') {
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100)
        .then(({ data }) => setUsers(data ?? []))
      supabase.from('badges').select('*')
        .then(({ data }) => setBadges(data ?? []))
      supabase.from('user_badges').select('*, badge:badges(*)')
        .then(({ data }) => setUserBadges(data ?? []))
    }
    if (tab === 'reports') {
      supabase
        .from('reports')
        .select('*, reporter:profiles!reporter_id(username)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(100)
        .then(({ data }) => setReports(data ?? []))
    }
  }, [tab])

  function msg(m: string) { setMessage(m); setTimeout(() => setMessage(''), 3000) }
  function err(e: string) { setError(e); setTimeout(() => setError(''), 5000) }

  async function handleCreateCommunity(formData: FormData) {
    startTransition(async () => {
      const result = await createCommunity(formData)
      if (result?.error) err(result.error)
      else msg('Community created!')
    })
  }

  async function handleBan(userId: string, ban: boolean) {
    startTransition(async () => {
      const result = await banUser(userId, ban)
      if (result?.error) err(result.error)
      else {
        msg(ban ? 'User banned.' : 'User unbanned.')
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: ban } : u))
      }
    })
  }

  async function handleAwardBadge(userId: string, badgeId: string) {
    startTransition(async () => {
      const result = await awardBadge(userId, badgeId)
      if (result?.error) err(result.error)
      else msg('Badge awarded!')
    })
  }

  async function handleRevokeBadge(userId: string, badgeId: string) {
    startTransition(async () => {
      const result = await revokeBadge(userId, badgeId)
      if (result?.error) err(result.error)
      else msg('Badge revoked.')
    })
  }

  async function handleResolveReport(reportId: string) {
    startTransition(async () => {
      const result = await resolveReport(reportId)
      if (result?.error) err(result.error)
      else {
        msg('Report resolved.')
        setReports(prev => prev.filter(r => r.id !== reportId))
      }
    })
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">⚙ Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your Diamond Community</p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          ✗ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white border border-[#EDEFF1] rounded p-1">
        {(['communities', 'users', 'badges', 'reports'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded capitalize transition-colors ${
              tab === t ? 'bg-[#C6973E] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t === 'communities' ? '🏘 Communities' : t === 'users' ? '👥 Users' : t === 'badges' ? '🏅 Badges' : (
              <span className="flex items-center justify-center gap-1">
                🚩 Reports
                {reports.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                    {reports.length}
                  </span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Communities tab */}
      {tab === 'communities' && (
        <div className="bg-white border border-[#EDEFF1] rounded p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Create New Community</h2>
          <form action={handleCreateCommunity} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input name="name" type="text" required placeholder="Engagement Rings"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C6973E]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input name="slug" type="text" required placeholder="engagement-rings"
                  pattern="[a-z0-9\-]+"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C6973E]" />
                <p className="text-xs text-gray-400 mt-0.5">Will appear as: r/engagement-rings</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <input name="description" type="text" placeholder="Community description"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C6973E]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rules (one per line)</label>
              <textarea name="rules" rows={4} placeholder={"1. Be respectful\n2. No spam"}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#C6973E]" />
            </div>
            <button type="submit" disabled={isPending}
              className="px-5 py-2 bg-[#C6973E] text-white text-sm font-semibold rounded hover:bg-[#b08535] disabled:opacity-50">
              {isPending ? 'Creating…' : 'Create Community'}
            </button>
          </form>
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div className="bg-white border border-[#EDEFF1] rounded overflow-hidden">
          <div className="p-4 border-b border-[#EDEFF1]">
            <input
              type="text"
              placeholder="Search username…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C6973E]"
            />
          </div>
          <div className="divide-y divide-[#EDEFF1]">
            {filteredUsers.length === 0 && (
              <p className="text-sm text-gray-400 p-4 text-center">No users found.</p>
            )}
            {filteredUsers.map(u => (
              <div key={u.id} className="px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/community/u/${u.username}`} className="font-medium text-gray-900 hover:text-[#C6973E] text-sm">
                    u/{u.username}
                  </Link>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Karma: {u.post_karma + u.comment_karma} •{' '}
                    Joined {new Date(u.created_at).toLocaleDateString()}
                    {u.is_admin && <span className="ml-2 text-amber-600 font-medium">Admin</span>}
                    {u.is_banned && <span className="ml-2 text-red-500 font-medium">Banned</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleBan(u.id, !u.is_banned)}
                    disabled={isPending || u.is_admin}
                    className={`text-xs px-3 py-1.5 rounded font-medium disabled:opacity-40 ${
                      u.is_banned
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {u.is_banned ? 'Unban' : 'Ban'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges tab */}
      {tab === 'badges' && (
        <div className="space-y-4">
          {/* Award badge */}
          <div className="bg-white border border-[#EDEFF1] rounded p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Award a Badge</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                id="badge-user"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C6973E]"
              >
                <option value="">Select user…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>u/{u.username}</option>
                ))}
              </select>
              <select
                id="badge-badge"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#C6973E]"
              >
                <option value="">Select badge…</option>
                {badges.map(b => (
                  <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
                ))}
              </select>
              <button
                disabled={isPending}
                onClick={() => {
                  const userId = (document.getElementById('badge-user') as HTMLSelectElement)?.value
                  const badgeId = (document.getElementById('badge-badge') as HTMLSelectElement)?.value
                  if (userId && badgeId) handleAwardBadge(userId, badgeId)
                }}
                className="px-4 py-2 bg-[#C6973E] text-white text-sm font-semibold rounded hover:bg-[#b08535] disabled:opacity-50"
              >
                Award
              </button>
            </div>
          </div>

          {/* Badge overview */}
          <div className="bg-white border border-[#EDEFF1] rounded p-5">
            <h2 className="font-semibold text-gray-800 mb-3">All Badges</h2>
            <div className="flex flex-wrap gap-2">
              {badges.map(b => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: b.color }}
                >
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* Users with badges */}
          <div className="bg-white border border-[#EDEFF1] rounded overflow-hidden">
            <h2 className="font-semibold text-gray-800 p-4 border-b border-[#EDEFF1]">Awarded Badges</h2>
            <div className="divide-y divide-[#EDEFF1]">
              {userBadges.length === 0 ? (
                <p className="text-sm text-gray-400 p-4 text-center">No badges awarded yet.</p>
              ) : (
                userBadges.map(ub => {
                  const u = users.find(u => u.id === ub.user_id)
                  return (
                    <div key={`${ub.user_id}-${ub.badge_id}`} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-800">u/{u?.username ?? '…'}</span>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: ub.badge.color }}
                        >
                          {ub.badge.icon} {ub.badge.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRevokeBadge(ub.user_id, ub.badge_id)}
                        disabled={isPending}
                        className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                      >
                        Revoke
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
      {/* Reports tab */}
      {tab === 'reports' && (
        <div className="bg-white border border-[#EDEFF1] rounded overflow-hidden">
          <div className="p-4 border-b border-[#EDEFF1]">
            <h2 className="font-semibold text-gray-800">Pending Reports</h2>
            <p className="text-xs text-gray-500 mt-0.5">Auto-hidden content appears when a post/comment reaches 5 reports.</p>
          </div>
          <div className="divide-y divide-[#EDEFF1]">
            {reports.length === 0 ? (
              <p className="text-sm text-gray-400 p-4 text-center">No pending reports.</p>
            ) : (
              reports.map(r => (
                <div key={r.id} className="px-4 py-3 flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        r.target_type === 'post' ? 'bg-blue-100 text-blue-700' :
                        r.target_type === 'comment' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {r.target_type}
                      </span>
                      <span className="text-xs font-medium text-gray-700">{r.reason}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">by u/{r.reporter?.username ?? '?'}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono truncate">ID: {r.target_id}</p>
                    {r.target_type === 'post' && (
                      <Link href={`/community/post/${r.target_id}`} target="_blank" className="text-xs text-[#C6973E] hover:underline">
                        View post ↗
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => handleResolveReport(r.id)}
                    disabled={isPending}
                    className="text-xs px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded font-medium disabled:opacity-40"
                  >
                    Resolve
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
