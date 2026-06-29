'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { pushNotification } from './_helpers'

export async function votePost(postId: string, vote: 1 | -1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to vote.' }

  const { data: existing } = await supabase
    .from('post_votes').select('vote')
    .eq('post_id', postId).eq('user_id', user.id).maybeSingle()

  const isNewUpvote = !existing && vote === 1

  if (existing) {
    if (existing.vote === vote) {
      await supabase.from('post_votes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_votes').update({ vote }).eq('post_id', postId).eq('user_id', user.id)
    }
  } else {
    await supabase.from('post_votes').insert({ post_id: postId, user_id: user.id, vote })
  }

  const { data: allVotes } = await supabase.from('post_votes').select('vote').eq('post_id', postId)
  const newScore = allVotes?.reduce((s, v) => s + v.vote, 0) ?? 0
  await supabase.from('posts').update({ score: newScore }).eq('id', postId)

  if (isNewUpvote) {
    const { data: post } = await supabase.from('posts').select('author_id').eq('id', postId).single()
    if (post?.author_id) await pushNotification(supabase, post.author_id, user.id, 'post_upvote', postId)
  }

  revalidatePath('/community', 'layout')
}

export async function voteComment(commentId: string, vote: 1 | -1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to vote.' }

  const { data: existing } = await supabase
    .from('comment_votes').select('vote')
    .eq('comment_id', commentId).eq('user_id', user.id).maybeSingle()

  const isNewUpvote = !existing && vote === 1

  if (existing) {
    if (existing.vote === vote) {
      await supabase.from('comment_votes').delete().eq('comment_id', commentId).eq('user_id', user.id)
    } else {
      await supabase.from('comment_votes').update({ vote }).eq('comment_id', commentId).eq('user_id', user.id)
    }
  } else {
    await supabase.from('comment_votes').insert({ comment_id: commentId, user_id: user.id, vote })
  }

  const { data: allVotes } = await supabase.from('comment_votes').select('vote').eq('comment_id', commentId)
  const newScore = allVotes?.reduce((s, v) => s + v.vote, 0) ?? 0
  await supabase.from('comments').update({ score: newScore }).eq('id', commentId)

  if (isNewUpvote) {
    const { data: comment } = await supabase.from('comments').select('author_id, post_id').eq('id', commentId).single()
    if (comment?.author_id) await pushNotification(supabase, comment.author_id, user.id, 'comment_upvote', comment.post_id, commentId)
  }

  revalidatePath('/community', 'layout')
}
