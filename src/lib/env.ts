const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

const missing = REQUIRED.filter(k => !process.env[k])

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}\n` +
    'Check your .env.local file or Vercel project settings.',
  )
}

export const env = {
  SUPABASE_URL:              process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY:         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  SITE_URL:                  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diamondcritics.com',
} as const
