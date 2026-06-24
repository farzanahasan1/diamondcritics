import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  { input: `${SRC}/Round-Diamond-Pavé-Engagement-Ring.jpg`, output: `${DEST}/round-diamond-pave-engagement-ring-featured.avif`, title: "Round Diamond Pavé Engagement Ring Guide — DiamondCritics", description: "Round diamond pavé engagement ring guide — The Pavé Upgrade Trap — DiamondCritics" },
  { input: `${SRC}/Round-Diamond-Vintage-Engagement-Ring.jpg`, output: `${DEST}/round-diamond-vintage-engagement-ring-featured.avif`, title: "Round Diamond Vintage Engagement Ring Guide — DiamondCritics", description: "Round diamond vintage engagement ring guide — The Vintage Setting Premium — DiamondCritics" },
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
console.log("Done — 2 featured images converted.");
