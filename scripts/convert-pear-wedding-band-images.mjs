import sharp from "sharp";
import { createWriteStream, existsSync } from "fs";
import { pipeline } from "stream/promises";
import { get as httpGet } from "http";
import { get as httpsGet } from "https";
import path from "path";

const OUT_DIR = "public/images";

async function downloadFile(url, dest) {
  const get = url.startsWith("https") ? httpsGet : httpGet;
  await new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const ws = createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    }).on("error", reject);
  });
}

// Featured image — local file
async function convertFeatured() {
  const src = "/Users/mehedihasan/Downloads/Pear-Cut-Diamond-Wedding-Rings.jpg";
  const dest = `${OUT_DIR}/pear-diamond-wedding-band-featured.avif`;
  await sharp(src)
    .resize(1500, 1000, { fit: "inside" })
    .avif({ quality: 72 })
    .toFile(dest);
  console.log("✓ featured →", dest);
}

// CDN lifestyle images — 1200×1200 contain white bg
const cdnImages = [
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/605990/605990_R_2_1600X1600.jpg",
    out: "bn-pear-wedding-band-1.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/605050/605050_W_2_1600X1600.jpg",
    out: "bn-pear-wedding-band-2.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/Orbitvu/FineJewelry/604670/604670_W_1_1600X1600.jpg",
    out: "bn-pear-wedding-band-3.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/604550/604550_R_2_1600X1600.jpg",
    out: "bn-pear-wedding-band-4.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/604000/604000_Y_2_1600X1600.jpg",
    out: "bn-pear-wedding-band-5.avif",
  },
];

async function convertCdn(item) {
  const tmpFile = `/tmp/${item.out}.jpg`;
  await downloadFile(item.url, tmpFile);
  const dest = `${OUT_DIR}/${item.out}`;
  await sharp(tmpFile)
    .resize(1200, 1200, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .avif({ quality: 72 })
    .toFile(dest);
  console.log("✓", item.out, "→", dest);
}

async function main() {
  await convertFeatured();
  for (const item of cdnImages) {
    await convertCdn(item);
  }
  console.log("\nAll images converted.");
}

main().catch((err) => { console.error(err); process.exit(1); });
