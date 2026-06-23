/**
 * Fix SEO titles for posts:
 * 1. Add seoTitle to posts missing it (≤55 chars)
 * 2. Fix existing seoTitles that are >60 chars
 * Rule: seoTitle + " | Diamond Critics" (18 chars) = full <title>
 * Target: seoTitle ≤ 55 chars so full title ≤ 73 chars
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");

const MAX = 55; // seoTitle max chars (55 + 18 = 73 total — within Google's rewrite threshold)

function shorten(title) {
  // Replace shortcode {{year}} with 2026 for length calculation, then restore
  const resolved = title.replace(/\{\{year\}\}/g, "2026");

  if (resolved.length <= MAX) return title; // Already fine, return original with shortcodes

  // Try to cut at common separators, longest meaningful fragment first
  const separators = [" — ", " – ", " | ", ": ", " ("];
  for (const sep of separators) {
    const idx = resolved.indexOf(sep);
    if (idx > 25 && idx <= MAX) {
      // Restore {{year}} if it was in the kept portion
      return title.slice(0, title.indexOf(sep));
    }
  }

  // Hard truncate at word boundary within MAX chars
  const cut = resolved.slice(0, MAX);
  const lastSpace = cut.lastIndexOf(" ");
  const truncated = lastSpace > 20 ? resolved.slice(0, lastSpace) : cut;

  // Restore original shortcodes: replace resolved year back
  return truncated.replace(/2026/g, "{{year}}");
}

const files = (await import("fs")).readdirSync(postsDir).filter(f => f.endsWith(".mdoc"));
let added = 0;
let fixed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const raw = await readFile(filePath, "utf-8");

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];

  // Check existing seoTitle
  const seoTitleMatch = fm.match(/^seoTitle:\s*["'](.+?)["']\s*$/m);
  if (seoTitleMatch) {
    const current = seoTitleMatch[1].replace(/\{\{year\}\}/g, "2026");
    if (current.length <= MAX) { skipped++; continue; } // Already fine

    // Fix overlong seoTitle
    const shortened = shorten(seoTitleMatch[1]);
    const newContent = raw.replace(
      /^(seoTitle:\s*["'])(.+?)(["']\s*)$/m,
      (match, pre, val, post) => `${pre}${shortened}${post}`
    );
    await writeFile(filePath, newContent, "utf-8");
    fixed++;
    console.log(`✎ fixed seoTitle (${current.length}→${shortened.replace(/\{\{year\}\}/g, "2026").length}): ${file}`);
    continue;
  }

  // No seoTitle — generate from title
  const titleMatch = fm.match(/^title:\s*["'](.+?)["']\s*$/m);
  if (!titleMatch) { console.log(`⚠ no title: ${file}`); continue; }

  const shortened = shorten(titleMatch[1]);

  // Insert seoTitle after title: line
  const newContent = raw.replace(
    /^(title:.+)$/m,
    (match, line) => `${line}\nseoTitle: "${shortened}"`
  );

  await writeFile(filePath, newContent, "utf-8");
  added++;
  console.log(`✓ added seoTitle: ${file} → "${shortened.replace(/\{\{year\}\}/g, "2026")}"`);
}

console.log(`\nDone. Added: ${added} | Fixed: ${fixed} | Already OK: ${skipped}`);
