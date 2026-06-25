'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signUpWithEmail, signInWithGoogle } from '@/app/community/actions'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [googlePending, startGoogleTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signUpWithEmail(formData)
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
    <div className="min-h-[60vh] flex items-start sm:items-center justify-center py-8 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">💎</span>
          <h1 className="text-2xl font-bold text-gray-900">Join the Community</h1>
          <p className="text-sm text-gray-500 mt-1">Connect with diamond enthusiasts</p>
        </div>

        <div className="bg-white border border-[#EDEFF1] rounded-xl p-6 shadow-sm">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googlePending || isPending}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googlePending ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">OR</span>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                Username <span className="text-gray-400 font-normal">(public)</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                autoComplete="username"
                placeholder="e.g. diamond_fan"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C6973E] focus:ring-1 focus:ring-[#C6973E]"
              />
              <p className="text-xs text-gray-400 mt-1">3–20 chars, letters/numbers/underscores. This is shown publicly — <strong>never your email</strong>.</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400 font-normal">(private — never shown)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C6973E] focus:ring-1 focus:ring-[#C6973E]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C6973E] focus:ring-1 focus:ring-[#C6973E]"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || googlePending}
              className="w-full py-2.5 bg-[#C6973E] text-white font-semibold rounded-lg text-sm hover:bg-[#b08535] disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/community/login" className="text-[#C6973E] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link href="/community" className="hover:underline">← Back to Community</Link>
        </p>
      </div>
    </div>
  )
}
