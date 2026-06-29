import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  // round-diamond-4-prong-vs-6-prong
  {
    input: `${SRC}/round-diamond-4-prong-vs-6-prong-comparison.jpeg`,
    output: `${DEST}/round-diamond-4-prong-vs-6-prong-comparison.avif`,
    title: "4-Prong vs 6-Prong Round Diamond Setting Comparison",
    description: "4-prong versus 6-prong round diamond solitaire comparison showing 70% vs 65% face-up exposure, chip protection tradeoff, and The Prong Math concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-prong-setting-guide.jpeg`,
    output: `${DEST}/round-diamond-prong-setting-guide.avif`,
    title: "Round Diamond Prong Setting Guide: Metal and Count by Stone Size",
    description: "Round diamond prong setting guide showing metal choice by diamond color grade and prong count recommendation by carat weight from 1ct at $3,230 to 3ct at $48,780 on white editorial background",
  },

  // round-diamond-vs-old-european-cut
  {
    input: `${SRC}/round-diamond-vs-old-european-cut-sparkle.jpeg`,
    output: `${DEST}/round-diamond-vs-old-european-cut-sparkle.avif`,
    title: "Round Brilliant vs Old European Cut: Sparkle Profile Comparison",
    description: "Modern round brilliant versus Old European Cut sparkle profile comparison showing facet structure, brilliance and fire differences, and The Vintage Sparkle Trade concept on white editorial background",
  },
  {
    input: `${SRC}/old-european-cut-vs-modern-round-price-chart.jpeg`,
    output: `${DEST}/old-european-cut-vs-modern-round-price-chart.avif`,
    title: "Old European Cut vs Modern Round Diamond: Price and Market Guide",
    description: "Old European Cut versus modern round diamond price and market comparison showing GIA grading differences, estate versus online purchase channels, and $3,230 modern versus $4,500–$5,500 OEC estate pricing on white editorial background",
  },

  // round-diamond-investment-value
  {
    input: `${SRC}/round-diamond-resale-value-depreciation.jpeg`,
    output: `${DEST}/round-diamond-resale-value-depreciation.avif`,
    title: "Round Diamond Resale Value Depreciation Curve",
    description: "Round diamond resale value depreciation showing natural diamond 40–60% loss and lab diamond 80–90% loss from retail purchase price with The Investment Illusion concept on white editorial background",
  },
  {
    input: `${SRC}/diamond-investment-vs-alternatives-chart.jpeg`,
    output: `${DEST}/diamond-investment-vs-alternatives-chart.avif`,
    title: "Diamond vs Real Investments: 10-Year Return Comparison",
    description: "Diamond versus real investment alternatives 10-year return comparison showing S&P 500 at 12 percent per year, gold at 8–10 percent, and natural diamond at negative 5–10 percent effective annual return on white editorial background",
  },

  // round-diamond-0-9-carat-vs-1-carat
  {
    input: `${SRC}/0-9-carat-vs-1-carat-round-diamond-size.jpeg`,
    output: `${DEST}/0-9-carat-vs-1-carat-round-diamond-size.avif`,
    title: "0.9 Carat vs 1 Carat Round Diamond Size and Price Comparison",
    description: "0.90 carat versus 1 carat round diamond face-up size comparison showing 6.2mm versus 6.4mm diameter and $2,487 versus $3,230 price with $743 savings and The 0.9ct Hack concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-sub-carat-price-savings.jpeg`,
    output: `${DEST}/round-diamond-sub-carat-price-savings.avif`,
    title: "Round Diamond Magic Weight Price Cliff at 1 Carat",
    description: "Round diamond magic weight price cliff chart showing per-carat cost jump from $2,763 per carat at 0.90ct to $3,230 per carat at 1.00ct with optimal 0.90–0.94ct target range on white editorial background",
  },

  // round-diamond-how-to-compare-online
  {
    input: `${SRC}/round-diamond-online-comparison-steps.jpeg`,
    output: `${DEST}/round-diamond-online-comparison-steps.avif`,
    title: "How to Compare Round Diamonds Online: 5-Step Protocol",
    description: "Five-step Online Comparison Protocol for round diamonds showing GIA filter, proportion parameters, 360-degree video check, per-carat price math, and 30-day return policy verification on white editorial background",
  },
  {
    input: `${SRC}/blue-nile-diamond-filter-guide.jpeg`,
    output: `${DEST}/blue-nile-diamond-filter-guide.avif`,
    title: "Blue Nile Diamond Filter Settings for GIA Excellent Round Diamonds",
    description: "Blue Nile diamond advanced filter settings showing table 54–57 percent, depth 59–62.3 percent, crown angle 34–35 degrees, pavilion angle 40.6–41.0 degrees to find top 5 percent of GIA Excellent round diamonds on white editorial background",
  },

  // round-diamond-9-carat-price
  {
    input: `${SRC}/9-carat-round-diamond-price-rarity.jpeg`,
    output: `${DEST}/9-carat-round-diamond-price-rarity.avif`,
    title: "9 Carat Round Diamond Price and Rarity Guide",
    description: "9 carat round diamond price and rarity showing 13.9–14.2mm face-up diameter, $329,500 entry price, only 7 stones in stock globally, and The Nine-Figure Tier concept versus 1ct baseline at $3,230 on white editorial background",
  },
  {
    input: `${SRC}/ultra-rare-round-diamond-per-carat-chart.jpeg`,
    output: `${DEST}/ultra-rare-round-diamond-per-carat-chart.avif`,
    title: "Round Diamond Per-Carat Price Curve from 1ct to 9ct",
    description: "Round diamond per-carat price exponential curve from 1ct at $3,230 per carat through 2ct at $8,245 per carat, 3ct at $16,260 per carat, to 9ct at $36,000–$80,000 per carat showing rarity compounding on white editorial background",
  },
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
console.log("Done.");
