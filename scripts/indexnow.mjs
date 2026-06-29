// Submits all site URLs to Bing + IndexNow after every production build.
// Also pings Google's sitemap endpoint.
// Runs automatically via the "postbuild" npm script.
import { readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const BING_API_KEY    = "fa17f601ccff4ea1a88c549b35bdd5c3";
const INDEXNOW_KEY    = "b89c5aec023543896a6873dc1041da27";
const HOST            = "diamondcritics.com";
const BASE            = `https://${HOST}`;

// Only run on Vercel production builds — skip previews and local
const env = process.env.VERCEL_ENV;
if (env && env !== "production") {
  console.log(`Index submit: skipping (VERCEL_ENV=${env})`);
  process.exit(0);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function slugsFromDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(mdoc|mdx|md)$/.test(f))
    .map((f) => f.replace(/\.(mdoc|mdx|md)$/, ""));
}

const postSlugs = slugsFromDir(path.join(root, "content/posts"));
const pageSlugs = slugsFromDir(path.join(root, "content/pages"));

// ── Fetch community post URLs from Supabase ───────────────────────────────────
let communityPostUrls = [];
let communityPageUrls = [];
try {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );

  const { data: posts } = await supabase
    .from("posts")
    .select("id")
    .eq("is_deleted", false)
    .eq("is_draft", false)
    .order("created_at", { ascending: false })
    .limit(500);

  if (posts?.length) {
    communityPostUrls = posts.map(p => `${BASE}/community/post/${p.id}`);
    console.log(`✓ Fetched ${communityPostUrls.length} community post URLs from Supabase`);
  }

  const { data: communities } = await supabase
    .from("communities")
    .select("slug");
  if (communities?.length) {
    communityPageUrls = communities.map(c => `${BASE}/community/r/${c.slug}`);
  }
} catch (err) {
  console.warn("⚠ Could not fetch community URLs:", err.message);
}

const urlList = [
  `${BASE}/`,
  `${BASE}/about-farzana`,
  `${BASE}/diamond-price-calculator`,
  `${BASE}/diamond-resale-value-calculator`,
  `${BASE}/community`,
  `${BASE}/community/saved`,
  `${BASE}/category/diamond-buying-guides`,
  `${BASE}/category/diamond-retailer-reviews`,
  `${BASE}/category/gemstone-guides`,
  `${BASE}/category/market-value-price-trends`,
  `${BASE}/category/round-cut-diamond`,
  `${BASE}/category/princess-cut-diamond`,
  ...postSlugs.map((s) => `${BASE}/${s}`),
  ...pageSlugs.map((s) => `${BASE}/${s}`),
  ...communityPageUrls,
  ...communityPostUrls,
];

// IndexNow allows max 10,000 URLs per submission
const chunks = [];
for (let i = 0; i < urlList.length; i += 10000) chunks.push(urlList.slice(i, i + 10000));

// ── 1. Bing Webmaster API ─────────────────────────────────────────────────────
for (const chunk of chunks) {
  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ siteUrl: BASE, urlList: chunk }),
      }
    );
    if (res.ok) {
      console.log(`✓ Bing: ${chunk.length} URLs submitted (${res.status})`);
    } else {
      const body = await res.text();
      console.warn(`⚠ Bing submit failed: ${res.status} — ${body}`);
    }
  } catch (err) {
    console.warn("⚠ Bing submit failed (non-fatal):", err.message);
  }
}

// ── 2. IndexNow (notifies Bing, Yandex, and other IndexNow partners) ──────────
for (const chunk of chunks) {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: chunk,
      }),
    });
    if (res.ok || res.status === 202) {
      console.log(`✓ IndexNow: ${chunk.length} URLs submitted (${res.status})`);
    } else {
      const body = await res.text();
      console.warn(`⚠ IndexNow failed: ${res.status} — ${body}`);
    }
  } catch (err) {
    console.warn("⚠ IndexNow failed (non-fatal):", err.message);
  }
}

// ── 3. Ping Google sitemap ────────────────────────────────────────────────────
try {
  const sitemapUrl = encodeURIComponent(`${BASE}/sitemap.xml`);
  const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
  console.log(`✓ Google sitemap ping: ${res.status}`);
} catch (err) {
  console.warn("⚠ Google ping failed (non-fatal):", err.message);
}

console.log(`\n✅ Index submission complete: ${urlList.length} total URLs`);
