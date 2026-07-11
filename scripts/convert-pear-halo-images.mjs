import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");

function download(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Featured image from local file
const featuredSrc = "/Users/mehedihasan/Downloads/Pear-Diamond-Halo-Engagement-Ring.jpg";
const featuredDest = path.join(outDir, "pear-diamond-halo-ring.avif");
if (!fs.existsSync(featuredDest)) {
  await sharp(featuredSrc).resize(1500, 1000, { fit: "inside" }).avif({ quality: 82 }).toFile(featuredDest);
  console.log(`✓ Featured: pear-diamond-halo-ring.avif (${Math.round(fs.statSync(featuredDest).size/1024)}KB)`);
} else { console.log("— Featured already exists"); }

// Inline images from CDN (all: contain + white bg)
const inline = [
  { url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/505028/505028_M1_PER_DIM_wht_0100CT_Y_Box3_003_1600X1600.jpg", name: "pear-diamond-halo-ring-yellow-gold.avif" },
  { url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505034/505034_M1_PER_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg", name: "pear-diamond-halo-ring-white-gold.avif" },
  { url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505109/505109_M1_PER_DIM_wht_0100CT_W_Box5_001_1600X1600.jpg", name: "pear-diamond-halo-ring-white-gold-2.avif" },
  { url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504230/504230_M1_PER_DIM_wht_0100CT_R_Box3_004_1600X1600.jpg", name: "pear-diamond-halo-ring-rose-gold.avif" },
  { url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/503890/503890_M1_PER_DIM_wht_0100CT_R_Box3_004_1600X1600.jpg", name: "pear-diamond-halo-ring-rose-gold-2.avif" },
  { url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505064/505064_M1_PER_DIM_wht_0100CT_R_Box5_001_1600X1600.jpg", name: "pear-diamond-halo-ring-rose-gold-3.avif" },
];

for (const img of inline) {
  const dest = path.join(outDir, img.name);
  if (fs.existsSync(dest)) { console.log(`— Already exists: ${img.name}`); continue; }
  console.log(`Downloading ${img.name}…`);
  try {
    const buf = await download(img.url);
    await sharp(buf).resize(1500, 1000, { fit: "contain", background: { r:255, g:255, b:255, alpha:1 } }).avif({ quality: 82 }).toFile(dest);
    console.log(`  ✓ ${img.name} (${Math.round(fs.statSync(dest).size/1024)}KB)`);
  } catch (e) { console.error(`  ✗ ${img.name}: ${e.message}`); }
}

console.log("\nDone.");
