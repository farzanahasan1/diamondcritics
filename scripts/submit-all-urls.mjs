// One-shot: submit every post URL to Bing/IndexNow + Google Indexing API + Google sitemap ping.
import { readdirSync } from "fs";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const BING_API_KEY   = "fa17f601ccff4ea1a88c549b35bdd5c3";
const INDEXNOW_KEY   = "82f504b8c52848a3b4101f9c43a262c6";
const HOST           = "diamondcritics.com";
const BASE           = `https://${HOST}`;
const GSC_KEY_FILE   = "/Users/mehedihasan/Projects/diamondcritics-8df8059f6989.json";
const BATCH_SIZE     = 100; // IndexNow max per request

// ── Build URL list ─────────────────────────────────────────────────────────────
const slugs = readdirSync(path.join(root, "content/posts"))
  .filter((f) => /\.(mdoc|mdx|md)$/.test(f))
  .map((f) => f.replace(/\.(mdoc|mdx|md)$/, ""));

const urlList = slugs.map((s) => `${BASE}/${s}`);
console.log(`\nTotal URLs: ${urlList.length}\n`);

// ── 1. Bing Webmaster API ──────────────────────────────────────────────────────
console.log("── Bing Webmaster API ──");
try {
  const res = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ siteUrl: BASE, urlList }),
    }
  );
  const body = await res.text();
  if (res.ok) {
    console.log(`✓ Bing: ${urlList.length} URLs submitted (${res.status})`);
  } else {
    console.warn(`⚠ Bing: ${res.status} — ${body}`);
  }
} catch (err) {
  console.warn("⚠ Bing failed:", err.message);
}

// ── 2. IndexNow (batched) ─────────────────────────────────────────────────────
console.log("\n── IndexNow ──");
for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
  const batch = urlList.slice(i, i + BATCH_SIZE);
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });
    const status = res.status;
    if (res.ok || status === 202) {
      console.log(`✓ IndexNow batch ${i / BATCH_SIZE + 1}: ${batch.length} URLs (${status})`);
    } else {
      const body = await res.text();
      console.warn(`⚠ IndexNow batch ${i / BATCH_SIZE + 1}: ${status} — ${body}`);
    }
  } catch (err) {
    console.warn(`⚠ IndexNow batch ${i / BATCH_SIZE + 1} failed:`, err.message);
  }
}

// ── 3. Google Indexing API ────────────────────────────────────────────────────
console.log("\n── Google Indexing API ──");
const auth = new google.auth.GoogleAuth({
  keyFile: GSC_KEY_FILE,
  scopes: ["https://www.googleapis.com/auth/indexing"],
});
const client = await auth.getClient();
const accessToken = await client.getAccessToken();

let gSuccess = 0;
let gFailed = 0;

for (const url of urlList) {
  try {
    const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`✓ ${url}`);
      gSuccess++;
    } else {
      console.error(`✗ ${url} — ${data.error?.message || JSON.stringify(data)}`);
      gFailed++;
    }
  } catch (err) {
    console.error(`✗ ${url} — ${err.message}`);
    gFailed++;
  }
}
console.log(`\nGoogle Indexing API: ${gSuccess} submitted, ${gFailed} failed.`);

// ── 4. Ping Google sitemap ────────────────────────────────────────────────────
console.log("\n── Google sitemap ping ──");
try {
  const sitemapUrl = encodeURIComponent(`${BASE}/sitemap.xml`);
  const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
  console.log(`✓ Google sitemap ping: ${res.status}`);
} catch (err) {
  console.warn("⚠ Google ping failed:", err.message);
}

console.log(`\n✅ Done: ${urlList.length} URLs submitted.`);
