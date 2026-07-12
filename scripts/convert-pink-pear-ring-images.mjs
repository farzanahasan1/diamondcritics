import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const tmpDir = path.join(projectRoot, "tmp-images");
const outputDir = path.join(projectRoot, "public", "images");

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const featuredSource = "/Users/mehedihasan/Downloads/Pink-Diamond-Pear-Cut-Engagement-Ring.jpg";

console.log("Converting featured image...");
await sharp(featuredSource)
  .resize(1500, 1000, { fit: "inside", withoutEnlargement: true })
  .avif({ quality: 82 })
  .toFile(path.join(outputDir, "pink-pear-diamond-ring-featured.avif"));
console.log("✓ pink-pear-diamond-ring-featured.avif");
console.log("\nDone. Provide 6 CDN ring image URLs to complete the pipeline.");
