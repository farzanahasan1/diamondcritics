import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");

const targets = [
  "cushion-cut-diamond.mdoc",
  "if-and-fl-diamond-clarity.mdoc",
  "radiant-cut-diamond.mdoc",
  "oval-cut-diamond.mdoc",
  "princess-cut-diamond.mdoc",
  "si-clarity-diamond.mdoc",
];

let fixed = 0;

for (const file of targets) {
  const filePath = path.join(postsDir, file);
  const raw = await readFile(filePath, "utf-8");

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) { console.log(`⚠ no frontmatter: ${file}`); continue; }

  const fm = fmMatch[1];

  // Try seoDescription (single-line, double or single quoted)
  const seoMatch =
    fm.match(/^seoDescription:\s*"(.+?)"\s*$/m) ||
    fm.match(/^seoDescription:\s*'(.+?)'\s*$/m);

  if (!seoMatch) { console.log(`⚠ no seoDescription: ${file}`); continue; }

  const correctExcerpt = seoMatch[1].trim().replace(/"/g, '\\"');

  // Remove corrupted excerpt line
  let cleaned = raw.replace(/^excerpt:.*\n/m, "");

  // Re-insert after category: line
  let newContent;
  if (/^category:/m.test(cleaned)) {
    newContent = cleaned.replace(
      /^(category:.+)$/m,
      (match, group1) => `${group1}\nexcerpt: "${correctExcerpt}"`
    );
  } else {
    newContent = cleaned.replace(
      /^(publishedAt:.+)$/m,
      (match, group1) => `${group1}\nexcerpt: "${correctExcerpt}"`
    );
  }

  await writeFile(filePath, newContent, "utf-8");
  fixed++;
  console.log(`✓ fixed: ${file}`);
}

console.log(`\nDone. Fixed: ${fixed}`);
