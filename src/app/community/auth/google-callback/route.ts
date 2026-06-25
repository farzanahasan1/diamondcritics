import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://diamondcritics.com'

  const cookieStore = await cookies()
  const savedState = cookieStore.get('gauth_state')?.value
  cookieStore.delete('gauth_state')

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${siteUrl}/community/login?error=auth_failed`)
  }

  // Exchange Google auth code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${siteUrl}/community/auth/google-callback`,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenRes.json()
  if (!tokens.id_token) {
    return NextResponse.redirect(`${siteUrl}/community/login?error=auth_failed`)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: tokens.id_token,
  })

  if (error || !data.user) {
    return NextResponse.redirect(
      `${siteUrl}/community/login?error=${encodeURIComponent(error?.message ?? 'auth_failed')}`
    )
  }

  // Ensure a profile row exists (Google users may not have one yet)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle()

  if (!existingProfile) {
    const meta = data.user.user_metadata ?? {}
    const rawName = (meta.full_name || meta.name || meta.email || 'user') as string
    const base = rawName
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 15) || 'user'

    // Ensure unique username
    let username = base
    const { data: taken } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (taken) {
      username = `${base}${Math.floor(Math.random() * 9000) + 1000}`
    }

    await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      display_name: (meta.full_name || meta.name || '') as string,
      avatar_url: (meta.avatar_url || meta.picture || '') as string,
    })
  }

  return NextResponse.redirect(`${siteUrl}/community`)
}
