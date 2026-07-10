// Submits only NEW URLs to Bing + IndexNow after every production build.
// Detects new content by comparing current commit to previous deployment commit.
// Also pings Google's sitemap endpoint.
// Runs automatically via the "postbuild" npm script.
import { readdirSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const BING_API_KEY = "fa17f601ccff4ea1a88c549b35bdd5c3";
const INDEXNOW_KEY = "82f504b8c52848a3b4101f9c43a262c6";
const HOST         = "diamondcritics.com";
const BASE         = `https://${HOST}`;

// Skip preview/development deployments only — always run on production (both git push and CLI deploys)
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

// ── Detect only new content files via git diff ────────────────────────────────
const prevSha = process.env.VERCEL_GIT_PREVIOUS_SHA;
const currSha = process.env.VERCEL_GIT_COMMIT_SHA || "HEAD";

let newPostSlugs = [];
let newPageSlugs = [];
let isFirstDeploy = false;

if (prevSha) {
  try {
    const diffOutput = execSync(
      `git diff --name-only --diff-filter=A ${prevSha} ${currSha} -- content/posts/ content/pages/`,
      { encoding: "utf8", cwd: root }
    ).trim();

    if (diffOutput) {
      const newFiles = diffOutput.split("\n").filter(Boolean);
      newPostSlugs = newFiles
        .filter((f) => f.startsWith("content/posts/"))
        .map((f) => path.basename(f).replace(/\.(mdoc|mdx|md)$/, ""));
      newPageSlugs = newFiles
        .filter((f) => f.startsWith("content/pages/"))
        .map((f) => path.basename(f).replace(/\.(mdoc|mdx|md)$/, ""));
    }

    console.log(`✓ Git diff vs ${prevSha.slice(0, 7)}: ${newPostSlugs.length} new post(s), ${newPageSlugs.length} new page(s)`);
  } catch (err) {
    console.warn("⚠ Git diff failed, falling back to all posts:", err.message);
    newPostSlugs = slugsFromDir(path.join(root, "content/posts"));
    newPageSlugs = slugsFromDir(path.join(root, "content/pages"));
  }
} else {
  // No previous SHA = CLI deploy or first deployment — submit all current URLs
  isFirstDeploy = true;
  console.log("✓ No previous deployment SHA — submitting all current URLs");
  newPostSlugs = slugsFromDir(path.join(root, "content/posts"));
  newPageSlugs = slugsFromDir(path.join(root, "content/pages"));
}

if (!isFirstDeploy && newPostSlugs.length === 0 && newPageSlugs.length === 0) {
  console.log("✓ No new content files — skipping URL submission");
  // Still ping Google sitemap
  try {
    const sitemapUrl = encodeURIComponent(`${BASE}/sitemap.xml`);
    const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
    console.log(`✓ Google sitemap ping: ${res.status}`);
  } catch (err) {
    console.warn("⚠ Google ping failed (non-fatal):", err.message);
  }
  process.exit(0);
}

// ── Build URL list (new content only) ────────────────────────────────────────
const urlList = [
  ...newPostSlugs.map((s) => `${BASE}/${s}`),
  ...newPageSlugs.map((s) => `${BASE}/${s}`),
];

console.log(`\nSubmitting ${urlList.length} new URL(s):`);
urlList.forEach((u) => console.log(`  ${u}`));

// ── 1. Bing Webmaster API ─────────────────────────────────────────────────────
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
    console.log(`\n✓ Bing: ${urlList.length} URL(s) submitted (${res.status})`);
  } else {
    const body = await res.text();
    console.warn(`⚠ Bing submit failed: ${res.status} — ${body}`);
  }
} catch (err) {
  console.warn("⚠ Bing submit failed (non-fatal):", err.message);
}

// ── 2. IndexNow ───────────────────────────────────────────────────────────────
try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });
  if (res.ok || res.status === 202) {
    console.log(`✓ IndexNow: ${urlList.length} URL(s) submitted (${res.status})`);
  } else {
    const body = await res.text();
    console.warn(`⚠ IndexNow failed: ${res.status} — ${body}`);
  }
} catch (err) {
  console.warn("⚠ IndexNow failed (non-fatal):", err.message);
}

// ── 3. Ping Google sitemap ────────────────────────────────────────────────────
try {
  const sitemapUrl = encodeURIComponent(`${BASE}/sitemap.xml`);
  const res = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
  console.log(`✓ Google sitemap ping: ${res.status}`);
} catch (err) {
  console.warn("⚠ Google ping failed (non-fatal):", err.message);
}

console.log(`\n✅ Done: ${urlList.length} URL(s) submitted to Bing + IndexNow`);
