import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/Round-Diamond-E-vs-F-Color.jpg`,
    output: `${DEST}/round-diamond-e-vs-f-color-featured.avif`,
    title: "Round Diamond E vs F Color Guide",
    description: "Round diamond E vs F color guide showing The Near-Colorless Ceiling — $50 gap at 1ct, price-overlap at 2ct, and when E color is and is not worth the premium",
  },
  {
    input: `${SRC}/Round-Diamond-H-vs-I-Color.jpg`,
    output: `${DEST}/round-diamond-h-vs-i-color-featured.avif`,
    title: "Round Diamond H vs I Color Guide",
    description: "Round diamond H vs I color guide showing The I-Color Boundary — maximum Near-Colorless savings at the last safe stop before visible warmth in white metal settings",
  },
  {
    input: `${SRC}/Round-Diamond-D-Color-Guide.jpg`,
    output: `${DEST}/round-diamond-d-color-guide-featured.avif`,
    title: "Round Diamond D Color Grade Guide",
    description: "Round diamond D color grade guide showing The True Colorless Test — D vs G premium at 1ct and 2ct and the five conditions required to distinguish D color from G",
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
