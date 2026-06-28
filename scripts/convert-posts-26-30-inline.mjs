import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { readFile } from "fs/promises";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  // Post #26 — how-to-buy-princess-cut-diamond
  {
    src: path.join(DL, "princess-cut-7-step-buying-checklist-infographic.jpeg"),
    dest: "princess-cut-7-step-buying-checklist-infographic.avif",
    title: "How to Buy a Princess Cut Diamond — 7-Step Buying Checklist 2026",
    desc: "Seven-step buying checklist for princess cut diamonds: proportions, cut quality evaluation, color minimum by metal, clarity floor, V-prong setting requirement, and budget allocation framework.",
  },
  {
    src: path.join(DL, "princess-cut-diamond-budget-allocation-guide.jpeg"),
    dest: "princess-cut-budget-allocation-guide.avif",
    title: "Princess Cut Diamond Budget Allocation Guide — Diamond vs Setting Split 2026",
    desc: "Budget allocation chart for princess cut engagement rings showing diamond-to-setting ratio across three total budget tiers: under $3,000, $3,000–$5,000, and $5,000–$10,000.",
  },
  // Post #27 — princess-cut-diamond-color-guide
  {
    src: path.join(DL, "princess-cut-color-corner-trap-diagram.jpeg"),
    dest: "princess-cut-color-corner-trap-diagram.avif",
    title: "Princess Cut Diamond Corner Color Trap — Chevron Facets Concentrate Color at Corners",
    desc: "Diagram of a princess cut diamond face-up showing how the chevron facet pattern channels color warmth toward the four corner zones. The Corner Color Trap explains why princess cuts need G minimum in white metal.",
  },
  {
    src: path.join(DL, "princess-cut-color-grade-by-metal-matrix.jpeg"),
    dest: "princess-cut-color-by-metal-selection-guide.avif",
    title: "Princess Cut Color Grade by Metal — G in White Metal, H in Warm Metal 2026",
    desc: "Color grade selection guide for princess cut diamonds by setting metal. G minimum for platinum and white gold. H acceptable in yellow gold and rose gold. D-F unnecessary premium in any metal.",
  },
  // Post #28 — princess-cut-diamond-clarity-guide
  {
    src: path.join(DL, "princess-cut-clarity-grade-comparison-visual.jpeg"),
    dest: "princess-cut-clarity-grade-comparison-visual.avif",
    title: "Princess Cut Diamond Clarity Grade Comparison — VS1 vs VS2 vs SI1 Corner Risk",
    desc: "Side-by-side clarity grade comparison for princess cut diamonds showing VS1 (true minimum), VS2 (corner review required), and SI1 (high risk). Corner inclusion risk illustrated per grade.",
  },
  {
    src: path.join(DL, "princess-cut-gia-cert-corner-review-guide.jpeg"),
    dest: "princess-cut-gia-cert-corner-review-guide.avif",
    title: "How to Read GIA Clarity Plot for Princess Cut Corner Inclusions 2026",
    desc: "Step-by-step guide to reading a GIA certificate clarity plot for princess cut diamonds. The four corner zones are the most critical — feathers, crystals, and cavities at corners are reject criteria.",
  },
  // Post #29 — princess-cut-diamond-cut-quality-guide
  {
    src: path.join(DL, "princess-cut-no-gia-cut-grade-certificate.jpeg"),
    dest: "princess-cut-no-gia-cut-grade-certificate.avif",
    title: "GIA Certificate Princess Cut — Cut Grade Field Shows Not Graded 2026",
    desc: "GIA grading certificate for a princess cut diamond with the Cut Grade field blank — labeled Not Graded. GIA only grades round brilliant cut quality. Every Ideal label on a princess cut is retailer marketing.",
  },
  {
    src: path.join(DL, "princess-cut-cut-evaluation-5-point-checklist.jpeg"),
    dest: "princess-cut-cut-evaluation-5-point-checklist.avif",
    title: "5-Point Princess Cut Quality Checklist — Replaces Missing GIA Cut Grade 2026",
    desc: "Five-point manual evaluation checklist for princess cut cut quality: table 65-75%, depth 64-75%, polish Excellent or Very Good, symmetry Excellent or Very Good, L:W ratio 1.00-1.02.",
  },
  // Post #30 — princess-cut-diamond-ideal-proportions
  {
    src: path.join(DL, "princess-cut-table-depth-proportion-cross-section.jpeg"),
    dest: "princess-cut-table-depth-proportion-cross-section.avif",
    title: "Princess Cut Diamond Table and Depth Proportion Cross-Section Diagram 2026",
    desc: "Technical cross-section diagram of a princess cut diamond showing table percentage 68-72%, depth percentage 65-70%, crown height, and pavilion depth with labeled measurements.",
  },
  {
    src: path.join(DL, "princess-cut-lw-ratio-visual-comparison.jpeg"),
    dest: "princess-cut-lw-ratio-visual-comparison.avif",
    title: "Princess Cut L:W Ratio Visual Comparison — 1.00 vs 1.02 vs 1.05 Face-Up 2026",
    desc: "Face-up comparison of princess cut diamonds at three L:W ratios: 1.00 (perfect square), 1.02 (nearly square), and 1.05 (slightly rectangular). Visual guide to how elongation appears to the naked eye.",
  },
];

for (const img of images) {
  try {
    const buf = await readFile(img.src);
    const destPath = path.join(OUT, img.dest);
    await sharp(buf)
      .resize(1500, 1000, { fit: "inside" })
      .avif({ quality: 82 })
      .toFile(destPath);
    await exiftool.write(destPath, {
      Title: img.title,
      Description: img.desc,
      Creator: "DiamondCritics",
      Copyright: "© 2026 DiamondCritics",
    }, ["-overwrite_original"]);
    const { size } = await import("fs").then(fs => fs.promises.stat(destPath));
    console.log(`✅ ${img.dest} — ${Math.round(size / 1024)}KB`);
  } catch (e) {
    console.error(`❌ ${img.dest}: ${e.message}`);
  }
}
await exiftool.end();
console.log("\nAll done.");
