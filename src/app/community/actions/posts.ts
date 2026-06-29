'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { containsSpam } from '@/lib/community/moderation'
import { requireAdmin, fetchOgImage } from './_helpers'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to post.' }

  const { data: profile } = await supabase
    .from('profiles').select('is_banned').eq('id', user.id).single()
  if (profile?.is_banned) return { error: 'Your account has been banned.' }

  const title       = ((formData.get('title') ?? '') as string).trim()
  const body        = ((formData.get('body') ?? '') as string).trim()
  const url         = ((formData.get('url') ?? '') as string).trim()
  const imageUrl    = ((formData.get('image_url') ?? '') as string).trim()
  const rawFlair    = ((formData.get('flair') ?? '') as string).trim()
  const communitySlug = formData.get('community') as string
  const type        = (formData.get('type') as string) || 'text'

  const VALID_FLAIRS = ['engaged','natural','lab','just-bought','need-advice','price-check','show-tell','comparison','gia-igi','discussion']
  const flair = VALID_FLAIRS.includes(rawFlair) ? rawFlair : null

  if (!title || title.length < 5) return { error: 'Title must be at least 5 characters.' }
  if (title.length > 300) return { error: 'Title must be under 300 characters.' }
  if (containsSpam(title) || containsSpam(body)) return { error: 'Your post was flagged as spam. Please review our community rules.' }

  if (type === 'link') {
    if (!url) return { error: 'A URL is required for link posts.' }
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) return { error: 'Only http:// and https:// URLs are allowed.' }
    } catch {
      return { error: 'Please enter a valid URL (must start with https://).' }
    }
  }
  if (type === 'image') {
    if (!imageUrl) return { error: 'Please upload an image before posting.' }
    const expectedPrefix = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/community-images/'
    if (!imageUrl.startsWith(expectedPrefix)) return { error: 'Invalid image URL.' }
  }

  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const { count: recentPosts } = await supabase
    .from('posts').select('id', { count: 'exact', head: true })
    .eq('author_id', user.id).gte('created_at', oneHourAgo)
  if ((recentPosts ?? 0) >= 3) return { error: 'You can only create 3 posts per hour. Please wait before posting again.' }

  const oneMinAgo = new Date(Date.now() - 60000).toISOString()
  const { count: burstPosts } = await supabase
    .from('posts').select('id', { count: 'exact', head: true })
    .eq('author_id', user.id).gte('created_at', oneMinAgo)
  if ((burstPosts ?? 0) >= 1) return { error: 'Please wait a moment before posting again.' }

  const { data: community } = await supabase
    .from('communities').select('id, slug').eq('slug', communitySlug).single()
  if (!community) return { error: 'Community not found.' }

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      community_id: community.id,
      author_id: user.id,
      title,
      body: type !== 'link' ? body || null : null,
      url: type === 'link' ? url || null : null,
      image_url: type === 'image' ? imageUrl || null : null,
      flair,
      type,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  await supabase.from('post_votes').insert({ post_id: post.id, user_id: user.id, vote: 1 })
  await supabase.from('posts').update({ score: 1 }).eq('id', post.id)

  if (type === 'link' && url) {
    const previewImage = await fetchOgImage(url)
    if (previewImage) await supabase.from('posts').update({ link_preview_image: previewImage }).eq('id', post.id)
  }

  fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diamondcritics.com'}/api/community/ping-indexnow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId: post.id }),
  }).catch(() => {})

  revalidatePath('/community')
  revalidatePath(`/community/r/${communitySlug}`)
  redirect(`/community/post/${post.id}`)
}

export async function editPost(postId: string, title: string, body: string, url: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: post } = await supabase
    .from('posts').select('author_id, type, community:communities(slug)').eq('id', postId).single()
  const { isAdmin } = await requireAdmin(supabase, user.id)

  if (!post || (post.author_id !== user.id && !isAdmin)) return { error: 'Not authorized.' }

  const cleanTitle = title.trim()
  if (!cleanTitle || cleanTitle.length < 5) return { error: 'Title must be at least 5 characters.' }
  if (cleanTitle.length > 300) return { error: 'Title must be under 300 characters.' }

  const updates: Record<string, string> = { title: cleanTitle, updated_at: new Date().toISOString() }
  if (post.type === 'text') updates.body = body.trim()
  if (post.type === 'link') updates.url = url.trim()

  const { error } = await supabase.from('posts').update(updates).eq('id', postId)
  if (error) return { error: error.message }

  const slug = (post.community as unknown as { slug: string } | null)?.slug
  revalidatePath(`/community/post/${postId}`)
  revalidatePath('/community')
  if (slug) revalidatePath(`/community/r/${slug}`)
  return { success: true }
}

export async function toggleDraft(postId: string, isDraft: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: post } = await supabase
    .from('posts').select('author_id, community:communities(slug)').eq('id', postId).single()
  const { isAdmin } = await requireAdmin(supabase, user.id)

  if (!post || (post.author_id !== user.id && !isAdmin)) return { error: 'Not authorized.' }

  await supabase.from('posts').update({ is_draft: isDraft }).eq('id', postId)

  const slug = (post.community as unknown as { slug: string } | null)?.slug
  revalidatePath(`/community/post/${postId}`)
  revalidatePath('/community')
  if (slug) revalidatePath(`/community/r/${slug}`)
  return { success: true }
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data: post } = await supabase
    .from('posts').select('author_id, community:communities(slug)').eq('id', postId).single()
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()

  if (!post || (post.author_id !== user.id && !profile?.is_admin)) return { error: 'Not authorized.' }

  await supabase.from('posts').update({ is_deleted: true }).eq('id', postId)

  const slug = (post.community as unknown as { slug: string } | null)?.slug
  revalidatePath('/community')
  if (slug) revalidatePath(`/community/r/${slug}`)
  redirect('/community')
}

export async function refreshLinkPreviews() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }
  const { error: adminErr } = await requireAdmin(supabase, user.id)
  if (adminErr) return { error: adminErr }

  const { data: posts } = await supabase
    .from('posts').select('id, url')
    .eq('type', 'link').is('link_preview_image', null).not('url', 'is', null)

  if (!posts?.length) return { updated: 0 }

  const results = await Promise.allSettled(
    posts.map(async (post) => {
      const img = await fetchOgImage(post.url!)
      if (!img) return null
      await supabase.from('posts').update({ link_preview_image: img }).eq('id', post.id)
      return img
    })
  )

  const updated = results.filter(r => r.status === 'fulfilled' && r.value).length
  revalidatePath('/community')
  return { updated, total: posts.length }
}
