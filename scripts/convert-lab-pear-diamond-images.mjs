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
  const src = "/Users/mehedihasan/Downloads/Pear-Cut-Lab-Diamond.jpg";
  const dest = `${OUT_DIR}/lab-grown-pear-diamond-featured.avif`;
  await sharp(src)
    .resize(1500, 1000, { fit: "inside" })
    .avif({ quality: 72 })
    .toFile(dest);
  console.log("✓ featured →", dest);
}

const cdnImages = [
  // Add CDN lifestyle image URLs here once provided
  // {
  //   url: "https://ion.bluenile.com/...",
  //   out: "bn-lab-pear-1.avif",
  // },
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
