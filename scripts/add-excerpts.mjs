import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");

const files = (await readdir(postsDir)).filter((f) => f.endsWith(".mdoc"));
let added = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const raw = await readFile(filePath, "utf-8");

  // Skip if already has excerpt
  if (/^excerpt:/m.test(raw)) {
    skipped++;
    continue;
  }

  // Parse frontmatter block
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];

  // Try to extract excerpt text from existing fields
  let excerptText = null;

  // 1. Try description: field (single line)
  const descMatch = fm.match(/^description:\s*"(.+?)"\s*$/m) || fm.match(/^description:\s*'(.+?)'\s*$/m);
  if (descMatch) {
    excerptText = descMatch[1].trim();
  }

  // 2. Try seoDescription:
  if (!excerptText) {
    const seoMatch = fm.match(/^seoDescription:\s*"(.+?)"\s*$/m) || fm.match(/^seoDescription:\s*'(.+?)'\s*$/m);
    if (seoMatch) {
      excerptText = seoMatch[1].trim();
    }
  }

  // 3. Fall back to first non-empty, non-heading, non-bullet paragraph in body
  if (!excerptText) {
    const body = raw.slice(fmMatch[0].length);
    const lines = body.split("\n");
    let paragraph = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed &&
        !trimmed.startsWith("#") &&
        !trimmed.startsWith("!") &&
        !trimmed.startsWith("-") &&
        !trimmed.startsWith("|") &&
        !trimmed.startsWith(">") &&
        !trimmed.startsWith("*") &&
        trimmed.length > 40
      ) {
        paragraph = trimmed.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // strip links
        break;
      }
    }
    if (paragraph) {
      // Truncate to ~200 chars at a word boundary
      excerptText = paragraph.length > 200
        ? paragraph.slice(0, 200).replace(/\s\S+$/, "") + "..."
        : paragraph;
    }
  }

  if (!excerptText) {
    console.log(`⚠ no excerpt source found: ${file}`);
    continue;
  }

  // Escape double quotes inside the excerpt
  const safeExcerpt = excerptText.replace(/"/g, '\\"');

  // Insert excerpt after category: line (or after publishedAt: if no category)
  let newContent;
  if (/^category:/m.test(raw)) {
    newContent = raw.replace(
      /^(category:.+)$/m,
      (match, group1) => `${group1}\nexcerpt: "${safeExcerpt}"`
    );
  } else {
    newContent = raw.replace(
      /^(publishedAt:.+)$/m,
      (match, group1) => `${group1}\nexcerpt: "${safeExcerpt}"`
    );
  }

  await writeFile(filePath, newContent, "utf-8");
  added++;
  console.log(`✓ ${file}`);
}

console.log(`\nDone. Added excerpts: ${added} | Already had: ${skipped}`);
