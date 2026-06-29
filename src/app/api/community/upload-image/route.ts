import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES = 1_048_576 // 1 MB

// Magic byte signatures for each allowed image type
const MAGIC: Array<{ type: string; bytes: number[]; offset?: number }> = [
  { type: 'image/jpeg',  bytes: [0xFF, 0xD8, 0xFF] },
  { type: 'image/png',   bytes: [0x89, 0x50, 0x4E, 0x47] },
  { type: 'image/webp',  bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF....WEBP
  { type: 'image/gif',   bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
]

function checkMagicBytes(buf: Buffer): boolean {
  for (const sig of MAGIC) {
    const offset = sig.offset ?? 0
    if (sig.bytes.every((b, i) => buf[offset + i] === b)) return true
  }
  return false
}

const UPLOAD_LIMIT = 10
const UPLOAD_WINDOW_MS = 3_600_000 // 1 hour

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

  // Supabase-backed rate limit — survives cold starts
  const windowStart = new Date(Date.now() - UPLOAD_WINDOW_MS).toISOString()
  const { count: recentUploads } = await supabase
    .from('community_uploads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', windowStart)

  if ((recentUploads ?? 0) >= UPLOAD_LIMIT) {
    return NextResponse.json({ error: 'Too many uploads. Please wait before trying again.' }, { status: 429 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 1 MB.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WEBP, and GIF images are allowed.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Verify actual file content matches an image signature (prevents disguised uploads)
  if (!checkMagicBytes(buffer)) {
    return NextResponse.json({ error: 'File does not appear to be a valid image.' }, { status: 400 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : file.type === 'image/gif' ? 'gif' : 'jpg'
  const path = `${user.id}/${Date.now()}.${ext}`

  const { data, error } = await admin.storage
    .from('community-images')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  // Track upload for rate limiting (fire-and-forget — use service role to bypass RLS)
  await admin.from('community_uploads').insert({ user_id: user.id })

  const { data: { publicUrl } } = admin.storage
    .from('community-images')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl })
}
