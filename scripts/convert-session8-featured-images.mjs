import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "public/images";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/Round-Diamond-4-Prong-vs-6-Prong-Setting.jpg`,
    output: `${DEST}/round-diamond-4-prong-vs-6-prong-featured.avif`,
    title: "4-Prong vs 6-Prong Round Diamond Setting Guide",
    description: "4-prong versus 6-prong round diamond solitaire setting comparison showing coverage, security, and The Prong Math concept for choosing the right setting at every carat weight",
  },
  {
    input: `${SRC}/Round-Diamond-vs-Old-European-Cut.jpg`,
    output: `${DEST}/round-diamond-vs-old-european-cut-featured.avif`,
    title: "Round Brilliant vs Old European Cut Diamond Comparison",
    description: "Modern round brilliant versus Old European Cut diamond comparison showing sparkle profile, pricing, and The Vintage Sparkle Trade concept for buyers choosing between eras",
  },
  {
    input: `${SRC}/Are-Round-Diamonds-a-Good-Investment.jpg`,
    output: `${DEST}/round-diamond-investment-value-featured.avif`,
    title: "Are Round Diamonds a Good Investment? The Investment Illusion",
    description: "Round diamond investment value analysis showing 40–60 percent resale loss for natural and 80–90 percent for lab diamonds with The Investment Illusion concept and real Blue Nile price data",
  },
  {
    input: `${SRC}/0.9-Carat-vs-1-Carat-Round-Diamond.jpg`,
    output: `${DEST}/round-diamond-0-9-carat-vs-1-carat-featured.avif`,
    title: "0.9 Carat vs 1 Carat Round Diamond: The 0.9ct Hack",
    description: "0.9 carat versus 1 carat round diamond comparison showing $743 savings, 6.2mm versus 6.4mm face-up diameter, and The 0.9ct Hack strategy for buying below the magic weight price cliff",
  },
  {
    input: `${SRC}/How-to-Compare-Round-Diamonds-Online.jpg`,
    output: `${DEST}/round-diamond-how-to-compare-online-featured.avif`,
    title: "How to Compare Round Diamonds Online: 5-Step Protocol",
    description: "Five-step Online Comparison Protocol for round diamonds covering GIA filter, proportion parameters, 360-degree video, per-carat price math, and 30-day return policy verification",
  },
  {
    input: `${SRC}/9-Carat-Round-Diamond-Price.jpg`,
    output: `${DEST}/round-diamond-9-carat-price-featured.avif`,
    title: "9 Carat Round Diamond Price Guide: The Nine-Figure Tier",
    description: "9 carat round diamond price guide showing $329,500 entry price, 13.9–14.2mm face-up diameter, 11x per-carat rarity multiplier over 1ct, and The Nine-Figure Tier concept with lab alternative pricing",
  },
];

for (const job of jobs) {
  if (!fs.existsSync(job.input)) {
    console.log(`SKIP (missing): ${job.input}`);
    continue;
  }

  await sharp(job.input)
    .resize(1200, 800, {
      fit: "inside",
      withoutEnlargement: true,
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
console.log("Done.");
