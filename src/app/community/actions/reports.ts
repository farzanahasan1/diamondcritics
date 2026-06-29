'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ReportReason } from '@/lib/community/moderation'

export async function reportContent(
  targetType: 'post' | 'comment' | 'user',
  targetId: string,
  reason: ReportReason,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to report.' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    target_type: targetType,
    target_id: targetId,
    reason,
  })

  if (error) {
    if (error.code === '23505') return { success: true } // already reported by this user
    return { error: 'Could not submit report. Try again.' }
  }

  // Reports are queued for admin review only — no auto-hide to prevent abuse
  revalidatePath('/community', 'layout')
  return { success: true }
}
