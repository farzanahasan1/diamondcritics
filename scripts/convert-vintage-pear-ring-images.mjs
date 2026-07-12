import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const tmpDir = path.join(projectRoot, "tmp-images");
const outputDir = path.join(projectRoot, "public", "images");

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const cdnImages = [
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501850/501850_M1_PER_DIM_wht_0100CT_Y_Box5_001_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505123/505123_M1_PER_DIM_wht_0100CT_Y_Box5_001_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504000/504000_M1_PER_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/500270/500270_M1_PER_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504980/504980_M1_PER_DIM_wht_0100CT_Y_Box6_004_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504740/504740_M1_PER_DIM_wht_0100CT_W_Box3_002_1600X1600.jpg",
];

const featuredSource = "/Users/mehedihasan/Downloads/Pear-Diamond-Vintage-Engagement-Ring.jpg";

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

console.log("Converting featured image...");
await sharp(featuredSource)
  .resize(1500, 1000, { fit: "inside", withoutEnlargement: true })
  .avif({ quality: 82 })
  .toFile(path.join(outputDir, "vintage-pear-shaped-diamond-ring-featured.avif"));
console.log("✓ vintage-pear-shaped-diamond-ring-featured.avif");

for (let i = 0; i < cdnImages.length; i++) {
  const n = i + 1;
  const tmpPath = path.join(tmpDir, `bn-vintage-pear-ring-${n}.jpg`);
  const outPath = path.join(outputDir, `bn-vintage-pear-ring-${n}.avif`);

  console.log(`Downloading ring ${n}...`);
  await downloadImage(cdnImages[i], tmpPath);

  await sharp(tmpPath)
    .resize(1200, 1200, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .avif({ quality: 82 })
    .toFile(outPath);

  console.log(`✓ bn-vintage-pear-ring-${n}.avif`);
}

console.log("\nAll 7 images converted.");
