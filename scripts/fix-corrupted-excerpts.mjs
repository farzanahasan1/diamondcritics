import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");

// Posts identified as having corrupted excerpt (contains 'category:' inside excerpt value)
const corrupted = [
  "1-5-carat-round-diamond-price.mdoc",
  "1-carat-diamond-engagement-ring.mdoc",
  "5-carat-round-diamond-price.mdoc",
  "6-carat-round-diamond-price.mdoc",
  "cushion-cut-diamond.mdoc",
  "if-and-fl-diamond-clarity.mdoc",
  "radiant-cut-diamond.mdoc",
  "round-diamond-1-carat-vs-2-carat.mdoc",
  "round-diamond-d-color-vs-g-color.mdoc",
  "oval-cut-diamond.mdoc",
  "princess-cut-diamond.mdoc",
  "round-diamond-2-carat-vs-3-carat.mdoc",
  "round-diamond-f-vs-g-color.mdoc",
  "round-diamond-gia-vs-igi.mdoc",
  "round-diamond-vvs-vs-vs2.mdoc",
  "round-diamond-under-10000.mdoc",
  "si-clarity-diamond.mdoc",
];

let fixed = 0;
let failed = 0;

for (const file of corrupted) {
  const filePath = path.join(postsDir, file);
  const raw = await readFile(filePath, "utf-8");

  // Parse frontmatter
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.log(`⚠ no frontmatter: ${file}`);
    failed++;
    continue;
  }

  const fm = fmMatch[1];

  // Get correct excerpt text from description: field
  const descMatch =
    fm.match(/^description:\s*"(.+?)"\s*$/m) ||
    fm.match(/^description:\s*'(.+?)'\s*$/m);

  if (!descMatch) {
    console.log(`⚠ no description field: ${file}`);
    failed++;
    continue;
  }

  const correctExcerpt = descMatch[1].trim().replace(/"/g, '\\"');

  // Remove the corrupted excerpt line entirely
  let cleaned = raw.replace(/^excerpt:.*\n/m, "");

  // Re-insert correct excerpt after category: line using function replacer (safe)
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

console.log(`\nDone. Fixed: ${fixed} | Failed: ${failed}`);
