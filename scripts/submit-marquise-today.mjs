// Submit today's 4 new/updated marquise URLs to Bing IndexNow + Google Indexing API
import { GoogleAuth } from 'google-auth-library'

const HOST = 'diamondcritics.com'
const BASE = `https://${HOST}`
const BING_API_KEY = 'fa17f601ccff4ea1a88c549b35bdd5c3'
const INDEXNOW_KEY = '82f504b8c52848a3b4101f9c43a262c6'
const KEY_FILE = '/Users/mehedihasan/Projects/diamondcritics-8df8059f6989.json'

const SLUGS = [
  'marquise-engagement-ring-under-3000',
  'marquise-engagement-ring-under-5000',
  'how-to-buy-marquise-diamond',
  'category/marquise-cut-diamond',
]

const URLS = SLUGS.map((s) => `${BASE}/${s}`)

async function submitIndexNow() {
  console.log(`\n━━━ BING INDEXNOW (${URLS.length} URLs) ━━━`)
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: URLS,
      }),
    })
    console.log(`IndexNow status: ${res.status} ${res.statusText}`)
    if (res.ok || res.status === 202 || res.status === 200) {
      console.log(`✓ Bing IndexNow accepted ${URLS.length} URLs`)
    } else {
      const body = await res.text()
      console.warn(`⚠ Response: ${body.slice(0, 300)}`)
    }
  } catch (err) {
    console.error(`✗ IndexNow failed: ${err.message}`)
  }
}

async function submitGoogle() {
  console.log(`\n━━━ GOOGLE INDEXING API (${URLS.length} URLs) ━━━`)
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  const client = await auth.getClient()
  const { token } = await client.getAccessToken()

  let ok = 0, fail = 0
  for (const url of URLS) {
    try {
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
      })
      if (res.ok) {
        console.log(`  ✓ ${url}`)
        ok++
      } else {
        const body = await res.text()
        console.warn(`  ⚠ ${url} → ${res.status}: ${body.slice(0, 120)}`)
        fail++
      }
    } catch (err) {
      console.error(`  ✗ ${url} → ${err.message}`)
      fail++
    }
  }
  console.log(`\nGoogle: ${ok} OK / ${fail} failed`)
}

await submitIndexNow()
await submitGoogle()
