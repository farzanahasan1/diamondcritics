import { createClient } from '@/lib/supabase/server'
import CommunitySidebar from '@/components/community/CommunitySidebar'

const SITE_URL = 'https://diamondcritics.com'

export default async function SidebarData({ userId }: { userId?: string }) {
  const supabase = await createClient()

  const [communitiesResult, userResult] = await Promise.all([
    supabase.from('communities')
      .select('id,slug,name,description,icon_url,banner_url,member_count,post_count,created_at')
      .order('member_count', { ascending: false }),
    userId
      ? supabase.auth.getUser()
      : Promise.resolve({ data: { user: null } }),
  ])

  const communities = communitiesResult.data ?? []
  const user = userResult.data.user

  const totalMembers = communities.reduce((s, c) => s + (c.member_count ?? 0), 0)
  const totalPosts   = communities.reduce((s, c) => s + (c.post_count   ?? 0), 0)

  const forumSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebForum',
    name: 'Diamond Community',
    alternateName: 'DiamondCritics Diamond Forum',
    description: 'The premier online diamond community where buyers, GIA-certified experts and professional jewelers discuss diamonds, engagement rings, and diamond prices.',
    url: `${SITE_URL}/community`,
    inLanguage: 'en-US',
    about: { '@type': 'Thing', name: 'Diamonds', sameAs: 'https://en.wikipedia.org/wiki/Diamond' },
    publisher: { '@type': 'Organization', name: 'DiamondCritics', url: SITE_URL },
    interactionStatistic: [
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/FollowAction', userInteractionCount: totalMembers },
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WriteAction',  userInteractionCount: totalPosts },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(forumSchema) }} />
      <CommunitySidebar communities={communities} user={user} />
    </>
  )
}
