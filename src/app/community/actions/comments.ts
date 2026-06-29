'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { containsSpam } from '@/lib/community/moderation'
import { pushNotification } from './_helpers'

export async function createComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to comment.' }

  const { data: profile } = await supabase
    .from('profiles').select('is_banned').eq('id', user.id).single()
  if (profile?.is_banned) return { error: 'Your account has been banned.' }

  const body     = (formData.get('body') as string).trim()
  const postId   = formData.get('post_id') as string
  const parentId = formData.get('parent_id') as string | null

  if (!body || body.length < 2) return { error: 'Comment too short.' }
  if (body.length > 10000) return { error: 'Comment too long.' }
  if (containsSpam(body)) return { error: 'Your comment was flagged as spam. Please review our community rules.' }

  if (parentId) {
    const { data: parentComment } = await supabase
      .from('comments').select('post_id').eq('id', parentId).maybeSingle()
    if (!parentComment || parentComment.post_id !== postId) return { error: 'Invalid reply target.' }
  }

  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const { count: recentComments } = await supabase
    .from('comments').select('id', { count: 'exact', head: true })
    .eq('author_id', user.id).gte('created_at', oneHourAgo)
  if ((recentComments ?? 0) >= 15) return { error: 'You are commenting too quickly. Please wait before commenting again.' }

  const tenSecAgo = new Date(Date.now() - 10000).toISOString()
  const { count: burstComments } = await supabase
    .from('comments').select('id', { count: 'exact', head: true })
    .eq('author_id', user.id).gte('created_at', tenSecAgo)
  if ((burstComments ?? 0) >= 1) return { error: 'Please slow down. Wait a few seconds between comments.' }

  const { data: newComment, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: user.id, parent_id: parentId || null, body })
    .select('id').single()

  if (error) return { error: error.message }

  if (parentId) {
    const { data: parent } = await supabase.from('comments').select('author_id, is_deleted').eq('id', parentId).single()
    if (parent?.author_id && !parent.is_deleted) {
      await pushNotification(supabase, parent.author_id, user.id, 'reply_to_comment', postId, newComment?.id)
    }
  } else {
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single()
    if (post?.author_id) await pushNotification(supabase, post.author_id, user.id, 'comment_on_post', postId, newComment?.id)
  }

  revalidatePath('/community')
  revalidatePath(`/community/post/${postId}`)
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: comment } = await supabase
    .from('comments').select('author_id').eq('id', commentId).single()
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()

  if (!comment || (comment.author_id !== user.id && !profile?.is_admin)) return { error: 'Not authorized.' }

  await supabase.from('comments').update({ is_deleted: true }).eq('id', commentId)
  revalidatePath(`/community/post/${postId}`)
}
