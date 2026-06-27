import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS = "/Users/mehedihasan/Downloads";
const OUT = path.join(__dirname, "../public/images");

// Featured images — fit: inside (user-supplied editorial PNGs)
const featuredImages = [
  { src: "3 Carat Princess Cut Diamond Price.png",      dest: "3-carat-princess-cut-diamond-price-featured.avif",      title: "3 Carat Princess Cut Diamond Price 2026 — The 3ct Rarity Lock",                  desc: "Only 1 GIA-certified 3ct princess cut diamond on Blue Nile at $41,095. The 3ct Rarity Lock explained by Farzana Hasan, GIA Expert." },
  { src: "Princess Cut Diamond Price Per Carat.png",    dest: "princess-cut-diamond-price-per-carat-featured.avif",    title: "Princess Cut Diamond Price Per Carat 2026 — The Value Window",                   desc: "Princess cut diamond price per carat from $2,212 at 1ct to $13,698 at 3ct. Full chart with all sizes and threshold analysis." },
  { src: "Princess Cut Diamond Under $2,000.png",       dest: "princess-cut-diamond-under-2000-featured.avif",         title: "Princess Cut Diamond Under $2,000 2026 — The $2K Reality Check",                desc: "Princess cut diamond under $2,000: 0.75ct natural from $1,400 or lab 1ct for $500. What $2,000 actually buys in 2026." },
  { src: "Princess Cut Diamond Under $3,000.png",       dest: "princess-cut-diamond-under-3000-featured.avif",         title: "Princess Cut Diamond Under $3,000 2026 — The $3K Princess Window",               desc: "27 GIA-certified 1ct princess cut diamonds under $3,000 on Blue Nile, from $2,141. Full grade table with affiliate links." },
  { src: "Princess Cut Diamond Under $5,000.png",       dest: "princess-cut-diamond-under-5000-featured.avif",         title: "Princess Cut Diamond Under $5,000 2026 — The $5K Princess Plateau",              desc: "GIA 1ct princess cut ring in platinum from $3,636 under $5,000. Lab 2ct D-VVS1 for $1,200. Complete budget breakdown." },
];

// Remaining inline images — fit: contain, white background
const inlineImages = [
  { src: "natural 0.75ct vs lab 1ct.jpeg",              dest: "princess-cut-under-2000-natural-vs-lab.avif",           title: "Under $2,000 Princess Cut: Natural 0.75ct vs Lab 1ct — The Sub-$2K Lab Leap",   desc: "Natural 0.75ct G-VS1 princess cut at $1,420 vs lab-grown 1ct D-VVS1 at $500 — same budget, very different face-up size." },
  { src: "natural vs lab at $5,000.png",                dest: "princess-cut-under-5000-natural-vs-lab.avif",           title: "Natural vs Lab Princess Cut at $5,000: What Each Path Delivers",                desc: "Natural 1ct G-VS1 princess in platinum vs lab 2ct D-VVS1 princess at $5,000 total budget — two completely different outcomes." },
];

async function convertFeatured(src, dest, title, desc) {
  const srcPath = path.join(DOWNLOADS, src);
  const destPath = path.join(OUT, dest);
  await sharp(srcPath)
    .resize(1500, 1000, { fit: "inside" })
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

console.log("Converting 5 featured images...\n");
for (const img of featuredImages) {
  try { await convertFeatured(img.src, img.dest, img.title, img.desc); }
  catch (e) { console.error(`❌ ${img.src}: ${e.message}`); }
}

console.log("\nConverting 2 remaining inline images...\n");
for (const img of inlineImages) {
  try { await convertInline(img.src, img.dest, img.title, img.desc); }
  catch (e) { console.error(`❌ ${img.src}: ${e.message}`); }
}

await exiftool.end();
console.log("\nAll done.");
