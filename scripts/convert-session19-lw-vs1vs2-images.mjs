import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import { promises as fs } from "fs";
import path from "path";

const DOWNLOADS = "/Users/mehedihasan/Downloads";
const DEST = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const featured = [
  {
    src: "princess-cut-diamond-length-to-width-ratio-featured.png",
    dest: "princess-cut-diamond-length-to-width-ratio-featured.avif",
    title: "Princess Cut Diamond Length to Width Ratio Guide 2026 — The Square Premium",
    description: "Princess cut L:W ratio guide: 1.00–1.02 sweet spot, The Square Premium explained. Perfect 1.00:1.00 costs 3–7% more with no optical advantage over 1.01–1.02.",
  },
  {
    src: "princess-cut-diamond-vs1-vs-vs2-featured.png",
    dest: "princess-cut-diamond-vs1-vs-vs2-featured.avif",
    title: "Princess Cut Diamond VS1 vs VS2 Clarity Guide 2026 — The Corner Clarity Divide",
    description: "Princess cut VS1 vs VS2: VS2 is 90% eye-clean in round but only 40–60% in princess cut. The Corner Clarity Divide explained with GIA cert review process.",
  },
];

const inline = [
  {
    src: "princess-cut-lw-ratio-comparison.jpeg",
    dest: "princess-cut-lw-ratio-comparison.avif",
    title: "Princess Cut L:W Ratio Comparison — 1.00 to 1.10 Face-Up Visual and Price Impact",
    description: "Four princess cut L:W ratios compared face-up: 1.00 (perfect), 1.02 (sweet spot), 1.05 (borderline), 1.10 (avoid). Price impact of The Square Premium at each ratio.",
  },
  {
    src: "princess-cut-square-premium-price-chart.jpeg",
    dest: "princess-cut-square-premium-price-chart.avif",
    title: "Princess Cut Square Premium Price Chart — 1ct and 2ct by L:W Ratio",
    description: "Princess cut price by L:W ratio at 1ct and 2ct G-VS1. The Square Premium: perfect 1.00:1.00 costs 3–7% more than 1.02–1.03 with no optical difference on the finger.",
  },
  {
    src: "princess-cut-vs1-vs2-corner-comparison.jpeg",
    dest: "princess-cut-vs1-vs2-corner-comparison.avif",
    title: "Princess Cut VS1 vs VS2 Corner Clarity Comparison — Inclusion Position and Optical Risk",
    description: "Princess cut Corner Clarity Divide: VS1 inclusions in center table (safe), VS2 inclusions at corners (reject). Round vs princess VS2 eye-clean rate comparison.",
  },
  {
    src: "princess-cut-vs1-vs-vs2-price-table.jpeg",
    dest: "princess-cut-vs1-vs-vs2-price-table.avif",
    title: "Princess Cut VS1 vs VS2 Price Table — Eye-Clean Rate by Carat Weight",
    description: "Princess cut VS1 vs VS2 price and eye-clean rate at 1ct and 2ct. VS1 $2,536 vs VS2 $2,212 ($324 saving). Eye-clean rate drops from 40–60% at 1ct to 25–40% at 2ct for VS2.",
  },
];

async function convertFeatured(item) {
  const srcPath = path.join(DOWNLOADS, item.src);
  const destPath = path.join(DEST, item.dest);
  console.log(`Converting featured: ${item.src} → ${item.dest}`);
  await sharp(srcPath)
    .resize(1500, 1000, { fit: "inside", withoutEnlargement: true })
    .avif({ quality: 82 })
    .toFile(destPath);
  await exiftool.write(destPath, {
    Title: item.title,
    Description: item.description,
    Creator: "DiamondCritics",
    Copyright: "© 2026 DiamondCritics",
  }, ["-overwrite_original"]);
  const stat = await fs.stat(destPath);
  console.log(`  ✓ ${Math.round(stat.size / 1024)}KB`);
}

async function convertInline(item) {
  const srcPath = path.join(DOWNLOADS, item.src);
  const destPath = path.join(DEST, item.dest);
  console.log(`Converting inline: ${item.src} → ${item.dest}`);
  await sharp(srcPath)
    .resize(1500, 1000, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .avif({ quality: 82 })
    .toFile(destPath);
  await exiftool.write(destPath, {
    Title: item.title,
    Description: item.description,
    Creator: "DiamondCritics",
    Copyright: "© 2026 DiamondCritics",
  }, ["-overwrite_original"]);
  const stat = await fs.stat(destPath);
  console.log(`  ✓ ${Math.round(stat.size / 1024)}KB`);
}

async function main() {
  for (const item of featured) await convertFeatured(item);
  for (const item of inline) await convertInline(item);
  await exiftool.end();
  console.log("\nAll 6 images converted.");
}

main().catch(console.error);
