import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS = "/Users/mehedihasan/Downloads";
const OUT = path.join(__dirname, "../public/images");

// All inline images — fit: contain, white background (ChatGPT infographic output)
const inlineImages = [
  { src: "3ct princess vs round comparison.jpeg",              dest: "3-carat-princess-vs-round-comparison.avif",     title: "3ct Princess Cut vs Round Diamond: Price, Face-Up Size and Clarity Comparison",           desc: "The Statement Square named concept — 3ct princess at 8.1mm vs round at 9.4mm, price difference and face-up area data" },
  { src: "corner fracture rule at 3ct.jpeg",                   dest: "3-carat-princess-corner-clarity-rule.avif",     title: "The Corner Fracture Rule: VS1 Is the Structural Minimum at 3ct Princess Cut",              desc: "Corner inclusions at 3ct princess cut size become fracture initiation risk under daily wear — VS1 is not aesthetic, it is structural" },
  { src: "princess per-carat ladder chart.jpeg",               dest: "princess-cut-price-per-carat-ladder.avif",      title: "The Princess Per-Carat Ladder: Full Size Chart from 0.5ct to 6ct",                          desc: "Princess cut per-carat price progression — $1,400 per carat at 0.5ct rising to $49,777 per carat at 5.60ct with inflection points at each magic size" },
  { src: "princess vs round per-carat by size.jpeg",           dest: "princess-cut-threshold-tax-chart.avif",         title: "The Threshold Tax: Per-Carat Premium at Each Magic Size in Princess Cut",                    desc: "Per-carat premium spike at magic size marks — most impactful avoidance at 1.5ct where sub-threshold 1.49ct saves approximately $900" },
  { src: "under $2,000 complete ring budget map.jpeg",         dest: "princess-cut-under-2000-budget-map.avif",       title: "Princess Cut Ring Under $2,000: Complete Budget Map — Stone and Setting Breakdown",          desc: "Natural 0.75ct princess stone plus setting budget breakdown for complete ring under $2,000 vs lab 1ct D-VVS1 path" },
  { src: "every GIA 1ct grade under $3,000.jpeg",              dest: "princess-cut-under-3000-grade-table.avif",      title: "Princess Cut Under $3,000: Every GIA 1ct Stone Grade-by-Grade",                            desc: "Full D-through-G color and VS2-through-VS1 clarity stack — all 27 GIA 1ct princess stones accessible under $3,000" },
  { src: "princess vs round under $3,000.png",                 dest: "princess-cut-under-3000-vs-round.avif",         title: "Princess Cut vs Round Under $3,000: What Each Budget Buys",                                desc: "Princess cut is the only shape with a certified GIA 1ct stone under $3,000 — round starts at $3,230, princess at $2,141" },
  { src: "stone + setting budget breakdown under $5,000.png",  dest: "princess-cut-under-5000-budget-breakdown.avif", title: "Under $5,000: Stone Budget vs Ring Budget for Princess Cut",                               desc: "Budget tier breakdown at $5,000 — natural 1ct G-VS1 platinum ring at $3,636 leaves $1,364 remaining, lab 2ct D-VVS1 for $1,200" },
];

async function convertInline(src, dest, title, desc) {
  const srcPath = path.join(DOWNLOADS, src);
  const destPath = path.join(OUT, dest);
  await sharp(srcPath)
    .resize(1500, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .avif({ quality: 82 })
    .toFile(destPath);
  await exiftool.write(destPath, {
    Title: title,
    Description: desc,
    Creator: "DiamondCritics",
    Copyright: "© 2026 DiamondCritics",
  }, ["-overwrite_original"]);
  const { size } = await import("fs").then(fs => fs.promises.stat(destPath));
  console.log(`✅ ${dest} — ${Math.round(size / 1024)}KB`);
}

console.log("Converting 8 inline images for last 5 princess posts...\n");
for (const img of inlineImages) {
  try {
    await convertInline(img.src, img.dest, img.title, img.desc);
  } catch (e) {
    console.error(`❌ ${img.src}: ${e.message}`);
  }
}

await exiftool.end();
console.log("\nDone.");
