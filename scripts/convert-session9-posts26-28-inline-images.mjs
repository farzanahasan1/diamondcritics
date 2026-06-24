import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  // Post 26 — round-diamond-right-hand-ring
  { input: `${SRC}/The RHR Rul.jpeg`, output: `${DEST}/round-diamond-right-hand-ring-styles.avif`, title: "The RHR Rule: Right-Hand Ring Styles — DiamondCritics", description: "Right-hand ring style comparison: bezel solitaire, pavé band, three-stone — The RHR Rule by DiamondCritics" },
  { input: `${SRC}/Metal and Stack Compatibility.jpeg`, output: `${DEST}/round-diamond-rhr-budget-guide.avif`, title: "Right-Hand Ring Budget Guide: Metal and Stack Compatibility — DiamondCritics", description: "Right-hand ring budget guide from $825 to $3,500 with metal and stack compatibility — DiamondCritics" },

  // Post 27 — what-is-round-brilliant-cut-diamond
  { input: `${SRC}/Crown Anatomy 33 Facets Above the Girdle.jpeg`, output: `${DEST}/round-brilliant-57-facet-anatomy-diagram.avif`, title: "Round Brilliant Cut 57-Facet Anatomy Diagram — DiamondCritics", description: "The 57-Facet System: round brilliant crown anatomy — table, bezel, star, upper girdle facets labeled — DiamondCritics" },
  { input: `${SRC}/Ideal Proportions.jpeg`, output: `${DEST}/round-brilliant-ideal-proportions-chart.avif`, title: "Round Brilliant Ideal Proportions: Tolkowsky vs AGS vs GIA — DiamondCritics", description: "Round brilliant ideal proportions comparison: Tolkowsky 1919, AGS Ideal, GIA Excellent ranges — DiamondCritics" },

  // Post 28 — round-diamond-certification-guide
  { input: `${SRC}/The Certificate Inflation Scale.jpeg`, output: `${DEST}/round-diamond-lab-certification-comparison.avif`, title: "Diamond Lab Certification Comparison: The Certificate Inflation Scale — DiamondCritics", description: "The Certificate Inflation Scale: GIA, AGS, IGI, EGL accuracy comparison — DiamondCritics" },
  { input: `${SRC}/igi.jpeg`, output: `${DEST}/round-diamond-certificate-inflation-scale.avif`, title: "Certificate Inflation Scale: What EGL and IGI Cost You — DiamondCritics", description: "Certificate inflation math: EGL F-VS1 vs GIA H-VS2 — dollar impact of wrong certification — DiamondCritics" },
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
console.log("Done — 6 inline images converted.");
