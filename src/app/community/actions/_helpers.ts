import { createClient } from '@/lib/supabase/server'

export type SupabaseClient = Awaited<ReturnType<typeof createClient>>
export type NotifType = 'comment_on_post' | 'reply_to_comment' | 'post_upvote' | 'comment_upvote'

export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, error: 'Not authenticated.' as const }
  return { user, error: null }
}

export async function requireAdmin(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', userId).single()
  if (!profile?.is_admin) return { isAdmin: false, error: 'Admin only.' as const }
  return { isAdmin: true, error: null }
}

export async function logAdminAction(
  supabase: SupabaseClient,
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
) {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details ?? null,
  })
}

export async function pushNotification(
  supabase: SupabaseClient,
  userId: string,
  actorId: string,
  type: NotifType,
  postId?: string,
  commentId?: string,
) {
  if (userId === actorId) return
  await supabase.from('notifications').insert({
    user_id: userId,
    actor_id: actorId,
    type,
    post_id: postId ?? null,
    comment_id: commentId ?? null,
  })
}

export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DiamondCritics/1.0; +https://diamondcritics.com)' },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const ogImageMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    const raw = ogImageMatch?.[1] ?? null
    if (!raw) return null
    try {
      return new URL(raw, url).href
    } catch {
      return raw.startsWith('http') ? raw : null
    }
  } catch {
    return null
  }
}
