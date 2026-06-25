import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/Round-Diamond-Yellow-Gold-Engagement-Ring.png`,
    output: `${DEST}/round-diamond-yellow-gold-engagement-ring-featured.avif`,
    title: "Round Diamond Yellow Gold Engagement Ring Guide",
    description: "Round diamond yellow gold engagement ring guide showing The Yellow Gold Color Hack — I color saves $830 vs G-VS2 in yellow gold with no visible difference, 20 Blue Nile settings from $860",
  },
  {
    input: `${SRC}/Round-Diamond-Rose-Gold-Engagement-Ring.png`,
    output: `${DEST}/round-diamond-rose-gold-engagement-ring-featured.avif`,
    title: "Round Diamond Rose Gold Engagement Ring Guide",
    description: "Round diamond rose gold engagement ring guide showing The Rose Gold Color Trap — buyers overpay $830 for color rose gold already hides, 20 Blue Nile settings from $730",
  },
  {
    input: `${SRC}/Round-Diamond-Bezel-Setting.png`,
    output: `${DEST}/round-diamond-bezel-setting-featured.avif`,
    title: "Round Diamond Bezel Setting Engagement Ring Guide",
    description: "Round diamond bezel setting engagement ring guide showing The Bezel Sparkle Tax — $480–$800 premium over prong solitaire plus 8–12% less light return, 20 Blue Nile bezel settings from $990",
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
