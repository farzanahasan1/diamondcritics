// Generates JPEG copies of all featured images for og:image meta tags.
// AVIF works great for browsers but most OG scrapers (Facebook, Twitter, Pinterest, etc.)
// don't support it — so social shares show no image, hurting Google Images indexing.
// Output: /public/images/og/<original-name>.jpg
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import matter from "gray-matter";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsDir = path.join(root, "content/posts");
const imagesDir = path.join(root, "public/images");
const ogDir = path.join(imagesDir, "og");

if (!fs.existsSync(ogDir)) fs.mkdirSync(ogDir, { recursive: true });

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdoc"));

let converted = 0;
let skipped = 0;
let missing = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
  const { data } = matter(raw);
  const featuredImage = data.featuredImage;
  if (!featuredImage) continue;

  const avifPath = path.join(root, "public", featuredImage);
  const basename = path.basename(featuredImage, path.extname(featuredImage));
  const jpegPath = path.join(ogDir, `${basename}.jpg`);

  if (!fs.existsSync(avifPath)) {
    console.warn(`  ⚠ Missing source: ${featuredImage}`);
    missing++;
    continue;
  }

  if (fs.existsSync(jpegPath)) {
    skipped++;
    continue;
  }

  try {
    await sharp(avifPath)
      .resize(1200, 630, { fit: "cover", position: "center" })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpegPath);
    console.log(`  ✓ ${basename}.jpg`);
    converted++;
  } catch (err) {
    console.error(`  ✗ ${basename}: ${err.message}`);
    missing++;
  }
}

console.log(`\n✅ Done: ${converted} converted, ${skipped} already existed, ${missing} missing`);
