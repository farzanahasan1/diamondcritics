import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/1-carat-princess-phantom-carat-effect.jpeg`,
    output: `${DEST}/1-carat-princess-phantom-carat-effect.avif`,
    title: "1ct Princess vs Round: The Phantom Carat Effect",
    description: "Face-up size comparison: 1ct princess 5.5×5.5mm vs 1ct round 6.5mm. The Phantom Carat Effect — 9% less face-up area, $1,018 less in price.",
  },
  {
    input: `${SRC}/1-carat-princess-corner-clarity-trap.jpeg`,
    output: `${DEST}/1-carat-princess-corner-clarity-trap.avif`,
    title: "1ct Princess Cut: The Corner Clarity Trap",
    description: "Princess cut clarity comparison: VS2 corner inclusion risk vs VS1 corner-safe. The Corner Clarity Trap — $324 upgrade from G-VS2 to G-VS1 eliminates all corner risk.",
  },
  {
    input: `${SRC}/2-carat-princess-price-stack.jpeg`,
    output: `${DEST}/2-carat-princess-price-stack.avif`,
    title: "2ct Princess Cut: The 2ct Price Stack",
    description: "2ct princess cut price breakdown by grade. G-VS2 from $12,229 to F-VVS1 at $21,710 — all GIA listings audited, savings vs round shown at every grade.",
  },
  {
    input: `${SRC}/2-carat-princess-vs-round-face-up.jpeg`,
    output: `${DEST}/2-carat-princess-vs-round-face-up.avif`,
    title: "2ct Princess vs Round: Face-Up Size and Savings",
    description: "2ct princess 7.0mm vs 2ct round 8.1mm face-up comparison. Princess saves $4,261 (26%) for 7% less face-up area at 2ct.",
  },
  {
    input: `${SRC}/0-5-carat-princess-half-carat-trap.jpeg`,
    output: `${DEST}/0-5-carat-princess-half-carat-trap.avif`,
    title: "0.5ct Princess: The Half-Carat Trap",
    description: "The Half-Carat Trap: 0.49ct G-VS1 saves $150 vs 0.50ct for a 0.03mm face-up difference that is invisible on a hand.",
  },
  {
    input: `${SRC}/0-5-carat-princess-vs-round-face-up.jpeg`,
    output: `${DEST}/0-5-carat-princess-vs-round-face-up.avif`,
    title: "0.5ct Princess vs Round: Face-Up Size Penalty",
    description: "0.5ct princess 4.4mm vs 0.5ct round 5.2mm face-up comparison. At 0.5ct the 0.8mm gap is proportionally more significant than at 1ct.",
  },
  {
    input: `${SRC}/0-75-carat-princess-sweet-spot.jpeg`,
    output: `${DEST}/0-75-carat-princess-sweet-spot.avif`,
    title: "0.75ct Princess: The Three-Quarter Sweet Spot",
    description: "The Three-Quarter Sweet Spot: 0.75ct princess delivers 90% of 1ct face-up area at 63% of 1ct price — the strongest face-up-per-dollar value in the princess market.",
  },
  {
    input: `${SRC}/0-75-carat-princess-threshold-trap.jpeg`,
    output: `${DEST}/0-75-carat-princess-threshold-trap.avif`,
    title: "0.75ct Princess: The Threshold Trap",
    description: "0.74ct vs 0.75ct princess threshold pricing. Buy 0.74ct G-VS1 at ~$1,380 and save 12–16% for a 0.03mm size difference invisible on a hand.",
  },
  {
    input: `${SRC}/1-5-carat-princess-per-carat-jump.jpeg`,
    output: `${DEST}/1-5-carat-princess-per-carat-jump.avif`,
    title: "1ct to 1.5ct to 2ct Princess: The Per-Carat Jump",
    description: "Per-carat price escalation: 1ct $2,536/ct → 1.5ct ~$4,333/ct (+71%) → 2ct $6,115/ct (+141%). The rarity premium explained with real Blue Nile data.",
  },
  {
    input: `${SRC}/1-5-carat-princess-face-up-comparison.jpeg`,
    output: `${DEST}/1-5-carat-princess-face-up-comparison.avif`,
    title: "1.5ct Princess: Face-Up Size vs 1ct and 2ct",
    description: "1.5ct princess 6.2mm face-up compared to 1ct at 5.5mm and 2ct at 7.0mm. Total ring cost ~$7,200 for a statement-sized diamond.",
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
