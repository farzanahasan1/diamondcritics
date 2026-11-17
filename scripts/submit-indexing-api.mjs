import { GoogleAuth } from 'google-auth-library'
import fs from 'fs'
import path from 'path'

const SITE = 'https://diamondcritics.com'
const KEY_FILE = '/Users/mehedihasan/Projects/diamondcritics-8df8059f6989.json'
const POSTS_DIR = '/Users/mehedihasan/Projects/diamondcritics/content/posts'
const MAX_URLS = 200

// Support --offset N argument for batched daily runs
const offsetArg = process.argv.indexOf('--offset')
const OFFSET = offsetArg !== -1 ? parseInt(process.argv[offsetArg + 1], 10) : 0

// Priority 1: brand new / heavily updated posts from this session
const PRIORITY_SLUGS = [
  // New posts — asscher cluster (2026-09-18)
  'rose-gold-asscher-cut-engagement-ring',
  'white-gold-asscher-cut-engagement-ring',
  'asscher-cut-diamond-necklace',
  'asscher-cut-diamond-earrings',
  'asscher-cut-eternity-band',
  // Internal linking fixes — asscher cluster (2026-09-18)
  '1-carat-asscher-cut-diamond-ring',
  '1-5-carat-asscher-cut-diamond-ring',
  '2-carat-asscher-cut-diamond-ring',
  '2-5-carat-asscher-cut-diamond-ring',
  '3-carat-asscher-cut-diamond-ring',
  'asscher-cut-vs-radiant-cut-diamond',
  'emerald-cut-vs-asscher-cut-diamond',
  'princess-cut-vs-asscher-cut-diamond',
  'round-diamond-vs-asscher-cut',
]

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  return token.token
}

async function submitUrl(accessToken, url) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
  const data = await res.json()
  if (!res.ok) {
    return { url, status: 'ERROR', error: data.error?.message || JSON.stringify(data) }
  }
  return { url, status: 'OK', notifyTime: data.urlNotificationMetadata?.latestUpdate?.notifyTime }
}

async function main() {
  console.log('Authenticating with Google Indexing API...')
  const token = await getAccessToken()
  console.log('Got access token.\n')

  // Build URL list: priority slugs first, then all remaining posts
  const allFiles = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.mdoc'))
    .map(f => f.replace('.mdoc', ''))

  const prioritySet = new Set(PRIORITY_SLUGS)
  const remaining = allFiles.filter(s => !prioritySet.has(s))

  // Full ordered list (homepage + sitemap + category + all slugs)
  const allUrls = [
    `${SITE}/`,
    `${SITE}/sitemap.xml`,
    `${SITE}/category/asscher-cut-diamond`,
    ...[...PRIORITY_SLUGS, ...remaining].map(s => `${SITE}/${s}`),
  ]

  const urls = allUrls.slice(OFFSET, OFFSET + MAX_URLS)
  console.log(`Batch: URLs ${OFFSET + 1}–${OFFSET + urls.length} of ${allUrls.length}\n`)

  console.log(`Submitting ${urls.length} URLs...\n`)

  let ok = 0
  let errors = 0
  const errorList = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const result = await submitUrl(token, url)
    if (result.status === 'OK') {
      ok++
      console.log(`[${i + 1}/${urls.length}] ✓ ${url}`)
    } else {
      errors++
      errorList.push(result)
      console.log(`[${i + 1}/${urls.length}] ✗ ${url} — ${result.error}`)
    }
    // Rate limit: 200 per day, no burst limit specified — small delay to be safe
    if ((i + 1) % 10 === 0) await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n--- Done ---`)
  console.log(`✓ Success: ${ok}`)
  console.log(`✗ Errors:  ${errors}`)
  if (errorList.length > 0) {
    console.log('\nFailed URLs:')
    errorList.forEach(e => console.log(`  ${e.url}: ${e.error}`))
  }
}

main().catch(console.error)
