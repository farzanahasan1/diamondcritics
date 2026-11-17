// One-off: submit the 15 marquise cluster URLs to Bing (IndexNow) + Google (Indexing API)
import { GoogleAuth } from 'google-auth-library'

const HOST = 'diamondcritics.com'
const BASE = `https://${HOST}`
const BING_API_KEY = 'fa17f601ccff4ea1a88c549b35bdd5c3'
const INDEXNOW_KEY = '82f504b8c52848a3b4101f9c43a262c6'
const KEY_FILE = '/Users/mehedihasan/Projects/diamondcritics-8df8059f6989.json'

const SLUGS = [
  // Session 36 marquise foundation (5)
  'marquise-cut-diamond-ideal-proportions',
  'marquise-diamond-bow-tie',
  'marquise-diamond-clarity-guide',
  'marquise-diamond-color-guide',
  'marquise-diamond-length-to-width-ratio',
  // Today commit d4dcd23 (5)
  'marquise-cut-diamond-size-chart',
  '0-5-carat-marquise-diamond-price',
  '0-75-carat-marquise-diamond-price',
  '1-carat-marquise-diamond-price',
  '1-25-carat-marquise-diamond-price',
  // Today commit 2dae263 (5)
  '1-5-carat-marquise-diamond-price',
  '1-75-carat-marquise-diamond-price',
  '2-carat-marquise-diamond-price',
  '2-5-carat-marquise-diamond-price',
  '3-carat-marquise-diamond-price',
]

const URLS = SLUGS.map((s) => `${BASE}/${s}`)

async function submitBingIndexNow() {
  console.log(`\n━━━ BING INDEXNOW SUBMISSION (${URLS.length} URLs) ━━━`)
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
      console.warn(`⚠ IndexNow non-OK response body: ${body.slice(0, 200)}`)
    }
  } catch (err) {
    console.error(`✗ IndexNow failed: ${err.message}`)
  }
}

async function submitBingAPI() {
  console.log(`\n━━━ BING WEBMASTER API SUBMISSION ━━━`)
  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl: BASE, urlList: URLS }),
      }
    )
    console.log(`Bing Webmaster status: ${res.status} ${res.statusText}`)
    const data = await res.text()
    console.log(`Response: ${data.slice(0, 300)}`)
  } catch (err) {
    console.error(`✗ Bing Webmaster API failed: ${err.message}`)
  }
}

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  const client = await auth.getClient()
  const token = await client.getAccessToken()
  return token.token
}

async function submitGoogleIndexing() {
  console.log(`\n━━━ GOOGLE INDEXING API SUBMISSION (${URLS.length} URLs) ━━━`)
  let token
  try {
    token = await getAccessToken()
  } catch (err) {
    console.error(`✗ Google auth failed: ${err.message}`)
    return
  }

  let ok = 0
  let fail = 0
  const quotaErrors = []

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
      const data = await res.json()
      if (res.ok) {
        ok++
        console.log(`  ✓ ${url}`)
      } else {
        fail++
        const msg = data.error?.message || JSON.stringify(data)
        console.warn(`  ✗ ${url} — ${msg}`)
        if (msg.toLowerCase().includes('quota')) quotaErrors.push(url)
      }
    } catch (err) {
      fail++
      console.warn(`  ✗ ${url} — ${err.message}`)
    }
    await new Promise((r) => setTimeout(r, 150))
  }

  console.log(`\nGoogle Indexing API: ${ok} succeeded, ${fail} failed`)
  if (quotaErrors.length) {
    console.log(`⚠ ${quotaErrors.length} URLs hit quota — retry tomorrow:`)
    quotaErrors.forEach((u) => console.log(`  - ${u}`))
  }
}

async function pingGoogleSitemap() {
  console.log(`\n━━━ GOOGLE SITEMAP PING ━━━`)
  try {
    const sitemapUrl = encodeURIComponent(`${BASE}/sitemap.xml`)
    const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`)
    console.log(`Google sitemap ping: ${res.status}`)
  } catch (err) {
    console.warn(`Google ping failed (non-fatal): ${err.message}`)
  }
}

async function main() {
  console.log(`Submitting ${URLS.length} marquise URLs to Bing + Google...`)
  URLS.forEach((u) => console.log(`  • ${u}`))

  await submitBingIndexNow()
  await submitBingAPI()
  await submitGoogleIndexing()
  await pingGoogleSitemap()

  console.log(`\n✓ All submissions complete.`)
}

main().catch((err) => {
  console.error('FATAL:', err)
  process.exit(1)
})
