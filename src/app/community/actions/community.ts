'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from './_helpers'

async function syncMemberCount(supabase: SupabaseClient, communityId: string) {
  const { count } = await supabase
    .from('community_members').select('*', { count: 'exact', head: true })
    .eq('community_id', communityId)
  await supabase.from('communities').update({ member_count: count ?? 0 }).eq('id', communityId)
}

export async function joinCommunity(communityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to join.' }

  const { error } = await supabase.from('community_members').insert({
    community_id: communityId,
    user_id: user.id,
  })

  if (error) {
    if (error.code === '23505') return { success: true } // already a member
    return { error: error.message }
  }

  await syncMemberCount(supabase, communityId)
  revalidatePath('/community', 'layout')
  return { success: true }
}

export async function leaveCommunity(communityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  await supabase.from('community_members')
    .delete().eq('community_id', communityId).eq('user_id', user.id)

  await syncMemberCount(supabase, communityId)
  revalidatePath('/community', 'layout')
  return { success: true }
}
