import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images");

const images = [
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504961/504961_M1_PER_DIM_wht_0100CT_Y_Box8_001_1600X1600.jpg",
    featuredName: "pear-diamond-bezel-ring.avif",
    inlineName: "pear-diamond-bezel-ring-yellow-gold.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505115/505115_M1_PER_DIM_wht_0100CT_R_Box5_003_1600X1600.jpg",
    featuredName: null,
    inlineName: "pear-diamond-bezel-ring-rose-gold.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/505115/505115_M1_PER_DIM_wht_0100CT_Y_Box3_002_1600X1600.jpg",
    featuredName: null,
    inlineName: "pear-diamond-bezel-ring-lifestyle.avif",
  },
];

function download(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

for (const img of images) {
  console.log(`Downloading ${img.url.split("/").pop()}…`);
  const buf = await download(img.url);

  // Featured image (inside fit, no padding) — only for the first image
  if (img.featuredName) {
    const featuredPath = path.join(outDir, img.featuredName);
    if (!fs.existsSync(featuredPath)) {
      await sharp(buf)
        .resize(1500, 1000, { fit: "inside" })
        .avif({ quality: 82 })
        .toFile(featuredPath);
      const kb = Math.round(fs.statSync(featuredPath).size / 1024);
      console.log(`  ✓ Featured: ${img.featuredName} (${kb}KB)`);
    } else {
      console.log(`  — Featured already exists: ${img.featuredName}`);
    }
  }

  // Inline image (contain + white background)
  const inlinePath = path.join(outDir, img.inlineName);
  if (!fs.existsSync(inlinePath)) {
    await sharp(buf)
      .resize(1500, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .avif({ quality: 82 })
      .toFile(inlinePath);
    const kb = Math.round(fs.statSync(inlinePath).size / 1024);
    console.log(`  ✓ Inline: ${img.inlineName} (${kb}KB)`);
  } else {
    console.log(`  — Inline already exists: ${img.inlineName}`);
  }
}

console.log("\nDone.");
