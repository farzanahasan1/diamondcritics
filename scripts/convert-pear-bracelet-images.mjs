import sharp from "sharp";
import { createWriteStream } from "fs";
import { get as httpsGet } from "https";

const OUT_DIR = "public/images";

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    httpsGet(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const ws = createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    }).on("error", reject);
  });
}

async function convertFeatured() {
  const src = "/Users/mehedihasan/Downloads/Pear-Cut-Diamond-Bracelets.jpg";
  const dest = `${OUT_DIR}/pear-diamond-bracelet-featured.avif`;
  await sharp(src)
    .resize(1500, 1000, { fit: "inside" })
    .avif({ quality: 72 })
    .toFile(dest);
  console.log("✓ featured →", dest);
}

const cdnImages = [
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/753599/753599_Y_1_1600X1600.jpg",
    out: "bn-pear-bracelet-1.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/753000/753000_W_1_1600X1600.jpg",
    out: "bn-pear-bracelet-2.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/752577/752577_W_2_1600X1600.jpg",
    out: "bn-pear-bracelet-3.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/753702/753702_Y_2_1600X1600.jpg",
    out: "bn-pear-bracelet-4.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/DiamondBasics/753694/753694_PER_0800CT_W_1_1600X1600.jpg",
    out: "bn-pear-bracelet-5.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/753884Y14L/753884Y14L_SKU_2_1600X1600.jpg",
    out: "bn-pear-bracelet-6.avif",
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
  console.log("✓", item.out);
}

async function main() {
  await convertFeatured();
  for (const item of cdnImages) {
    await convertCdn(item);
  }
  console.log("\nAll done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
