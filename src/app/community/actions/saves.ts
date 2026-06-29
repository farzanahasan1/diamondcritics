'use server'

import { createClient } from '@/lib/supabase/server'

export async function toggleSavePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to save posts.' }

  const { data: existing } = await supabase
    .from('saved_posts').select('post_id')
    .eq('user_id', user.id).eq('post_id', postId).maybeSingle()

  if (existing) {
    await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', postId)
    return { saved: false }
  } else {
    await supabase.from('saved_posts').insert({ user_id: user.id, post_id: postId })
    return { saved: true }
  }
}
