'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signInWithEmail, signInWithGoogle } from '@/app/community/actions'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
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
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch -mt-5 -mx-4">
      {/* Left panel — brand story */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: 'linear-gradient(160deg, #1a1208 0%, #2e1f08 40%, #1a1208 100%)' }}
      >
        <Link href="/community">
          <img
            src="/images/diamond-critics-main-logo-small.avif"
            alt="DiamondCritics"
            className="h-8 w-auto"
            style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)', opacity: 0.9 }}
          />
        </Link>

        <div>
          <h2
            className="text-4xl font-light leading-tight mb-4"
            style={{ fontFamily: 'var(--font-ivy), Georgia, serif', color: '#f5e6c8' }}
          >
            Welcome back to the community
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(245,230,200,0.55)' }}>
            Your trusted space for diamond advice, engagement ring inspiration, and real conversations with jewellery enthusiasts.
          </p>

          <div className="space-y-4">
            {[
              { icon: '✦', text: 'Ask GIA-backed diamond questions' },
              { icon: '✦', text: 'Browse honest engagement ring reviews' },
              { icon: '✦', text: 'Connect with fellow diamond enthusiasts' },
            ].map(item => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-xs mt-0.5" style={{ color: '#C6973E' }}>{item.icon}</span>
                <span className="text-sm" style={{ color: 'rgba(245,230,200,0.65)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: 'rgba(245,230,200,0.3)' }}>
          © DiamondCritics · Your email is never shown publicly
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/images/diamond-critics-main-logo-small.avif"
              alt="DiamondCritics"
              className="h-8 w-auto mx-auto mb-4"
            />
          </div>

          <h1 className="text-2xl font-light mb-1" style={{ fontFamily: 'var(--font-ivy), Georgia, serif', color: '#1a1208' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-7" style={{ color: '#888' }}>Log in to your Diamond Community account</p>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googlePending || isPending}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50 mb-4"
            style={{ border: '1.5px solid #e5e5e3', color: '#1a1208', background: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#faf9f7')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            <GoogleIcon />
            {googlePending ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: '#e5e5e3' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs" style={{ color: '#aaa' }}>or continue with email</span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: '#555' }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-all outline-none"
                style={{ border: '1.5px solid #e5e5e3', color: '#1a1208', background: '#faf9f7' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C6973E')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e5e3')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1.5" style={{ color: '#555' }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-all outline-none"
                style={{ border: '1.5px solid #e5e5e3', color: '#1a1208', background: '#faf9f7' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#C6973E')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e5e3')}
              />
            </div>

            {error && (
              <div className="text-sm rounded-lg px-3.5 py-2.5" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || googlePending}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 mt-1"
              style={{ background: 'linear-gradient(135deg, #C6973E 0%, #e8bf6a 100%)', color: '#1a1208' }}
            >
              {isPending ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#888' }}>
            New here?{' '}
            <Link href="/community/register" className="font-semibold hover:underline" style={{ color: '#C6973E' }}>
              Create account
            </Link>
          </p>

          <p className="text-center text-xs mt-6">
            <Link href="/community" className="hover:underline" style={{ color: '#bbb' }}>← Back to Community</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
