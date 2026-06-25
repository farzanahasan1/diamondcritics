'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

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
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = (formData.get('username') as string).trim().toLowerCase()

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { error: 'Username must be 3–20 characters: letters, numbers, underscores only.' }
  }

  // Check username is not taken
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()

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
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://diamondcritics.com'}/community/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to post.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('id', user.id)
    .single()

  if (profile?.is_banned) return { error: 'Your account has been banned.' }

  const title = (formData.get('title') as string).trim()
  const body = (formData.get('body') as string).trim()
  const url = (formData.get('url') as string).trim()
  const communitySlug = formData.get('community') as string
  const type = (formData.get('type') as string) || 'text'

  if (!title || title.length < 5) return { error: 'Title must be at least 5 characters.' }
  if (title.length > 300) return { error: 'Title must be under 300 characters.' }
  if (type === 'link' && !url) return { error: 'A URL is required for link posts.' }

  // Rate limit: max 5 posts per hour
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const { count: recentPosts } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', user.id)
    .gte('created_at', oneHourAgo)

  if ((recentPosts ?? 0) >= 5) {
    return { error: 'You can only create 5 posts per hour. Please wait before posting again.' }
  }

  const { data: community } = await supabase
    .from('communities')
    .select('id, slug')
    .eq('slug', communitySlug)
    .single()

  if (!community) return { error: 'Community not found.' }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      community_id: community.id,
      author_id: user.id,
      title,
      body: type !== 'link' ? body || null : null,
      url: type === 'link' ? url || null : null,
      type,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Auto-upvote own post
  await supabase.from('post_votes').insert({
    post_id: post.id,
    user_id: user.id,
    vote: 1,
  })

  revalidatePath('/community')
  revalidatePath(`/community/r/${communitySlug}`)
  redirect(`/community/post/${post.id}`)
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: post } = await supabase
    .from('posts')
    .select('author_id, community:communities(slug)')
    .eq('id', postId)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!post || (post.author_id !== user.id && !profile?.is_admin)) {
    return { error: 'Not authorized.' }
  }

  await supabase.from('posts').update({ is_deleted: true }).eq('id', postId)

  const communityData = post.community as unknown as { slug: string } | null
  const slug = communityData?.slug
  revalidatePath('/community')
  if (slug) revalidatePath(`/community/r/${slug}`)
  redirect('/community')
}

// ─── Votes ───────────────────────────────────────────────────────────────────

export async function votePost(postId: string, vote: 1 | -1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to vote.' }

  const { data: existing } = await supabase
    .from('post_votes')
    .select('vote')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    if (existing.vote === vote) {
      // Remove vote (toggle off)
      await supabase.from('post_votes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      // Change vote direction
      await supabase.from('post_votes').update({ vote }).eq('post_id', postId).eq('user_id', user.id)
    }
  } else {
    await supabase.from('post_votes').insert({ post_id: postId, user_id: user.id, vote })
  }

  revalidatePath('/community', 'layout')
}

export async function voteComment(commentId: string, vote: 1 | -1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to vote.' }

  const { data: existing } = await supabase
    .from('comment_votes')
    .select('vote')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    if (existing.vote === vote) {
      await supabase.from('comment_votes').delete().eq('comment_id', commentId).eq('user_id', user.id)
    } else {
      await supabase.from('comment_votes').update({ vote }).eq('comment_id', commentId).eq('user_id', user.id)
    }
  } else {
    await supabase.from('comment_votes').insert({ comment_id: commentId, user_id: user.id, vote })
  }

  revalidatePath('/community', 'layout')
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function createComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Login to comment.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('id', user.id)
    .single()

  if (profile?.is_banned) return { error: 'Your account has been banned.' }

  const body = (formData.get('body') as string).trim()
  const postId = formData.get('post_id') as string
  const parentId = formData.get('parent_id') as string | null

  if (!body || body.length < 2) return { error: 'Comment too short.' }
  if (body.length > 10000) return { error: 'Comment too long.' }

  // Rate limit: max 20 comments per hour
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const { count: recentComments } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', user.id)
    .gte('created_at', oneHourAgo)

  if ((recentComments ?? 0) >= 20) {
    return { error: 'You are commenting too quickly. Please wait before commenting again.' }
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    author_id: user.id,
    parent_id: parentId || null,
    body,
  })

  if (error) return { error: error.message }

  revalidatePath(`/community/post/${postId}`)
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: comment } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!comment || (comment.author_id !== user.id && !profile?.is_admin)) {
    return { error: 'Not authorized.' }
  }

  await supabase.from('comments').update({ is_deleted: true }).eq('id', commentId)
  revalidatePath(`/community/post/${postId}`)
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function createCommunity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only.' }

  const name = (formData.get('name') as string).trim()
  const slug = (formData.get('slug') as string).trim().toLowerCase().replace(/\s+/g, '-')
  const description = (formData.get('description') as string).trim()
  const rules = (formData.get('rules') as string).trim()

  if (!name || !slug) return { error: 'Name and slug required.' }

  const { error } = await supabase.from('communities').insert({ name, slug, description, rules })
  if (error) return { error: error.message }

  revalidatePath('/community')
  revalidatePath('/community/admin')
  return { success: true }
}

export async function banUser(userId: string, ban: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only.' }

  await supabase.from('profiles').update({ is_banned: ban }).eq('id', userId)
  revalidatePath('/community/admin')
  return { success: true }
}

export async function awardBadge(userId: string, badgeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only.' }

  await supabase.from('user_badges').upsert({
    user_id: userId,
    badge_id: badgeId,
    awarded_by: user.id,
  })

  revalidatePath('/community/admin')
  return { success: true }
}

export async function revokeBadge(userId: string, badgeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return { error: 'Admin only.' }

  await supabase.from('user_badges').delete().eq('user_id', userId).eq('badge_id', badgeId)
  revalidatePath('/community/admin')
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const display_name = (formData.get('display_name') as string).trim()
  const bio = (formData.get('bio') as string).trim()

  await supabase.from('profiles').update({ display_name, bio }).eq('id', user.id)
  revalidatePath('/community', 'layout')
  return { success: true }
}
