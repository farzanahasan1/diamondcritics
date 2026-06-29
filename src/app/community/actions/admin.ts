'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAuth, requireAdmin, logAdminAction } from './_helpers'

export async function createCommunity(formData: FormData) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireAuth(supabase)
  if (!user) return { error: authErr }
  const { error: adminErr } = await requireAdmin(supabase, user.id)
  if (adminErr) return { error: adminErr }

  const name        = ((formData.get('name') ?? '') as string).trim()
  const slug        = ((formData.get('slug') ?? '') as string).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const description = ((formData.get('description') ?? '') as string).trim()
  const rules       = ((formData.get('rules') ?? '') as string).trim()

  if (!name || !slug) return { error: 'Name and slug required.' }
  if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug)) return { error: 'Slug must be 3–50 characters, letters/numbers/hyphens only.' }

  const { error } = await supabase.from('communities').insert({ name, slug, description, rules })
  if (error) return { error: error.message }

  revalidatePath('/community')
  revalidatePath('/community/admin')
  return { success: true }
}

export async function banUser(userId: string, ban: boolean) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireAuth(supabase)
  if (!user) return { error: authErr }
  const { error: adminErr } = await requireAdmin(supabase, user.id)
  if (adminErr) return { error: adminErr }
  if (userId === user.id) return { error: 'You cannot ban yourself.' }

  await supabase.from('profiles').update({ is_banned: ban }).eq('id', userId)
  await logAdminAction(supabase, user.id, ban ? 'ban_user' : 'unban_user', 'user', userId)
  revalidatePath('/community/admin')
  return { success: true }
}

export async function awardBadge(userId: string, badgeId: string) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireAuth(supabase)
  if (!user) return { error: authErr }
  const { error: adminErr } = await requireAdmin(supabase, user.id)
  if (adminErr) return { error: adminErr }

  await supabase.from('user_badges').upsert({ user_id: userId, badge_id: badgeId, awarded_by: user.id })
  await logAdminAction(supabase, user.id, 'award_badge', 'user', userId, { badge_id: badgeId })
  revalidatePath('/community/admin')
  return { success: true }
}

export async function revokeBadge(userId: string, badgeId: string) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireAuth(supabase)
  if (!user) return { error: authErr }
  const { error: adminErr } = await requireAdmin(supabase, user.id)
  if (adminErr) return { error: adminErr }

  await supabase.from('user_badges').delete().eq('user_id', userId).eq('badge_id', badgeId)
  await logAdminAction(supabase, user.id, 'revoke_badge', 'user', userId, { badge_id: badgeId })
  revalidatePath('/community/admin')
  return { success: true }
}

export async function resolveReport(reportId: string) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireAuth(supabase)
  if (!user) return { error: authErr }
  const { error: adminErr } = await requireAdmin(supabase, user.id)
  if (adminErr) return { error: adminErr }

  await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
  await logAdminAction(supabase, user.id, 'resolve_report', 'report', reportId)
  revalidatePath('/community/admin')
  return { success: true }
}
