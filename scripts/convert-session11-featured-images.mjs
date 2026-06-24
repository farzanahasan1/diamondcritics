import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/Round-Diamond-VVS1-vs-VVS2-Clarity.jpg`,
    output: `${DEST}/round-diamond-vvs1-vs-vvs2-featured.avif`,
    title: "Round Diamond VVS1 vs VVS2 Clarity Comparison",
    description: "Round diamond VVS1 versus VVS2 clarity grade comparison showing The VVS Divide — price premium and visual difference between the two highest sub-flawless clarity grades",
  },
  {
    input: `${SRC}/Round-Diamond-IF-and-FL-Clarity.jpg`,
    output: `${DEST}/round-diamond-if-fl-clarity-featured.avif`,
    title: "Round Diamond IF and FL Clarity Guide",
    description: "Round diamond Internally Flawless and Flawless clarity guide showing The FL Tax — the 107% price premium for clarity grades invisible to the naked eye",
  },
  {
    input: `${SRC}/Round-Diamond-Eye-Clean-Guide.jpg`,
    output: `${DEST}/round-diamond-eye-clean-guide-featured.avif`,
    title: "Round Diamond Eye-Clean Guide",
    description: "Round diamond eye-clean guide showing The Eye-Clean Audit — clarity grade eye-clean rates from FL 100% through SI1 70% at 1ct and 25% at 2ct with Blue Nile data",
  },
  {
    input: `${SRC}/Round-Diamond-Price-Per-Carat-Chart.jpg`,
    output: `${DEST}/round-diamond-price-per-carat-chart-featured.avif`,
    title: "Round Diamond Price Per Carat Chart",
    description: "Round diamond price per carat chart showing The Per-Carat Multiplier — G-VS2 GIA Excellent per-carat price from $3,230 at 1ct rising to $31,108 at 6ct, a 9.63x multiplier",
  },
  {
    input: `${SRC}/Round-Diamond-Resale-Value.jpg`,
    output: `${DEST}/round-diamond-resale-value-featured.avif`,
    title: "Round Diamond Resale Value Guide",
    description: "Round diamond resale value guide showing The 50-Cent Dollar — natural diamonds recover 40-50% of retail at resale while lab-grown diamonds recover only 10-20%",
  },
];

for (const job of jobs) {
  if (!fs.existsSync(job.input)) {
    console.log(`SKIP (missing): ${job.input}`);
    continue;
  }

  await sharp(job.input)
    .resize(1500, 1000, { fit: "inside", withoutEnlargement: true })
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
