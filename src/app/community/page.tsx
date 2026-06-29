import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import PostFeed from './_components/PostFeed'
import SidebarData from './_components/SidebarData'
import { PostFeedSkeleton, SidebarSkeleton } from '@/components/community/Skeletons'

const SITE_URL = 'https://diamondcritics.com'

export const metadata: Metadata = {
  title: 'Diamond Community — Ask Diamond Questions & Get Expert Answers',
  description: 'Join the #1 diamond community. Ask questions about cut, clarity, color, carat and GIA reports. Get real answers from diamond experts, GIA graduates and experienced buyers before you spend thousands.',
  alternates: { canonical: `${SITE_URL}/community` },
  openGraph: {
    title: 'Diamond Community — Ask Questions, Get Expert Diamond Advice',
    description: 'The most trusted diamond community. Real answers from GIA-certified experts, jewelers and buyers on engagement rings, diamond prices and everything diamonds.',
    url: `${SITE_URL}/community`,
    type: 'website',
    images: [{ url: '/images/diamondcritics-og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diamond Community — Ask Questions, Get Expert Diamond Advice',
    description: 'The most trusted diamond community. Real answers from GIA-certified experts, jewelers and buyers on engagement rings, diamond prices and everything diamonds.',
  },
}


const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best diamond cut to buy?',
      acceptedAnswer: { '@type': 'Answer', text: 'The round brilliant cut maximises light return and is the most popular choice. For the best value, look for GIA Excellent cut with a table between 54–58% and depth between 59–62.5%. Hearts and Arrows round diamonds represent the top tier.' },
    },
    {
      '@type': 'Question',
      name: 'How much does a 1 carat diamond cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'A 1 carat round diamond costs between $3,200 and $12,000 depending on cut, color and clarity. A GIA Excellent G-VS2 round diamond typically costs around $5,500–$6,500 on Blue Nile. Lab-grown 1ct diamonds start around $1,500.' },
    },
    {
      '@type': 'Question',
      name: 'Is GIA better than IGI for diamond certification?',
      acceptedAnswer: { '@type': 'Answer', text: 'GIA (Gemological Institute of America) is the gold standard for natural diamonds — grading is stricter and more consistent. IGI is widely accepted for lab-grown diamonds where the price premium for GIA certification is less justified. For natural diamonds, always prefer GIA.' },
    },
    {
      '@type': 'Question',
      name: 'What diamond color grade should I buy?',
      acceptedAnswer: { '@type': 'Answer', text: 'G or H color is the sweet spot for round diamonds — they appear colorless to the naked eye but cost 20–30% less than D–F stones. In yellow or rose gold settings, you can go as low as J color since the metal masks any warmth.' },
    },
    {
      '@type': 'Question',
      name: 'Should I buy a natural or lab-grown diamond?',
      acceptedAnswer: { '@type': 'Answer', text: 'Lab-grown diamonds are chemically identical to natural diamonds and cost 60–80% less. A lab-grown 2ct D-VVS1 costs around $2,800 vs $25,000+ natural. The tradeoff is resale value — natural diamonds hold value better long-term. For pure sparkle per dollar, lab-grown wins.' },
    },
    {
      '@type': 'Question',
      name: 'What is the best place to buy diamonds online?',
      acceptedAnswer: { '@type': 'Answer', text: 'Blue Nile and James Allen are the two largest online diamond retailers with the best selection and competitive prices. Blue Nile offers the widest inventory; James Allen has 360° video on every stone. Both offer GIA-certified diamonds and free returns.' },
    },
  ],
}

type SortMode = 'hot' | 'new' | 'top' | 'feed'

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; registered?: string }>
}) {
  const { sort, registered } = await searchParams
  const sortMode: SortMode = sort === 'new' ? 'new' : sort === 'top' ? 'top' : sort === 'feed' ? 'feed' : 'hot'

  // Only auth check here — fast (reads cookie), no DB query
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const sortTabs: { key: SortMode; label: string; emoji: string; authRequired?: boolean }[] = [
    { key: 'hot', label: 'Hot', emoji: '🔥' },
    { key: 'new', label: 'New', emoji: '✨' },
    { key: 'top', label: 'Top', emoji: '📈' },
    { key: 'feed', label: 'My Feed', emoji: '🏠', authRequired: true },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div className="c-layout">

      {/* ── Main column ── */}
      <div>

        {/* Hero */}
        <div className="c-hero" style={{ marginBottom: '14px' }}>
          <h1 className="c-hero__title">Diamond Community</h1>
          <p className="c-hero__desc">
            The trusted place to ask diamond questions and get real answers. Cut grades, GIA vs IGI, price checks, engagement ring advice — from experts who know diamonds.
          </p>
          {!user && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <a href="/community/register" className="c-btn c-btn-primary">Join Free</a>
              <a href="/community/login" className="c-btn c-btn-outline" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>Log In</a>
            </div>
          )}
        </div>

        {/* Email confirmation banner */}
        {registered === '1' && (
          <div className="c-banner-info" style={{ marginBottom: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,12 2,6"/>
            </svg>
            <span><strong>Check your email.</strong> We sent you a confirmation link. Click it to activate your account, then log in.</span>
          </div>
        )}

        {/* Sort bar */}
        <div className="c-sort-card" style={{ marginBottom: '12px' }}>
          <div className="c-sort-bar" style={{ flex: 1, minWidth: 0 }}>
            {sortTabs.filter(tab => !tab.authRequired || user).map(tab => (
              <Link key={tab.key} href={`/community?sort=${tab.key}`} className={`c-sort-link${sortMode === tab.key ? ' active' : ''}`}>
                <span>{tab.emoji}</span> {tab.label}
              </Link>
            ))}
          </div>
          {user && (
            <Link href="/community/r/diamonds/submit" className="c-btn c-btn-primary" style={{ flexShrink: 0, fontSize: '13px', padding: '7px 14px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Post
            </Link>
          )}
        </div>

        {/* Feed — streams in while shell renders immediately */}
        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeed sortMode={sortMode} userId={user?.id} />
        </Suspense>
      </div>

      {/* ── Sidebar — streams independently ── */}
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarData userId={user?.id} />
      </Suspense>
    </div>
    </>
  )
}
