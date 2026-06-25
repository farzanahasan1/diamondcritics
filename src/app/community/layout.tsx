import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'

export const metadata: Metadata = {
  title: {
    default: 'Diamond Community — DiamondCritics',
    template: '%s | Diamond Community',
  },
  description: 'The diamond community on DiamondCritics. Discuss diamonds, engagement rings, and everything sparkling.',
}

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url, is_admin')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="min-h-screen" style={{ background: '#F4F0EA' }}>

      {/* ── Community top bar ── */}
      <div style={{ background: '#1C1209', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">

          {/* Brand */}
          <Link href="/community" className="flex items-center gap-3 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(145deg, #D4A843 0%, #B8881E 100%)' }}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="block text-[13px] font-semibold leading-none" style={{ color: '#F0D88A' }}>Diamond Community</span>
              <span className="block text-[10px] leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>by DiamondCritics.com</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/community"
              className="text-[13px] px-3 py-1.5 rounded-md font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              Feed
            </Link>
            <Link href="/community/r/diamonds"
              className="text-[13px] px-3 py-1.5 rounded-md font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              r/diamonds
            </Link>
          </nav>

          <div className="flex-1" />

          {/* Auth */}
          {user && profile ? (
            <div className="flex items-center gap-3">
              {profile.is_admin && (
                <Link href="/community/admin"
                  className="hidden sm:block text-[12px] px-2.5 py-1 rounded-md font-medium"
                  style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)' }}>
                  Admin
                </Link>
              )}
              <Link href={`/community/u/${profile.username}`} className="flex items-center gap-2">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" style={{ outline: '2px solid rgba(212,168,67,0.4)' }} />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(145deg, #D4A843, #B8881E)' }}>
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {profile.username}
                </span>
              </Link>
              <form action={signOut}>
                <button className="text-[12px] font-medium px-3 py-1.5 rounded-md" style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/community/login"
                className="text-[13px] font-medium px-4 py-1.5 rounded-md"
                style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.18)' }}>
                Log In
              </Link>
              <Link href="/community/register"
                className="text-[13px] font-semibold px-4 py-1.5 rounded-md"
                style={{ background: 'linear-gradient(145deg, #D4A843 0%, #B8881E 100%)', color: '#fff' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </div>

    </div>
  )
}
