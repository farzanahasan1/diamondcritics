import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
    <div className="min-h-screen" style={{ background: '#EEEAE4' }}>
      {/* Community Nav */}
      <nav style={{ background: '#18110A', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-[52px] flex items-center gap-3">

          {/* Logo */}
          <Link href="/community" className="flex items-center gap-2.5 shrink-0 mr-1">
            <Image
              src="/images/diamond-critics-main-logo-small.avif"
              alt="DiamondCritics"
              width={120}
              height={32}
              className="h-7 w-auto"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
            />
            <span
              className="hidden sm:block text-[11px] font-medium tracking-widest uppercase border-l pl-2.5"
              style={{ color: '#C6973E', borderColor: 'rgba(198,151,62,0.4)' }}
            >
              Community
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5 ml-1">
            <Link href="/community" className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={undefined}>
              Feed
            </Link>
            <Link href="/community/r/diamonds" className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>
              r/diamonds
            </Link>
          </div>

          <div className="flex-1" />

          {user && profile ? (
            <div className="flex items-center gap-2">
              {profile.is_admin && (
                <Link
                  href="/community/admin"
                  className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium"
                  style={{ background: 'rgba(198,151,62,0.12)', color: '#C6973E', border: '1px solid rgba(198,151,62,0.25)' }}
                >
                  Admin
                </Link>
              )}
              <Link
                href={`/community/u/${profile.username}`}
                className="flex items-center gap-2 px-2 py-1 rounded-md"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" style={{ outline: '1.5px solid rgba(255,255,255,0.15)' }} />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #C6973E, #9a7030)', color: 'white' }}>
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-xs font-medium">{profile.username}</span>
              </Link>
              <form action={signOut}>
                <button className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/community/login"
                className="text-xs px-3.5 py-1.5 rounded-md font-medium"
                style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Log In
              </Link>
              <Link
                href="/community/register"
                className="text-xs px-3.5 py-1.5 rounded-md font-semibold"
                style={{ background: 'linear-gradient(135deg, #C6973E, #e8bf6a)', color: '#18110A' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-5">
        {children}
      </div>
    </div>
  )
}
