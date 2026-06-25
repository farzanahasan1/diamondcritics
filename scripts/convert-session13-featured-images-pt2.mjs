import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/Round-Diamond-Engagement-Ring-Under-7000.png`,
    output: `${DEST}/round-diamond-engagement-ring-under-7000-featured.avif`,
    title: "Round Diamond Engagement Ring Under $7000 Guide",
    description: "Round diamond engagement ring under $7000 guide showing The $7K Crossover — at $7K you can get 1.25ct H-VS2 GIA Excellent for ~$5,910 all-in, 37% more face-up area than 1ct",
  },
  {
    input: `${SRC}/Round-Diamond-Platinum-vs-White-Gold.png`,
    output: `${DEST}/round-diamond-platinum-vs-white-gold-featured.avif`,
    title: "Round Diamond Platinum vs White Gold Guide",
    description: "Round diamond platinum vs white gold guide showing The Platinum Premium Myth — platinum costs $240–$964 more than 14K white gold for the same ring with no visible appearance difference",
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
