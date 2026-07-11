import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const publicImages = path.join(projectRoot, "public", "images");
const tmpImages = path.join(projectRoot, "tmp-images");

if (!fs.existsSync(tmpImages)) fs.mkdirSync(tmpImages, { recursive: true });

const cdnImages = [
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/501860/501860_M1_PER_DIM_wht_0100CT_W_Box6_003_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/501250/501250_M1_PER_DIM_wht_0100CT_W_Box6_004_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504998/504998_M1_PER_DIM_wht_0100CT_W_Box3_001_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504200/504200_M1_PER_DIM_wht_0100CT_W_Box3_002_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/502400/502400_M1_PER_DIM_wht_0100CT_W_Box3_002_1600X1600.jpg",
  "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/503070/503070_M1_PER_DIM_wht_0100CT_W_Box6_002_1600X1600.jpg",
];

console.log("Downloading ring images from Blue Nile CDN...");
for (let i = 0; i < cdnImages.length; i++) {
  const dest = path.join(tmpImages, `bn-wg-pear-ring-${i + 1}.jpg`);
  if (fs.existsSync(dest)) {
    console.log(`  ↩ bn-wg-pear-ring-${i + 1}.jpg already exists, skipping download`);
    continue;
  }
  try {
    const res = await fetch(cdnImages[i]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  ↓ bn-wg-pear-ring-${i + 1}.jpg`);
  } catch (err) {
    console.error(`  ✗ bn-wg-pear-ring-${i + 1}.jpg download failed: ${err.message}`);
  }
}

const featured = {
  src: "/Users/mehedihasan/Downloads/Pear-Diamond-White-Gold-Engagement-Ring.jpg",
  dest: path.join(publicImages, "white-gold-pear-diamond-ring-featured.avif"),
  width: 1500,
  height: 1000,
  fit: "inside",
};

const ringImages = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: path.join(tmpImages, `bn-wg-pear-ring-${n}.jpg`),
  dest: path.join(publicImages, `bn-wg-pear-ring-${n}.avif`),
  width: 1200,
  height: 1200,
  fit: "contain",
}));

const allImages = [featured, ...ringImages];

console.log("\nConverting to AVIF...");
for (const img of allImages) {
  try {
    const opts =
      img.fit === "contain"
        ? { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }
        : { fit: "inside", withoutEnlargement: true };

    await sharp(img.src)
      .resize(img.width, img.height, opts)
      .avif({ quality: 82 })
      .toFile(img.dest);

    console.log(`✓ ${path.basename(img.dest)}`);
  } catch (err) {
    console.error(`✗ ${path.basename(img.dest)}: ${err.message}`);
  }
}

console.log("Done.");
