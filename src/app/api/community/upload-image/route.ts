import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES = 1_048_576 // 1 MB

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('id', user.id)
    .single()
  if (profile?.is_banned) return NextResponse.json({ error: 'Your account has been banned.' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 1 MB.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WEBP, and GIF images are allowed.' }, { status: 400 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z]/g, '') || 'jpg'
  const path = `${user.id}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await admin.storage
    .from('community-images')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage
    .from('community-images')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
