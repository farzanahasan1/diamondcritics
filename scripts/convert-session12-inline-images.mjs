import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/round-diamond-e-vs-f-color-premium.jpeg`,
    output: `${DEST}/round-diamond-e-vs-f-color-premium.avif`,
    title: "Round Diamond E vs F Color Premium Chart",
    description: "Round diamond E vs F color premium chart showing The Near-Colorless Ceiling — $50 gap at 1ct, price-overlap at 2ct where F-VS2 costs more than E-VS2",
  },
  {
    input: `${SRC}/round-diamond-e-f-color-setting-guide.jpeg`,
    output: `${DEST}/round-diamond-e-f-color-setting-guide.avif`,
    title: "Round Diamond E vs F Color Setting Guide",
    description: "Round diamond E vs F color in settings guide showing The Near-Colorless Ceiling — warmth visibility by setting metal and buyer decision matrix for E vs F color grades",
  },
  {
    input: `${SRC}/round-diamond-h-vs-i-color-comparison.jpeg`,
    output: `${DEST}/round-diamond-h-vs-i-color-comparison.avif`,
    title: "Round Diamond H vs I Color Comparison Chart",
    description: "Round diamond H vs I color comparison chart showing The I-Color Boundary — price savings at 1ct and 2ct with warmth risk by setting metal from yellow gold to platinum",
  },
  {
    input: `${SRC}/round-diamond-i-color-yellow-gold-guide.jpeg`,
    output: `${DEST}/round-diamond-i-color-yellow-gold-guide.avif`,
    title: "Round Diamond I Color Yellow Gold Guide",
    description: "Round diamond I color yellow gold setting guide showing The I-Color Boundary by setting and carat weight — I color is invisible in yellow gold at any carat weight",
  },
  {
    input: `${SRC}/round-diamond-d-color-premium-chart.jpeg`,
    output: `${DEST}/round-diamond-d-color-premium-chart.avif`,
    title: "Round Diamond D Color Premium Chart",
    description: "Round diamond D color premium chart showing The True Colorless Test — D vs G premium from +17% at 1ct to +61% at 2ct with full D clarity spectrum from VS2 to FL",
  },
  {
    input: `${SRC}/round-diamond-d-color-true-colorless-test.jpeg`,
    output: `${DEST}/round-diamond-d-color-true-colorless-test.avif`,
    title: "Round Diamond D Color True Colorless Test",
    description: "Round diamond D color True Colorless Test infographic showing the 5 conditions required to distinguish D from G — and when D color is and is not worth the premium",
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
