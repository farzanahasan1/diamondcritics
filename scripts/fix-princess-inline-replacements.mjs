import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS = "/Users/mehedihasan/Downloads";
const OUT = path.join(__dirname, "../public/images");

const images = [
  {
    src: "Princess_vs_Round_diamonds_budget_202606271712.jpeg",
    dest: "princess-cut-under-3000-vs-round.avif",
    title: "Princess Cut vs Round Under $3,000: What Each Budget Buys",
    desc: "Princess cut 1ct GIA G-VS2 at $2,212 vs round brilliant sub-1ct only — princess is the only shape that accesses the full GIA 1ct market under $3,000",
  },
  {
    src: "Princess_vs_Round_savings_infogr…_202606271711.jpeg",
    dest: "princess-cut-threshold-tax-chart.avif",
    title: "Princess vs Round: Per-Carat Savings by Size — The 20% Price Advantage",
    desc: "Princess saves 15–31% per carat vs round at every size. Value Window 1ct–2ct gives $1,018–$4,261 absolute dollar savings.",
  },
  {
    src: "Princess_per-carat_ladder_infogr…_202606271711.jpeg",
    dest: "princess-cut-price-per-carat-ladder.avif",
    title: "The Princess Per-Carat Ladder: From $2,212/ct to $22,890/ct",
    desc: "Princess cut price per carat rises from $1,500/ct at 0.5ct to $22,890/ct at 4ct. The 4ct Per-Carat Cliff: +67%. 3ct is the last affordable tier.",
  },
  {
    src: "Princess_vs_Round_diamond_compar…_202606271711.jpeg",
    dest: "3-carat-princess-vs-round-comparison.avif",
    title: "The Statement Square: 3ct Princess vs 3ct Round Diamond Comparison",
    desc: "3ct princess G-VVS2 at $41,095 vs 3ct round G-VS2 at $48,780. Princess saves $7,685 and delivers better clarity. The 3ct Rarity Lock: 1 GIA stone available.",
  },
  {
    src: "Lab_diamond_comparison_infographic_202606271711.jpeg",
    dest: "princess-cut-under-2000-natural-vs-lab.avif",
    title: "The Sub-$2K Lab Leap: Natural 0.75ct vs Lab 1ct Princess Cut",
    desc: "Natural 0.75ct G-VS1 at ~$1,600 vs lab 1ct D-VVS1 IGI at ~$500. Lab is 21% more face-up area at 69% less cost. Complete ring under $2,000 both paths.",
  },
  {
    src: "Princess_cut_ring_budget_map_202606271712.jpeg",
    dest: "princess-cut-under-2000-budget-map.avif",
    title: "Princess Cut Ring Under $2,000: Complete Budget Map — Stone and Setting",
    desc: "Under $2,000: 0.74ct G-VS1 natural + 14K setting leaves $230 remaining. 0.75ct G-VS1 tight at $10 remaining. Lab 1ct D-VVS1 + platinum V-tip = $1,600 total.",
  },
  {
    src: "Corner_Fracture_Rule_diamond_cla…_202606271711.jpeg",
    dest: "3-carat-princess-corner-clarity-rule.avif",
    title: "The Corner Fracture Rule: VS1 Is Mandatory at 3ct Princess Cut",
    desc: "VS2 corners at 3ct princess = 50–60% eye-clean with fracture risk. VS1 is structural minimum, not aesthetic preference. Only 1 GIA 3ct stone available at $41,095.",
  },
  {
    src: "Princess_diamond_price_infographic_202606271712.jpeg",
    dest: "princess-cut-under-3000-grade-table.avif",
    title: "The $3K Princess Window: Every GIA 1ct Grade Under $3,000",
    desc: "27 GIA 1ct princess stones from $2,141 to $2,737 — all under $3,000. G-VS1 at $2,536 is Farzana's Pick. Round 1ct G-VS2 = $3,230, above the $3K ceiling.",
  },
];

console.log("Replacing 8 inline images with corrected versions...\n");

for (const img of images) {
  try {
    const srcPath = path.join(DOWNLOADS, img.src);
    const destPath = path.join(OUT, img.dest);
    await sharp(srcPath)
      .resize(1500, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
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
    console.error(`❌ ${img.src}: ${e.message}`);
  }
}

await exiftool.end();
console.log("\nAll done.");
