// Submits all site URLs to Bing after every production build via Webmaster API.
// Runs automatically via the "postbuild" npm script.
import { readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const BING_API_KEY = "fa17f601ccff4ea1a88c549b35bdd5c3";
const HOST = "diamondcritics.com";
const BASE = `https://${HOST}`;

// Only run on Vercel production builds — skip previews and local
const env = process.env.VERCEL_ENV;
if (env && env !== "production") {
  console.log(`Bing submit: skipping (VERCEL_ENV=${env})`);
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

const urlList = [
  `${BASE}/`,
  `${BASE}/about-farzana`,
  `${BASE}/diamond-price-calculator`,
  `${BASE}/diamond-resale-value-calculator`,
  `${BASE}/category/diamond-buying-guides`,
  `${BASE}/category/diamond-retailer-reviews`,
  `${BASE}/category/gemstone-guides`,
  `${BASE}/category/market-value-price-trends`,
  ...postSlugs.map((s) => `${BASE}/${s}`),
  ...pageSlugs.map((s) => `${BASE}/${s}`),
];

try {
  const res = await fetch(
    `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${BING_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ siteUrl: BASE, urlList }),
    }
  );
  if (res.ok) {
    console.log(`✓ Bing: ${urlList.length} URLs submitted (${res.status})`);
  } else {
    const body = await res.text();
    console.warn(`⚠ Bing submit failed: ${res.status} — ${body}`);
  }
} catch (err) {
  // Never fail the build over URL submission
  console.warn("⚠ Bing submit failed (non-fatal):", err.message);
}
