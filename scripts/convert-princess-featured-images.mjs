import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/1 Carat Princess Guide.png`,
    output: `${DEST}/1-carat-princess-cut-diamond-price-featured.avif`,
    title: "1 Carat Princess Cut Diamond Price Guide 2026",
    description: "1ct princess cut diamond from $2,141 on Blue Nile — 31% less than round. The 20% Price Advantage, Corner Clarity Trap, and all 57 GIA listings audited by Farzana Hasan.",
  },
  {
    input: `${SRC}/2ct diamond price guide 2026.png`,
    output: `${DEST}/2-carat-princess-cut-diamond-price-featured.avif`,
    title: "2 Carat Princess Cut Diamond Price Guide 2026",
    description: "2ct princess cut diamond from $12,229 on Blue Nile — 26% less than round. The 2ct Price Stack, VS1 mandatory rule, and all 11 GIA listings audited by Farzana Hasan.",
  },
  {
    input: `${SRC}/half carat princess price guide.png`,
    output: `${DEST}/0-5-carat-princess-cut-diamond-price-featured.avif`,
    title: "0.5 Carat Princess Cut Diamond Price Guide 2026",
    description: "0.5ct princess cut diamond costs $700–$850 on Blue Nile. The Half-Carat Trap — 0.49ct G-VS1 saves $150 for a 0.03mm size difference nobody can see.",
  },
  {
    input: `${SRC}/point 75 Carat Princess Cut Diamond Price .png`,
    output: `${DEST}/0-75-carat-princess-cut-diamond-price-featured.avif`,
    title: "0.75 Carat Princess Cut Diamond Price Guide 2026",
    description: "0.75ct princess cut diamond costs $1,300–$1,750 on Blue Nile. The Three-Quarter Sweet Spot — 90% of 1ct face-up area at 63% of the price.",
  },
  {
    input: `${SRC}/1.5 Carat Princess Cut Diamond Price.png`,
    output: `${DEST}/1-5-carat-princess-cut-diamond-price-featured.avif`,
    title: "1.5 Carat Princess Cut Diamond Price Guide 2026",
    description: "1.5ct princess cut diamond costs $5,500–$7,500 on Blue Nile — 25% less than round. VS1 mandatory, G minimum. The Per-Carat Jump analysis by Farzana Hasan.",
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
