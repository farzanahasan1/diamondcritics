import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/0-5-Carat-Round-Diamond-Price.png`,
    output: `${DEST}/0-5-carat-round-diamond-price-featured.avif`,
    title: "0.5 Carat Round Diamond Price Guide",
    description: "0.5 carat round diamond price guide showing The Half-Carat Trap — a 0.49ct G-VS2 GIA Excellent costs ~$680 vs 0.50ct at ~$790, with zero visible size difference",
  },
  {
    input: `${SRC}/0-75-Carat-Round-Diamond-Price.png`,
    output: `${DEST}/0-75-carat-round-diamond-price-featured.avif`,
    title: "0.75 Carat Round Diamond Price Guide",
    description: "0.75 carat round diamond price guide showing The Three-Quarter Compromise — 0.75ct G-VS2 GIA Excellent at ~$1,690 delivers only 77% of 1ct face-up area at 52% of the price",
  },
  {
    input: `${SRC}/Round-Diamond-Under-2000.png`,
    output: `${DEST}/round-diamond-under-2000-featured.avif`,
    title: "Round Diamond Engagement Ring Under $2000 Guide",
    description: "Round diamond under $2000 guide showing The $2K Lab Leap — IGI 1.50ct D-VVS1 lab at $1,930 vs natural 0.70ct G-VS2 at ~$1,500, a 30% size increase for similar budget",
  },
  {
    input: `${SRC}/Round-Diamond-Under-1000.png`,
    output: `${DEST}/round-diamond-under-1000-featured.avif`,
    title: "Round Diamond Engagement Ring Under $1000 Guide",
    description: "Round diamond under $1000 guide showing The $1K Lab Gate — 1ct D-VVS1 IGI lab + $510 setting = ~$960 total vs 0.30ct natural at 4.3mm for the same budget",
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
