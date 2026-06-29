import { NextRequest, NextResponse } from 'next/server'

const HOST         = 'diamondcritics.com'
const BASE         = `https://${HOST}`
const INDEXNOW_KEY = 'b89c5aec023543896a6873dc1041da27'
const BING_API_KEY = 'fa17f601ccff4ea1a88c549b35bdd5c3'

// Called from createPost action after a new post is published.
// Notifies Bing, IndexNow (covers Yahoo/DuckDuckGo/Yandex), and pings Google sitemap.
export async function POST(req: NextRequest) {
  const { postId } = await req.json().catch(() => ({}))
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const postUrl = `${BASE}/community/post/${postId}`
  const urlList = [postUrl, `${BASE}/community`, `${BASE}/sitemap.xml`]

  const results: string[] = []

  // 1. IndexNow — covers Bing, Yahoo (Bing-powered), DuckDuckGo (Bing-powered), Yandex
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: [postUrl],
      }),
    })
    results.push(`IndexNow: ${r.status}`)
  } catch (e) {
    results.push(`IndexNow error: ${e instanceof Error ? e.message : String(e)}`)
  }

  // 2. Bing Webmaster API (direct, faster than IndexNow alone)
  try {
    const r = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ siteUrl: BASE, urlList: [postUrl] }),
      }
    )
    results.push(`Bing: ${r.status}`)
  } catch (e) {
    results.push(`Bing error: ${e instanceof Error ? e.message : String(e)}`)
  }

  // 3. Google sitemap ping (best way to signal Google without Indexing API)
  try {
    const r = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${BASE}/sitemap.xml`)}`
    )
    results.push(`Google sitemap ping: ${r.status}`)
  } catch (e) {
    results.push(`Google ping error: ${e instanceof Error ? e.message : String(e)}`)
  }

  return NextResponse.json({ postUrl, results })
}
