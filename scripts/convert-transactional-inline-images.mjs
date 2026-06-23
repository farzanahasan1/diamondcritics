import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  // 1ct post
  {
    input: path.join(imgDir, "1-carat-diamond-engagement-ring.jpeg"),
    output: path.join(imgDir, "1-carat-diamond-engagement-ring-1.avif"),
    title: "1 Carat Diamond Engagement Ring: Full Grade and Price Audit",
    description: "1 carat diamond engagement ring cut grade and price comparison chart showing GIA Excellent G-VS2 at $3,230 as the 1ct Sweet Spot with full grade ladder on white editorial background",
  },
  {
    input: path.join(imgDir, "1-carat-diamond-engagement-ring image 2.jpeg"),
    output: path.join(imgDir, "1-carat-diamond-engagement-ring-2.avif"),
    title: "1ct Natural vs 1.5ct Lab-Grown: The Real Engagement Ring Budget Decision",
    description: "1 carat diamond vs 1.5 carat lab-grown ring budget comparison showing natural 1ct G-VS2 at $3,230 versus lab 1.5ct D-VVS1 IGI at $1,950 with 7.4mm face-up size on white editorial background",
  },
  // 2ct post
  {
    input: path.join(imgDir, "2-carat-diamond-engagement-ring.jpeg"),
    output: path.join(imgDir, "2-carat-diamond-engagement-ring-1.avif"),
    title: "2 Carat Diamond Engagement Ring — The 2ct Commitment: Natural vs Lab Price Reality",
    description: "2ct natural vs lab round diamond price comparison showing $16,490 natural G-VS2 vs $2,810 lab-grown D-VVS1 IGI at same 8.1mm size with The 2ct Commitment concept on white editorial background",
  },
  {
    input: path.join(imgDir, "2-carat-diamond-engagement-ring image 2.jpeg"),
    output: path.join(imgDir, "2-carat-diamond-engagement-ring-2.avif"),
    title: "2ct Round Diamond Settings: Solitaire vs Halo vs Three-Stone — Farzana's Audit",
    description: "2ct diamond engagement ring settings comparison solitaire vs halo vs three-stone with Blue Nile price data showing total ring costs from $17,290 to $24,460 on white editorial background",
  },
  // 3ct post
  {
    input: path.join(imgDir, "3-carat-diamond-engagement-ring.jpeg"),
    output: path.join(imgDir, "3-carat-diamond-engagement-ring-1.avif"),
    title: "3 Carat Diamond Engagement Ring — The 3ct Statement: Price Reality and Grade Comparison",
    description: "3ct natural diamond vs lab-grown price table showing $48,780 natural G-VS2 vs $5,800 lab E-VVS1 IGI from Blue Nile with The 3ct Statement concept on white editorial background",
  },
  {
    input: path.join(imgDir, "3-carat-diamond-engagement-ring image 2.jpeg"),
    output: path.join(imgDir, "3-carat-diamond-engagement-ring-2.avif"),
    title: "3ct Round Diamond Settings Guide — Solitaire, Halo, and Pavé Band Proportions Explained",
    description: "3ct round diamond ring setting comparison showing solitaire vs pavé band vs halo size proportions with platinum pricing and Farzana's verdict preferring solitaire on white editorial background",
  },
  // Under $3K post
  {
    input: path.join(imgDir, "round-diamond-engagement-ring-under-3000.jpeg"),
    output: path.join(imgDir, "round-diamond-engagement-ring-under-3000-1.avif"),
    title: "Round Diamond Under $3,000 — Lab vs Natural Size Reality at the $3,000 Diamond Window",
    description: "Under $3,000 round diamond engagement ring options comparing lab 2ct D-VVS1 at $2,810 vs natural 0.9ct G-VS2 face-up size with The $3,000 Diamond Window concept on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-engagement-ring-under-3000 image 2.jpeg"),
    output: path.join(imgDir, "round-diamond-engagement-ring-under-3000-2.avif"),
    title: "Under $3,000 Engagement Ring Builds — 2ct Lab Solitaire vs 1.5ct Lab Solitaire Comparison",
    description: "Lab diamond setting guide for under $3,000 budget showing 4-prong solitaire with 2ct lab D-VVS1 IGI at $2,810 and 1.5ct lab D-VVS1 IGI at $1,950 complete ring builds on white editorial background",
  },
  // Best round cut post
  {
    input: path.join(imgDir, "best-round-cut-diamond-engagement-ring.jpeg"),
    output: path.join(imgDir, "best-round-cut-diamond-engagement-ring-1.avif"),
    title: "Best Round Cut Diamond Engagement Ring — The Buyer's Triangle at Every Budget Tier",
    description: "Best round diamond engagement ring by budget tier showing 1ct G-VS2 at $3,230 through 3ct G-VS2 at $48,780 with lab alternatives at every level and The Buyer's Triangle framework on white editorial background",
  },
  {
    input: path.join(imgDir, "best-round-cut-diamond-engagement-ring image 2.jpeg"),
    output: path.join(imgDir, "best-round-cut-diamond-engagement-ring-2.avif"),
    title: "Best Round Diamond Setting Guide — Solitaire vs Halo vs Three-Stone with The Buyer's Triangle",
    description: "Best round diamond engagement ring settings comparison solitaire vs halo vs three-stone with proportion guide overlay and Buyer's Triangle cut-first decision matrix on white editorial background",
  },
];

for (const job of jobs) {
  try {
    await sharp(job.input)
      .resize(1500, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .avif({ quality: 82 })
      .toFile(job.output);

    await exiftool.write(job.output, {
      Title: job.title,
      Description: job.description,
      Creator: "DiamondCritics",
      Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
    });

    console.log(`✓ ${path.basename(job.output)}`);
  } catch (err) {
    console.error(`✗ ${path.basename(job.output)}: ${err.message}`);
  }
}

await exiftool.end();
console.log("Done.");
