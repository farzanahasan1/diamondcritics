'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signInWithEmail, signInWithGoogle } from '@/app/community/actions'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1.5px solid #E8E2DA', borderRadius: '9px',
  padding: '11px 14px', fontSize: '14px', color: '#1C1209',
  background: '#FAFAF9', outline: 'none', display: 'block',
}

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [googlePending, startGoogleTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signInWithEmail(formData)
      if (result?.error) setError(result.error)
    })
  }

  async function handleGoogle() {
    startGoogleTransition(async () => {
      await signInWithGoogle()
    })
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '780px',
        display: 'flex', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(28,18,9,0.12), 0 1px 4px rgba(28,18,9,0.08)',
      }}>

        {/* ── Left panel ── */}
        <div className="c-auth-left" style={{
          width: '320px', flexShrink: 0, padding: '40px 32px',
          background: 'linear-gradient(160deg, #1C1209 0%, #3A2208 55%, #1C1209 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'linear-gradient(145deg, #D4A843, #B8881E)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '22px', fontWeight: 300, color: '#F0D88A', lineHeight: 1.35, marginBottom: '12px' }}>
              Welcome back to the community
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(240,216,138,0.5)', lineHeight: 1.65, marginBottom: '32px' }}>
              Your trusted space for diamond advice, engagement rings, and honest conversations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['GIA-backed diamond questions', 'Honest engagement ring reviews', 'Connect with diamond enthusiasts'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: '#D4A843', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>◆</span>
                  <span style={{ fontSize: '13px', color: 'rgba(240,216,138,0.6)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '32px' }}>
            Your email is never shown publicly
          </p>
        </div>

        {/* ── Right panel ── */}
        <div className="c-auth-right" style={{ flex: 1, background: '#fff', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', fontSize: '24px', fontWeight: 400, color: '#1C1209', marginBottom: '4px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '13px', color: '#9A8F87', marginBottom: '24px' }}>Log in to your Diamond Community account</p>

          {/* Google */}
          <button
            type="button" onClick={handleGoogle} disabled={googlePending || isPending}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '11px 16px', borderRadius: '9px', border: '1.5px solid #E8E2DA', background: '#FAFAF9', color: '#1C1209', fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginBottom: '20px', opacity: (googlePending || isPending) ? 0.5 : 1 }}
          >
            <GoogleIcon />
            {googlePending ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{ height: '1px', background: '#EDE8E1', width: '100%' }} />
            <span style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 12px', fontSize: '11px', color: '#B0A89E' }}>
              or continue with email
            </span>
          </div>

          <form action={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5A504A', marginBottom: '6px' }}>
                Email or Username
              </label>
              <input name="email" type="text" required autoComplete="username" placeholder="you@email.com or your_username" style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#D4A843'}
                onBlur={e => e.currentTarget.style.borderColor = '#E8E2DA'}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#5A504A', marginBottom: '6px' }}>Password</label>
              <input name="password" type="password" required autoComplete="current-password" style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = '#D4A843'}
                onBlur={e => e.currentTarget.style.borderColor = '#E8E2DA'}
              />
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '11px 14px', borderRadius: '9px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isPending || googlePending}
              style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: (isPending || googlePending) ? 0.6 : 1 }}
            >
              {isPending ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9A8F87', marginTop: '20px' }}>
            New here?{' '}
            <Link href="/community/register" style={{ color: '#D4A843', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px' }}>
            <Link href="/community" style={{ color: '#C4BCB6', textDecoration: 'none' }}>← Back to Community</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
