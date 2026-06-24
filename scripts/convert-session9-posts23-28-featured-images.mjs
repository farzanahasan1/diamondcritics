import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  { input: `${SRC}/Round-Diamond-Cathedral-Setting.jpg`, output: `${DEST}/round-diamond-cathedral-setting-featured.avif`, title: "Round Diamond Cathedral Setting: Snag Risk Guide — DiamondCritics", description: "Round diamond cathedral setting guide — The Cathedral Snag Risk — DiamondCritics" },
  { input: `${SRC}/Round-Diamond-Anniversary-Ring.jpg`, output: `${DEST}/round-diamond-anniversary-ring-featured.avif`, title: "Round Diamond Anniversary Ring Guide — DiamondCritics", description: "Round diamond anniversary ring guide — The Anniversary Upgrade Stack — DiamondCritics" },
  { input: `${SRC}/Round-Diamond-Men's-Ring-Guide.jpg`, output: `${DEST}/round-diamond-mens-ring-featured.avif`, title: "Round Diamond Men's Ring Guide — DiamondCritics", description: "Round diamond men's ring guide — The Men's Diamond Standard — DiamondCritics" },
  { input: `${SRC}/Round-Diamond-Right-Hand-Ring.jpg`, output: `${DEST}/round-diamond-right-hand-ring-featured.avif`, title: "Round Diamond Right Hand Ring Guide — DiamondCritics", description: "Round diamond right hand ring guide — The RHR Rule — DiamondCritics" },
  { input: `${SRC}/What-Is-a-Round-Brilliant-Cut-Diamond.jpg`, output: `${DEST}/what-is-round-brilliant-cut-diamond-featured.avif`, title: "What Is a Round Brilliant Cut Diamond — DiamondCritics", description: "What is a round brilliant cut diamond — The 57-Facet System — DiamondCritics" },
  { input: `${SRC}/Round-Diamond-Certification-Guide.jpg`, output: `${DEST}/round-diamond-certification-guide-featured.avif`, title: "Round Diamond Certification Guide — DiamondCritics", description: "Round diamond certification guide — The Certificate Inflation Scale — DiamondCritics" },
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
console.log("Done — 6 featured images converted.");
