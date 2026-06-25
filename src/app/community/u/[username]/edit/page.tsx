'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateProfile } from '@/app/community/actions'
import { createClient } from '@/lib/supabase/client'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1.5px solid #E8E2DA', borderRadius: '9px',
  padding: '11px 14px', fontSize: '14px', color: '#1C1209',
  background: '#FAFAF9', outline: 'none', display: 'block',
}

export default function EditProfilePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/community/login'); return }
      const { data: profile } = await supabase
        .from('profiles').select('username, display_name, bio').eq('id', user.id).single()
      if (profile) {
        setUsername(profile.username ?? '')
        setDisplayName(profile.display_name ?? '')
        setBio(profile.bio ?? '')
      }
      setLoading(false)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    formData.set('display_name', displayName)
    formData.set('bio', bio)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setMessage('Profile updated!')
        setTimeout(() => router.push(`/community/u/${username}`), 1000)
      }
    })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ fontSize: '13px', color: '#9A8F87' }}>Loading…</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <Link href={`/community/u/${username}`} style={{ fontSize: '12px', color: '#9A8F87', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            ← Back to profile
          </Link>
          <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '22px', fontWeight: 400, color: '#1C1209' }}>
            Edit Profile
          </h1>
          <p style={{ fontSize: '13px', color: '#9A8F87', marginTop: '4px' }}>u/{username}</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(28,18,9,0.07), 0 4px 16px rgba(28,18,9,0.05)', padding: '28px' }}>

          {message && (
            <div style={{ marginBottom: '20px', padding: '11px 14px', borderRadius: '9px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', fontSize: '13px' }}>
              ✓ {message}
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '20px', padding: '11px 14px', borderRadius: '9px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Username (read-only) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5A504A', marginBottom: '6px' }}>
                Username <span style={{ color: '#B0A89E', fontWeight: 400 }}>· cannot be changed</span>
              </label>
              <div style={{ ...inputStyle, background: '#F4F0EA', color: '#9A8F87', cursor: 'not-allowed' }}>
                {username}
              </div>
            </div>

            {/* Display name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5A504A', marginBottom: '6px' }}>
                Display Name <span style={{ color: '#B0A89E', fontWeight: 400 }}>· optional</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                maxLength={50}
                placeholder="Your full name or nickname"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#D4A843'}
                onBlur={e => e.currentTarget.style.borderColor = '#E8E2DA'}
              />
              <p style={{ fontSize: '11px', color: '#C4BCB6', marginTop: '4px' }}>Shown on your profile, max 50 characters</p>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5A504A', marginBottom: '6px' }}>
                Bio <span style={{ color: '#B0A89E', fontWeight: 400 }}>· optional</span>
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={300}
                rows={4}
                placeholder="Tell the community about yourself…"
                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                onFocus={e => e.currentTarget.style.borderColor = '#D4A843'}
                onBlur={e => e.currentTarget.style.borderColor = '#E8E2DA'}
              />
              <p style={{ fontSize: '11px', color: '#C4BCB6', marginTop: '4px' }}>{bio.length}/300 characters</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={isPending}
                style={{ flex: 1, padding: '11px', borderRadius: '9px', border: 'none', background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: isPending ? 0.6 : 1 }}
              >
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <Link
                href={`/community/u/${username}`}
                style={{ padding: '11px 20px', borderRadius: '9px', border: '1.5px solid #E8E2DA', color: '#5A504A', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
