// Submits all site URLs to Bing IndexNow after every production build.
// Runs automatically via the "postbuild" npm script.
import { readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const KEY  = "b89c5aec023543896a6873dc1041da27";
const HOST = "diamondcritics.com";
const BASE = `https://${HOST}`;

// Only run on Vercel production builds — skip previews and local
const env = process.env.VERCEL_ENV;
if (env && env !== "production") {
  console.log(`IndexNow: skipping (VERCEL_ENV=${env})`);
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

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: `${BASE}/${KEY}.txt`,
  urlList,
};

try {
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  // 200 = processed, 202 = queued — both are success
  if (res.status === 200 || res.status === 202) {
    console.log(`✓ IndexNow: ${urlList.length} URLs queued for Bing (${res.status})`);
  } else {
    console.warn(`⚠ IndexNow: unexpected status ${res.status}`);
  }
} catch (err) {
  // Never fail the build over IndexNow
  console.warn("⚠ IndexNow submission failed (non-fatal):", err.message);
}
