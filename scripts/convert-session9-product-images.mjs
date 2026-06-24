import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  // Cathedral setting images
  { input: `${SRC}/bn-tapered-cathedral-solitaire-yellow-gold.jpg`, output: `${DEST}/bn-tapered-cathedral-solitaire-yellow-gold.avif`, title: "Tapered Cathedral Solitaire Engagement Ring in 14k Yellow Gold — Blue Nile", description: "Tapered Cathedral Solitaire engagement ring in 14k yellow gold, $1,240 setting price, Blue Nile" },
  { input: `${SRC}/bn-petite-cathedral-pave-platinum.jpg`, output: `${DEST}/bn-petite-cathedral-pave-platinum.avif`, title: "Petite Cathedral Pavé Diamond Engagement Ring in Platinum — Blue Nile", description: "Petite Cathedral Pavé diamond engagement ring in platinum, $2,010 setting price, Blue Nile" },
  { input: `${SRC}/bn-cathedral-pave-crown-yellow-gold.jpg`, output: `${DEST}/bn-cathedral-pave-crown-yellow-gold.avif`, title: "Cathedral Pavé Crown Diamond Engagement Ring in 14k Yellow Gold — Blue Nile", description: "Cathedral Pavé Crown diamond engagement ring in 14k yellow gold by James Allen, $1,800 setting price, Blue Nile" },
  { input: `${SRC}/bn-gallery-cathedral-pave-yellow-gold.jpg`, output: `${DEST}/bn-gallery-cathedral-pave-yellow-gold.avif`, title: "Gallery Collection Cathedral Pavé Diamond Engagement Ring in 14k Yellow Gold — Blue Nile", description: "Gallery Collection Cathedral Pavé diamond engagement ring in 14k yellow gold, $2,530 setting price, Blue Nile" },
  { input: `${SRC}/bn-zac-posen-cathedral-solitaire-white-gold.jpg`, output: `${DEST}/bn-zac-posen-cathedral-solitaire-white-gold.avif`, title: "Zac Zac Posen Cathedral Solitaire Plus Diamond Engagement Ring in 14k White Gold — Blue Nile", description: "Zac Zac Posen Cathedral Solitaire Plus diamond engagement ring in 14k white gold, $1,800 setting price, Blue Nile" },
  { input: `${SRC}/bn-imperial-micropave-platinum.jpg`, output: `${DEST}/bn-imperial-micropave-platinum.avif`, title: "Blue Nile Studio Imperial Micropavé Diamond Engagement Ring in Platinum — Blue Nile", description: "Blue Nile Studio Imperial Micropavé diamond engagement ring in platinum, $4,850 setting price, Blue Nile" },

  // Anniversary ring images
  { input: `${SRC}/bn-riviera-pave-white-gold-1-6ct.jpg`, output: `${DEST}/bn-riviera-pave-white-gold-1-6ct.avif`, title: "Riviera Pavé Diamond Ring in 14k White Gold 1/6 ct — Blue Nile", description: "Riviera Pavé diamond anniversary ring in 14k white gold, 1/6 ct tw, $980, Blue Nile" },
  { input: `${SRC}/bn-riviera-pave-platinum-1-4ct.jpg`, output: `${DEST}/bn-riviera-pave-platinum-1-4ct.avif`, title: "Riviera Pavé Diamond Ring in Platinum 1/4 ct — Blue Nile", description: "Riviera Pavé diamond anniversary ring in platinum, 1/4 ct tw, $1,420, Blue Nile" },
  { input: `${SRC}/bn-floating-diamond-yellow-gold.jpg`, output: `${DEST}/bn-floating-diamond-yellow-gold.avif`, title: "Floating Diamond Wedding Ring in 14k Yellow Gold 1/3 ct — Blue Nile", description: "Floating diamond wedding anniversary ring in 14k yellow gold, 1/3 ct tw, $825, Blue Nile" },
  { input: `${SRC}/bn-floating-lab-diamond-white-gold.jpg`, output: `${DEST}/bn-floating-lab-diamond-white-gold.avif`, title: "Floating Lab-Grown Diamond Wedding Ring in 14k White Gold 1/2 ct — Blue Nile", description: "Floating lab-grown diamond wedding ring in 14k white gold, 1/2 ct tw F-G VS2-SI1, $1,100, Blue Nile" },

  // Men's ring images
  { input: `${SRC}/bn-diagonal-pave-edge-platinum.jpg`, output: `${DEST}/bn-diagonal-pave-edge-platinum.avif`, title: "Diagonal Lined with Pavé Diamond Edge Men's Wedding Ring in Platinum — Blue Nile", description: "Diagonal Lined with Pavé Diamond Edge men's wedding ring in platinum, 1/8 ct tw, $1,526, Blue Nile" },
  { input: `${SRC}/bn-single-diamond-wedding-platinum.jpg`, output: `${DEST}/bn-single-diamond-wedding-platinum.avif`, title: "Single Diamond Wedding Ring in Platinum 6mm — Blue Nile", description: "Single Diamond men's wedding ring in platinum, 6mm, 0.07 ct tw, $2,677, Blue Nile" },
  { input: `${SRC}/bn-satin-finish-grey-tantalum.jpg`, output: `${DEST}/bn-satin-finish-grey-tantalum.avif`, title: "Satin Finish Diamond Wedding Ring in Grey Tantalum 7.5mm — Blue Nile", description: "Satin Finish Diamond men's wedding ring in grey tantalum, 7.5mm, 3/8 ct tw, $1,319, Blue Nile" },
  { input: `${SRC}/bn-milgrain-vertical-row-platinum.jpg`, output: `${DEST}/bn-milgrain-vertical-row-platinum.avif`, title: "Milgrain Vertical Row Diamond Eternity Ring in Platinum 7mm — Blue Nile", description: "Milgrain Vertical Row Diamond Eternity men's ring in platinum, 7mm, 3/8 ct tw, $3,590, Blue Nile" },
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
console.log("Done — 14 product images converted.");
