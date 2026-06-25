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
    <div className="min-h-screen" style={{ background: '#DAE0E6' }}>
      {/* Community Nav Bar */}
      <nav className="bg-white border-b border-[#EDEFF1] sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-4">
          <Link href="/community" className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-80">
            <span className="text-xl">💎</span>
            <span className="hidden sm:block text-sm font-semibold">Diamond Community</span>
          </Link>

          <div className="flex-1" />

          {user && profile ? (
            <div className="flex items-center gap-3">
              {profile.is_admin && (
                <Link href="/community/admin" className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded font-medium hover:bg-amber-200">
                  ⚙ Admin
                </Link>
              )}
              <Link
                href={`/community/u/${profile.username}`}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#C6973E] flex items-center justify-center text-white text-xs font-bold">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block">{profile.username}</span>
              </Link>
              <form action={signOut}>
                <button className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100">
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/community/login" className="text-sm px-4 py-1.5 border border-[#C6973E] text-[#C6973E] rounded-full font-semibold hover:bg-[#C6973E] hover:text-white transition-colors">
                Log In
              </Link>
              <Link href="/community/register" className="text-sm px-4 py-1.5 bg-[#C6973E] text-white rounded-full font-semibold hover:bg-[#b08535] transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {children}
      </div>
    </div>
  )
}
