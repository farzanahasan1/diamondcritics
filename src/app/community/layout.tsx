import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'
import NotificationBell from '@/components/community/NotificationBell'

const SITE_URL = 'https://diamondcritics.com'

export const metadata: Metadata = {
  title: {
    default: 'Diamond Community — Ask, Share & Get Expert Advice',
    template: '%s',
  },
  description: 'The #1 diamond community where buyers, GIA-certified experts and jewelers discuss cut, clarity, color and carat. Real advice before you buy.',
  keywords: ['diamond community', 'diamond forum', 'diamond advice', 'engagement ring forum', 'GIA diamond help', 'buy diamond advice', 'diamond experts online'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'DiamondCritics Diamond Community',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@diamondcritics',
  },
  alternates: {
    canonical: `${SITE_URL}/community`,
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DiamondCritics',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: ['https://diamondcritics.com'],
  description: 'DiamondCritics is the expert diamond buying resource with GIA-backed guides, live price data, and an active diamond community.',
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DiamondCritics',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/community?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
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
    <div style={{ minHeight: '100vh', background: '#F4F0EA' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* ── Top bar ── */}
      <nav style={{ background: '#1C1209', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px', height: '52px', display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Brand */}
          <Link href="/community" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
              background: 'linear-gradient(145deg, #D4A843 0%, #B8881E 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M5 2.5L2 7.5l8 10 8-10-3-5H5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M2 7.5h16M5 2.5l2.5 5m5-5L10 7.5" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#F0D88A', fontWeight: 600, fontSize: '13px', lineHeight: 1 }}>Diamond Community</div>
              <div className="c-nav-user-text" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '2px', lineHeight: 1 }}>by DiamondCritics.com</div>
            </div>
          </Link>

          {/* Nav links — hidden on mobile */}
          <div className="c-nav-links">
            <Link href="/community" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, padding: '6px 12px', borderRadius: '7px', textDecoration: 'none' }}>
              Feed
            </Link>
            <Link href="/community/r/diamonds" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 500, padding: '6px 12px', borderRadius: '7px', textDecoration: 'none' }}>
              r/diamonds
            </Link>
          </div>

          <div style={{ flex: 1 }} />

          {/* Auth */}
          {user && profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {profile.is_admin && (
                <Link href="/community/admin" style={{
                  fontSize: '12px', fontWeight: 600, padding: '5px 10px', borderRadius: '6px', textDecoration: 'none',
                  background: 'rgba(212,168,67,0.15)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)',
                }}>
                  Admin
                </Link>
              )}
              <NotificationBell />
              <Link href={`/community/u/${profile.username}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', flexShrink: 0 }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', outline: '2px solid rgba(212,168,67,0.4)', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(145deg, #D4A843, #B8881E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
                <span className="c-nav-user-text" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 500 }}>{profile.username}</span>
              </Link>
              <form action={signOut}>
                <button style={{ fontSize: '12px', fontWeight: 500, padding: '6px 10px', borderRadius: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <Link href="/community/login" style={{
                fontSize: '13px', fontWeight: 500, padding: '7px 12px', borderRadius: '8px', textDecoration: 'none',
                color: 'rgba(255,255,255,0.75)', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                whiteSpace: 'nowrap',
              }}>
                Log In
              </Link>
              <Link href="/community/register" style={{
                fontSize: '13px', fontWeight: 600, padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                background: 'linear-gradient(145deg, #D4A843 0%, #B8881E 100%)', color: '#fff',
                whiteSpace: 'nowrap',
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="c-content-wrap" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {children}
      </div>

    </div>
  )
}
