import sharp from "sharp";
import path from "path";
import fs from "fs";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const tmpDir = path.join(projectRoot, "tmp-images");
const outputDir = path.join(projectRoot, "public", "images");

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const featuredSource = "/Users/mehedihasan/Downloads/Pear-Cut-Diamond-Earring.jpg";

const lifestyleImages = [
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/804610/804610_W_1_1600X1600.jpg",
    out: "bn-pear-earrings-1.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/806856/806856_Y_1_1600X1600.jpg",
    out: "bn-pear-earrings-2.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/806922/806922_Y_1_1600X1600.jpg",
    out: "bn-pear-earrings-3.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/807047Y14L/807047Y14L_SKU_1_1600X1600.jpg",
    out: "bn-pear-earrings-4.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/807111W14L/807111W14L_SKU_2_1600X1600.jpg",
    out: "bn-pear-earrings-5.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/803170/803170_W_1_1600X1600.jpg",
    out: "bn-pear-earrings-6.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/DiamondBasics/807019/807019_PER_0300CT_Y_1_1600X1600.jpg",
    out: "bn-pear-earrings-7.avif",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

console.log("Converting featured image...");
await sharp(featuredSource)
  .resize(1500, 1000, { fit: "inside", withoutEnlargement: true })
  .avif({ quality: 82 })
  .toFile(path.join(outputDir, "pear-shaped-diamond-earrings-featured.avif"));
console.log("✓ pear-shaped-diamond-earrings-featured.avif");

for (const img of lifestyleImages) {
  const tmpPath = path.join(tmpDir, img.out.replace(".avif", ".jpg"));
  console.log(`Downloading ${img.out}...`);
  await download(img.url, tmpPath);
  await sharp(tmpPath)
    .resize(1200, 1200, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .avif({ quality: 82 })
    .toFile(path.join(outputDir, img.out));
  console.log(`✓ ${img.out}`);
}

console.log("\nAll earring images converted.");
