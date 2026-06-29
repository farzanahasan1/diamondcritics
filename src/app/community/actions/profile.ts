'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const display_name = (formData.get('display_name') as string).trim().slice(0, 50)
  const bio          = (formData.get('bio') as string).trim().slice(0, 300)

  await supabase.from('profiles').update({ display_name, bio }).eq('id', user.id)
  revalidatePath('/community', 'layout')
  return { success: true }
}

export async function updateUserFlair(flair: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const VALID = [
    'Just Engaged 💍', 'GIA Graduate 🎓', 'Lab Diamond Fan 🔬',
    'Veteran Buyer ⭐', 'Jeweller 💼', '2ct Club 💎', 'First Timer 🌱', 'Ring Nerd 🔍',
  ]
  const safe = flair && VALID.includes(flair) ? flair : null

  await supabase.from('profiles').update({ user_flair: safe }).eq('id', user.id)
  revalidatePath('/community', 'layout')
  return { success: true }
}
