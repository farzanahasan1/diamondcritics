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
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/DiamondBasics/857138/857138_PER_1000CT_Y_1_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/DiamondBasics/857136/857136_PER_0100CT_W_1_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/857100/857100_Y_1_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/857029/857029_W_1_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/857028/857028_W_1_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/857167Y14/857167Y14_SKU_2_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/857230W14L/857230W14L_SKU_1_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/855780/855780_W_2_1600X1600.jpg",
];

const featuredSource = "/Users/mehedihasan/Downloads/Pear-Cut-Diamond-Necklace.jpg";

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
  .toFile(path.join(outputDir, "pear-diamond-necklace-featured.avif"));
console.log("✓ pear-diamond-necklace-featured.avif");

for (let i = 0; i < cdnImages.length; i++) {
  const n = i + 1;
  const tmpPath = path.join(tmpDir, `bn-pear-necklace-${n}.jpg`);
  const outPath = path.join(outputDir, `bn-pear-necklace-${n}.avif`);
  console.log(`Downloading necklace image ${n}...`);
  await downloadImage(cdnImages[i], tmpPath);
  await sharp(tmpPath)
    .resize(1200, 1200, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .avif({ quality: 82 })
    .toFile(outPath);
  console.log(`✓ bn-pear-necklace-${n}.avif`);
}

console.log("\nAll 9 images converted.");
