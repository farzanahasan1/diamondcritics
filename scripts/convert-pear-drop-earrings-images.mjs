import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import https from "https";
import http from "http";
import os from "os";

const OUT = "public/images";

const cdnImages = [
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/806996/806996_W_1_1600X1600.jpg",
    out: "bn-pear-drop-earrings-1.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/807063Y14L/807063Y14L_SKU_1_1600X1600.jpg",
    out: "bn-pear-drop-earrings-2.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyle/FineJewelry/807176/807176_W_2_1600X1600.jpg",
    out: "bn-pear-drop-earrings-3.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/806936/806936_W_1_1600X1600.jpg",
    out: "bn-pear-drop-earrings-4.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/805810/805810_W_1_1600X1600.jpg",
    out: "bn-pear-drop-earrings-5.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/806939/806939_W_2_1600X1600.jpg",
    out: "bn-pear-drop-earrings-6.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/806940/806940_W_2_1600X1600.jpg",
    out: "bn-pear-drop-earrings-7.avif",
  },
  {
    url: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/LifeStyleV4/FineJewelry/804610/804610_W_1_1600X1600.jpg",
    out: "bn-pear-drop-earrings-8.avif",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = require("fs").createWriteStream(dest);
    const mod = url.startsWith("https") ? https : http;
    mod
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        require("fs").unlink(dest, () => {});
        reject(err);
      });
  });
}

async function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          downloadBuffer(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  // Featured image — 1500×1000 fit: inside
  const featuredSrc =
    "/Users/mehedihasan/Downloads/Pear-Cut-Diamond-Stud-Earring-featue-image.jpg";
  const featuredDest = join(OUT, "pear-diamond-drop-earrings-featured.avif");
  console.log("Converting featured image...");
  const fi = await sharp(featuredSrc)
    .resize(1500, 1000, { fit: "inside", withoutEnlargement: true })
    .avif({ quality: 82 })
    .toFile(featuredDest);
  console.log(`  featured → ${Math.round(fi.size / 1024)}KB`);

  // CDN lifestyle images — 1200×1200 fit: contain white bg
  for (const img of cdnImages) {
    console.log(`Downloading ${img.out}...`);
    const buf = await downloadBuffer(img.url);
    const dest = join(OUT, img.out);
    const info = await sharp(buf)
      .resize(1200, 1200, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .avif({ quality: 82 })
      .toFile(dest);
    console.log(`  ${img.out} → ${Math.round(info.size / 1024)}KB`);
  }

  console.log("All done.");
}

main().catch(console.error);
