import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/community'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Auto-join all communities on first login
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: communities } = await supabase.from('communities').select('id')
        if (communities?.length) {
          await supabase.from('community_members').upsert(
            communities.map(c => ({ community_id: c.id, user_id: user.id })),
            { onConflict: 'community_id,user_id', ignoreDuplicates: true }
          )
          for (const c of communities) {
            const { count } = await supabase.from('community_members').select('*', { count: 'exact', head: true }).eq('community_id', c.id)
            await supabase.from('communities').update({ member_count: count ?? 0 }).eq('id', c.id)
          }
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/community/login?error=auth_failed`)
}
