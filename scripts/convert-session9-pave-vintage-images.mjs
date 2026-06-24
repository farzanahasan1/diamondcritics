import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  // Pavé engagement ring images
  { input: `${SRC}/bn-petite-micropave-eng-white-gold.jpg`, output: `${DEST}/bn-petite-micropave-eng-white-gold.avif`, title: "Petite Micropavé Diamond Engagement Ring in 14k White Gold — Blue Nile", description: "Petite Micropavé Diamond Engagement Ring in 14k White Gold, 1/10 ct. tw., $1,325 setting price, Blue Nile" },
  { input: `${SRC}/bn-french-pave-platinum-1-4ct-eng.jpg`, output: `${DEST}/bn-french-pave-platinum-1-4ct-eng.avif`, title: "French Pavé Diamond Engagement Ring in Platinum 1/4 ct. tw. — Blue Nile", description: "French Pavé Diamond Engagement Ring in Platinum, 1/4 ct. tw., $2,140 setting price, 474 reviews, Blue Nile" },
  { input: `${SRC}/bn-riviera-pave-eng-white-gold-1-6ct.jpg`, output: `${DEST}/bn-riviera-pave-eng-white-gold-1-6ct.avif`, title: "Riviera Pavé Diamond Engagement Ring in 14k White Gold 1/6 ct. tw. — Blue Nile", description: "Riviera Pavé Diamond Engagement Ring in 14k White Gold, 1/6 ct. tw., $1,405 setting price, 390 reviews, Blue Nile" },
  { input: `${SRC}/bn-scalloped-pave-platinum.jpg`, output: `${DEST}/bn-scalloped-pave-platinum.avif`, title: "Scalloped Pavé Diamond Engagement Ring in Platinum 3/8 ct. tw. — Blue Nile", description: "Scalloped Pavé Diamond Engagement Ring in Platinum, 3/8 ct. tw., $2,450 setting price, 165 reviews, Blue Nile" },
  { input: `${SRC}/bn-riviera-cathedral-pave-platinum.jpg`, output: `${DEST}/bn-riviera-cathedral-pave-platinum.avif`, title: "Riviera Cathedral Pavé Diamond Engagement Ring in Platinum 1/2 ct. tw. — Blue Nile", description: "Riviera Cathedral Pavé Diamond Engagement Ring in Platinum, 1/2 ct. tw., $2,890 setting price, 110 reviews, Blue Nile" },
  { input: `${SRC}/bn-french-pave-platinum-1ct-eng.jpg`, output: `${DEST}/bn-french-pave-platinum-1ct-eng.avif`, title: "French Pavé Diamond Engagement Ring in Platinum 1 ct. tw. — Blue Nile", description: "French Pavé Diamond Engagement Ring in Platinum, 1 ct. tw., $3,925 setting price, 41 reviews, Blue Nile" },

  // Vintage engagement ring images
  { input: `${SRC}/bn-milgrain-lace-pave-white-gold.jpg`, output: `${DEST}/bn-milgrain-lace-pave-white-gold.avif`, title: "Milgrain Lace Pavé Vintage-Style Engagement Ring in 14k White Gold by James Allen — Blue Nile", description: "Milgrain Lace Pavé Vintage-Style Engagement Ring in 14k White Gold by James Allen, $2,650 setting price, Blue Nile" },
  { input: `${SRC}/bn-milgrain-lace-pave-platinum.jpg`, output: `${DEST}/bn-milgrain-lace-pave-platinum.avif`, title: "Milgrain Lace Pavé Vintage-Style Engagement Ring in Platinum by James Allen — Blue Nile", description: "Milgrain Lace Pavé Vintage-Style Engagement Ring in Platinum by James Allen, $3,250 setting price, Blue Nile" },
  { input: `${SRC}/bn-art-deco-fleur-de-lis-rose-gold.jpg`, output: `${DEST}/bn-art-deco-fleur-de-lis-rose-gold.avif`, title: "Art Deco Inspired Fleur-De-Lis Pavé Vintage-Style Engagement Ring in 14k Rose Gold by James Allen — Blue Nile", description: "Art Deco Inspired Fleur-De-Lis Pavé Vintage-Style Engagement Ring in 14k Rose Gold by James Allen, $1,190 setting price, 101 reviews, Blue Nile" },
  { input: `${SRC}/bn-diamond-filigree-vintage-platinum.jpg`, output: `${DEST}/bn-diamond-filigree-vintage-platinum.avif`, title: "Diamond Filigree Vintage-Style Engagement Ring in Platinum by James Allen — Blue Nile", description: "Diamond Filigree Vintage-Style Engagement Ring in Platinum by James Allen, $2,275 setting price, 228 reviews, Blue Nile" },
  { input: `${SRC}/bn-hand-engraved-micropave-platinum.jpg`, output: `${DEST}/bn-hand-engraved-micropave-platinum.avif`, title: "Hand-Engraved Micropavé Diamond Engagement Ring in Platinum 1/6 ct. tw. — Blue Nile", description: "Hand-Engraved Micropavé Diamond Engagement Ring in Platinum, 1/6 ct. tw., $2,315 setting price, 86 reviews, Blue Nile" },
  { input: `${SRC}/bn-vintage-diamond-halo-yellow-gold.jpg`, output: `${DEST}/bn-vintage-diamond-halo-yellow-gold.avif`, title: "Vintage Diamond Halo Engagement Ring in 14k Yellow Gold 5/8 ct. tw. — Blue Nile", description: "Vintage Diamond Halo Engagement Ring in 14k Yellow Gold, 5/8 ct. tw., $3,940 setting price, Blue Nile" },
  { input: `${SRC}/bn-milgrain-pave-v-shank-yellow-gold.jpg`, output: `${DEST}/bn-milgrain-pave-v-shank-yellow-gold.avif`, title: "Milgrain and Pavé V-Shank Diamond Engagement Ring in 14k Yellow Gold 1/8 ct. wt. — Blue Nile", description: "Milgrain and Pavé V-Shank Diamond Engagement Ring in 14k Yellow Gold, 1/8 ct. wt., $1,790 setting price, 32 reviews, Blue Nile" },
];

for (const job of jobs) {
  if (!fs.existsSync(job.input)) {
    console.log(`SKIP (missing): ${job.input}`);
    continue;
  }

  await sharp(job.input)
    .resize(1500, 1000, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .avif({ quality: 82 })
    .toFile(job.output);

  await exiftool.write(
    job.output,
    {
      Title: job.title,
      Description: job.description,
      Creator: "DiamondCritics",
      Copyright: "© 2026 DiamondCritics",
    },
    ["-overwrite_original"]
  );

  console.log(`✓ ${path.basename(job.output)}`);
}

await exiftool.end();
console.log("Done — 13 product images converted.");
