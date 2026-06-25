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
      const result = await signInWithGoogle()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex items-center justify-center py-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden flex" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.13)', minHeight: '480px' }}>

        {/* ── Left panel ── */}
        <div
          className="hidden lg:flex flex-col justify-between w-[42%] shrink-0 p-8"
          style={{ background: 'linear-gradient(160deg, #1C1209 0%, #3A2208 60%, #1C1209 100%)' }}
        >
          <div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(145deg, #D4A843, #B8881E)' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-light leading-snug mb-3" style={{ fontFamily: 'var(--font-ivy, Georgia, serif)', color: '#F0D88A' }}>
              Welcome back to the community
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(240,216,138,0.5)' }}>
              Your trusted space for diamond advice, engagement rings, and honest conversations.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              'GIA-backed diamond questions',
              'Honest engagement ring reviews',
              'Connect with diamond enthusiasts',
            ].map(text => (
              <div key={text} className="flex items-start gap-2.5">
                <span className="text-[10px] mt-1 shrink-0" style={{ color: '#D4A843' }}>◆</span>
                <span className="text-[13px] leading-relaxed" style={{ color: 'rgba(240,216,138,0.6)' }}>{text}</span>
              </div>
            ))}

            <p className="text-[11px] pt-4 mt-2" style={{ color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              Your email is never shown publicly
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 flex flex-col justify-center bg-white px-8 py-8">
          <h1 className="text-[22px] font-semibold mb-1" style={{ color: '#1C1209', fontFamily: 'var(--font-ivy, Georgia, serif)' }}>
            Welcome back
          </h1>
          <p className="text-[13px] mb-6" style={{ color: '#9A8F87' }}>
            Log in to your Diamond Community account
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googlePending || isPending}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-[13px] font-medium mb-4 transition-all disabled:opacity-50"
            style={{ border: '1.5px solid #E8E2DA', color: '#1C1209', background: '#FAFAF9' }}
          >
            <GoogleIcon />
            {googlePending ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#EDE8E1' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px]" style={{ color: '#B0A89E' }}>or continue with email</span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: '#5A504A' }}>Email</label>
              <input
                name="email" type="email" required autoComplete="email"
                className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none transition-all"
                style={{ border: '1.5px solid #E8E2DA', background: '#FAFAF9', color: '#1C1209' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#D4A843'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E8E2DA'; e.currentTarget.style.background = '#FAFAF9' }}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: '#5A504A' }}>Password</label>
              <input
                name="password" type="password" required autoComplete="current-password"
                className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none transition-all"
                style={{ border: '1.5px solid #E8E2DA', background: '#FAFAF9', color: '#1C1209' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#D4A843'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E8E2DA'; e.currentTarget.style.background = '#FAFAF9' }}
              />
            </div>

            {error && (
              <div className="rounded-lg px-3.5 py-2.5 text-[13px]" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || googlePending}
              className="w-full py-2.5 rounded-lg text-[14px] font-semibold transition-all disabled:opacity-50 mt-1"
              style={{ background: 'linear-gradient(145deg, #D4A843, #B8881E)', color: '#fff' }}
            >
              {isPending ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-[13px] mt-5" style={{ color: '#9A8F87' }}>
            New here?{' '}
            <Link href="/community/register" className="font-semibold" style={{ color: '#D4A843' }}>Create account</Link>
          </p>
          <p className="text-center text-[12px] mt-3">
            <Link href="/community" style={{ color: '#C4BCB6' }}>← Back to Community</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
