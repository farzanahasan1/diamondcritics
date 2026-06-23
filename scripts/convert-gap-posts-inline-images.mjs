import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/round-diamond-natural-vs-lab-1.jpeg`,
    output: `${DEST}/round-diamond-natural-vs-lab-1.avif`,
    title: "Natural vs Lab-Grown Round Diamond: Origin Tax Price Comparison",
    description: "Side-by-side price comparison of natural and lab-grown round diamonds showing the Origin Tax at each carat weight.",
  },
  {
    input: `${SRC}/round-diamond-natural-vs-lab-2.jpeg`,
    output: `${DEST}/round-diamond-natural-vs-lab-2.avif`,
    title: "When to Buy Natural vs Lab Round Diamond: Decision Framework",
    description: "Decision framework for choosing between natural and lab-grown round diamonds based on budget, carat, and long-term goals.",
  },
  {
    input: `${SRC}/round-diamond-g-vs-h-color-1.jpeg`,
    output: `${DEST}/round-diamond-g-vs-h-color-1.avif`,
    title: "G vs H Color Round Diamond: Price Gap by Carat Weight",
    description: "Price gap between G and H color round diamonds at 1ct, 1.5ct, and 2ct — showing where savings justify the step down.",
  },
  {
    input: `${SRC}/round-diamond-g-vs-h-color-2.jpeg`,
    output: `${DEST}/round-diamond-g-vs-h-color-2.avif`,
    title: "G vs H Color Round Diamond: Metal Setting Compatibility Chart",
    description: "Chart showing when G or H color round diamonds perform best across yellow gold, white gold, and platinum settings.",
  },
  {
    input: `${SRC}/round-diamond-si2-clarity-1.jpeg`,
    output: `${DEST}/round-diamond-si2-clarity-1.avif`,
    title: "Round Diamond SI2 Clarity: Eye-Clean Rate by Carat Weight",
    description: "Eye-clean probability for SI2 round diamonds at 1ct, 1.5ct, and 2ct — showing why the SI2 Gamble fails above 1ct.",
  },
  {
    input: `${SRC}/round-diamond-si2-clarity-2.jpeg`,
    output: `${DEST}/round-diamond-si2-clarity-2.avif`,
    title: "SI2 vs VS2 Round Diamond: Inclusion Type Risk Guide",
    description: "Comparison of SI2 inclusion types — crystals, clouds, feathers — and their impact on eye visibility in round diamonds.",
  },
  {
    input: `${SRC}/round-diamond-three-stone-ring-1.jpeg`,
    output: `${DEST}/round-diamond-three-stone-ring-1.avif`,
    title: "Round Diamond Three-Stone Ring: Flanker Ratio Guide",
    description: "Flanker size ratios for round diamond three-stone rings — 40–50% of center diameter for balanced proportions.",
  },
  {
    input: `${SRC}/round-diamond-three-stone-ring-2.jpeg`,
    output: `${DEST}/round-diamond-three-stone-ring-2.avif`,
    title: "Round Diamond Three-Stone Ring: Budget Breakdown by Tier",
    description: "Three-stone ring budget breakdown from $5,500 to $25,000 — center stone, flankers, and setting cost allocation.",
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
