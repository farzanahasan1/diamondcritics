import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Vercel Cron calls this route with Authorization: Bearer <CRON_SECRET>
// Schedule: every Sunday at 03:00 UTC (see vercel.json)
// Action: delete Storage images from posts older than 90 days, null out image_url

const STORAGE_URL_PREFIX = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/community-images/'
const RETENTION_DAYS = 90

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, image_url')
    .eq('type', 'image')
    .not('image_url', 'is', null)
    .lt('created_at', cutoff)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!posts?.length) {
    return NextResponse.json({ deleted: 0, message: 'No expired images found.' })
  }

  let deleted = 0
  const errors: string[] = []

  for (const post of posts) {
    const url = post.image_url as string
    if (!url.startsWith(STORAGE_URL_PREFIX)) continue

    const storagePath = url.slice(STORAGE_URL_PREFIX.length)
    const { error: removeError } = await supabase.storage
      .from('community-images')
      .remove([storagePath])

    if (removeError) {
      errors.push(`post ${post.id}: ${removeError.message}`)
      continue
    }

    await supabase.from('posts').update({ image_url: null }).eq('id', post.id)
    deleted++
  }

  return NextResponse.json({
    deleted,
    total: posts.length,
    ...(errors.length && { errors }),
  })
}
