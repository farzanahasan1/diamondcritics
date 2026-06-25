import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const state = crypto.randomUUID()
  const cookieStore = await cookies()

  cookieStore.set('gauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    sameSite: 'lax',
    path: '/',
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://diamondcritics.com'
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${siteUrl}/community/auth/google-callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
