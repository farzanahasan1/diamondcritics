import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/round-diamond-video-inspection-guide-featured.jpeg`,
    output: `${DEST}/round-diamond-video-inspection-guide-featured.avif`,
    title: "Round Diamond Video Inspection Guide Featured Image",
    description: "Round diamond video inspection guide featuring photorealistic round brilliant diamond on pearlescent silver background with The Video Mandate editorial headline",
  },
  {
    input: `${SRC}/how-to-read-gia-diamond-report-featured.jpeg`,
    output: `${DEST}/how-to-read-gia-diamond-report-featured.avif`,
    title: "How to Read a GIA Diamond Report Featured Image",
    description: "How to read a GIA diamond report featuring photorealistic round brilliant diamond on pearlescent silver background with The Report Literacy Test editorial headline",
  },
  {
    input: `${SRC}/round-diamond-buying-checklist-featured.jpeg`,
    output: `${DEST}/round-diamond-buying-checklist-featured.avif`,
    title: "Round Diamond Buying Checklist Featured Image",
    description: "Round diamond buying checklist featuring photorealistic round brilliant diamond on pearlescent silver background with The 12-Point Diamond Audit editorial headline",
  },
  {
    input: `${SRC}/round-diamond-fluorescence-guide-featured.jpeg`,
    output: `${DEST}/round-diamond-fluorescence-guide-featured.avif`,
    title: "Round Diamond Fluorescence Guide Featured Image",
    description: "Round diamond fluorescence guide featuring photorealistic round brilliant diamond with soft blue fluorescence glow on pearlescent silver background with The Fluorescence Discount editorial headline",
  },
  {
    input: `${SRC}/round-diamond-inclusions-types-featured.jpeg`,
    output: `${DEST}/round-diamond-inclusions-types-featured.avif`,
    title: "Round Diamond Inclusion Types Featured Image",
    description: "Round diamond inclusion types guide featuring photorealistic round brilliant diamond on pearlescent silver background with The Inclusion Hierarchy editorial headline",
  },
  {
    input: `${SRC}/round-diamond-face-up-size-guide-featured.jpeg`,
    output: `${DEST}/round-diamond-face-up-size-guide-featured.avif`,
    title: "Round Diamond Face-Up Size Guide Featured Image",
    description: "Round diamond face-up size guide featuring photorealistic round brilliant diamond viewed face-up on pearlescent silver background with The MM Reality Chart editorial headline",
  },
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
