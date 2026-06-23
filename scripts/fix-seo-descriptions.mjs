/**
 * Fix meta descriptions for posts:
 * 1. If post has seoDescription > 155 chars → truncate it
 * 2. If post has no seoDescription but description > 155 chars → add seoDescription (truncated)
 * Target: ≤ 155 chars (Google typically shows up to ~160; buffer for safety)
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");
const MAX = 155;

function truncate(text) {
  if (text.length <= MAX) return text;
  const cut = text.slice(0, MAX);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? text.slice(0, lastSpace) : cut) + "...";
}

const files = readdirSync(postsDir).filter(f => f.endsWith(".mdoc"));
let fixed = 0;
let added = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const raw = await readFile(filePath, "utf-8");

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];

  // Check existing seoDescription
  const seoDescMatch =
    fm.match(/^seoDescription:\s*"(.+?)"\s*$/m) ||
    fm.match(/^seoDescription:\s*'(.+?)'\s*$/m);

  if (seoDescMatch) {
    const current = seoDescMatch[1];
    if (current.length <= MAX) { skipped++; continue; }

    // Fix overlong seoDescription
    const shortened = truncate(current).replace(/"/g, '\\"');
    const newContent = raw.replace(
      /^(seoDescription:\s*["'])(.+?)(["']\s*)$/m,
      (match, pre, val, post) => `${pre}${shortened}${post}`
    );
    await writeFile(filePath, newContent, "utf-8");
    fixed++;
    console.log(`✎ fixed seoDesc (${current.length}→${shortened.length}): ${file}`);
    continue;
  }

  // No seoDescription — check if description is too long
  const descMatch =
    fm.match(/^description:\s*"(.+?)"\s*$/m) ||
    fm.match(/^description:\s*'(.+?)'\s*$/m);

  if (!descMatch) { skipped++; continue; }

  const desc = descMatch[1];
  if (desc.length <= MAX) { skipped++; continue; }

  // Add seoDescription after description: line
  const shortened = truncate(desc).replace(/"/g, '\\"');
  const newContent = raw.replace(
    /^(description:.+)$/m,
    (match, line) => `${line}\nseoDescription: "${shortened}"`
  );
  await writeFile(filePath, newContent, "utf-8");
  added++;
  console.log(`✓ added seoDesc (${desc.length}→${shortened.length}): ${file}`);
}

console.log(`\nDone. Added: ${added} | Fixed: ${fixed} | Already OK/skipped: ${skipped}`);
