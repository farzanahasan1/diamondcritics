import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  // round-diamond-vvs1-vs-vvs2
  {
    input: `${SRC}/round-diamond-vvs1-vs-vvs2-price-gap.jpeg`,
    output: `${DEST}/round-diamond-vvs1-vs-vvs2-price-gap.avif`,
    title: "VVS1 vs VVS2 Round Diamond Price Gap Chart",
    description: "VVS1 vs VVS2 price comparison chart showing The VVS Divide — $4,720 minimum premium at 2ct G-color for a clarity difference invisible to the naked eye, with full Blue Nile price data on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-vvs1-vs-vvs2-clarity-comparison.jpeg`,
    output: `${DEST}/round-diamond-vvs1-vs-vvs2-clarity-comparison.avif`,
    title: "VVS1 vs VVS2 Round Diamond Clarity Comparison",
    description: "Round diamond VVS1 vs VVS2 inclusion type comparison showing typical inclusion positions under 10x magnification and 100% eye-clean rate for both grades on white editorial background",
  },

  // round-diamond-if-fl-clarity
  {
    input: `${SRC}/round-diamond-fl-if-clarity-tax.jpeg`,
    output: `${DEST}/round-diamond-fl-if-clarity-tax.avif`,
    title: "FL and IF Round Diamond Clarity Tax Chart",
    description: "FL and IF round diamond price premium comparison chart showing The FL Tax — $28,350 premium for 2ct D-FL over D-VS2, with full clarity spectrum from $26,490 to $54,840 on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-fl-vs-vvs1-price-comparison.jpeg`,
    output: `${DEST}/round-diamond-fl-vs-vvs1-price-comparison.avif`,
    title: "Round Diamond FL vs IF vs VVS1 Price Comparison",
    description: "FL vs IF vs VVS1 round diamond price comparison infographic showing 2ct D-color full clarity spectrum from $26,490 D-VS2 through $54,840 D-FL with D-IF at $44,650 only $170 above D-VVS1 on white editorial background",
  },

  // round-diamond-eye-clean-guide
  {
    input: `${SRC}/round-diamond-eye-clean-clarity-chart.jpeg`,
    output: `${DEST}/round-diamond-eye-clean-clarity-chart.avif`,
    title: "Round Diamond Eye-Clean Rate by Clarity Grade Chart",
    description: "Round diamond eye-clean clarity chart by grade showing eye-clean percentages from FL 100% through I1 less than 5%, with VS2 at 90% and SI1 at 70% at 1ct, featuring The Eye-Clean Audit on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-si1-eye-clean-percentage.jpeg`,
    output: `${DEST}/round-diamond-si1-eye-clean-percentage.avif`,
    title: "Round Diamond SI1 Eye-Clean Percentage vs Carat Weight",
    description: "Round diamond SI1 eye-clean percentage chart showing 70% pass rate at 1ct versus 25% at 2ct and 10% at 3ct, with SI1 savings comparison versus VS2 at each carat weight on white editorial background",
  },

  // round-diamond-price-per-carat-chart
  {
    input: `${SRC}/round-diamond-price-per-carat-chart.jpeg`,
    output: `${DEST}/round-diamond-price-per-carat-chart.avif`,
    title: "Round Diamond Price Per Carat Chart 1ct to 6ct",
    description: "Round diamond price per carat multiplier chart from 1ct at $3,230/ct through 6ct at $31,108/ct for G-VS2 GIA Excellent, showing The Per-Carat Multiplier reaching 9.63x by 6ct on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-per-carat-multiplier-comparison.jpeg`,
    output: `${DEST}/round-diamond-per-carat-multiplier-comparison.avif`,
    title: "Natural vs Lab Round Diamond Per-Carat Price Comparison",
    description: "Lab-grown vs natural round diamond per-carat rate comparison from 1.5ct to 4ct showing natural G-VS2 at $8,245/ct vs lab D-VVS1 at $1,405/ct at 2ct, with The Per-Carat Multiplier escape strategy on white editorial background",
  },

  // round-diamond-resale-value
  {
    input: `${SRC}/round-diamond-resale-value-chart.jpeg`,
    output: `${DEST}/round-diamond-resale-value-chart.avif`,
    title: "Round Diamond Resale Value Chart by Venue",
    description: "Round diamond resale value by venue comparison chart showing recovery percentages from private sale 50-70% through pawn shop 20-30%, featuring The 50-Cent Dollar concept with real Blue Nile prices on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-natural-vs-lab-resale-comparison.jpeg`,
    output: `${DEST}/round-diamond-natural-vs-lab-resale-comparison.avif`,
    title: "Natural vs Lab Diamond Resale Value Comparison",
    description: "Natural vs lab-grown round diamond resale comparison infographic showing 50-Cent Dollar 40-50% recovery for natural versus 10-Cent Dollar 10-20% for lab, with 2ct G-VS2 natural at $16,490 versus lab D-VVS1 at $2,810 on white editorial background",
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
