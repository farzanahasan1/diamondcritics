'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isDisposableEmail } from '@/lib/community/moderation'

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const raw = ((formData.get('email') ?? '') as string).trim()
  const password = formData.get('password') as string

  let email = raw
  if (!raw.includes('@')) {
    const { data: profile } = await supabase
      .from('profiles').select('id').eq('username', raw.toLowerCase()).maybeSingle()

    if (!profile) return { error: 'No account found with that username.' }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { error: 'Username login is not configured yet. Please log in with your email address.' }
    }
    const { createClient: createAdmin } = await import('@supabase/supabase-js')
    const adminClient = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    )
    const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(profile.id)
    if (!authUser?.email) return { error: 'Could not look up your account. Try logging in with your email address.' }
    email = authUser.email
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return { error: 'Please confirm your email first. Check your inbox (and spam folder) for a confirmation link from DiamondCritics.' }
    }
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return { error: 'Incorrect email or password. Please try again.' }
    }
    return { error: error.message }
  }

  revalidatePath('/community', 'layout')
  redirect('/community')
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = ((formData.get('email') ?? '') as string).trim()
  const password = ((formData.get('password') ?? '') as string)
  const username = ((formData.get('username') ?? '') as string).trim().toLowerCase()

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { error: 'Username must be 3–20 characters: letters, numbers, underscores only.' }
  }
  if (isDisposableEmail(email)) {
    return { error: 'Please use a permanent email address. Disposable/temporary emails are not allowed.' }
  }

  const { data: existing } = await supabase
    .from('profiles').select('id').eq('username', username).maybeSingle()
  if (existing) return { error: 'Username already taken.' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://diamondcritics.com'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${siteUrl}/community/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  revalidatePath('/community', 'layout')
  redirect('/community?registered=1')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/community', 'layout')
  redirect('/community')
}

export async function signInWithGoogle() {
  redirect('/community/auth/google')
}
