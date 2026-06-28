import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: "Princess-Cut-Cathedral-Engagement-Ring.jpg",
    dest: "princess-cut-cathedral-setting-featured.avif",
    title: "Princess Cut Cathedral Engagement Ring — Corner Snag Risk Guide 2026",
    desc: "Princess cut cathedral engagement ring editorial image. Cathedral arch elevates the princess cut center above the band, doubling corner snag hazard versus a round diamond in the same setting.",
  },
  {
    src: "cath-bn-505075-wg.jpg",
    dest: "princess-cut-cathedral-art-deco-white-gold.avif",
    title: "Art Deco Fleur-De-Lis Pavé Cathedral Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Art Deco inspired fleur-de-lis pavé cathedral engagement ring in 14K white gold with princess cut center. Ornate basket gallery adds structural corner protection.",
  },
  {
    src: "cath-bn-505005-wg.jpg",
    dest: "princess-cut-cathedral-pavé-crown-white-gold.avif",
    title: "Cathedral Pavé Crown Diamond Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Cathedral pavé crown diamond engagement ring in 14K white gold with princess cut center. Pavé diamonds set along the arch crown descend from center to band.",
  },
  {
    src: "cath-bn-505111-wg.jpg",
    dest: "princess-cut-cathedral-cross-prong-white-gold.avif",
    title: "Cross Prong Solitaire Cathedral Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Cross prong solitaire cathedral engagement ring in 14K white gold with princess cut center diamond. X-pattern prong wraps more corner angle for reduced snag exposure.",
  },
  {
    src: "cath-bn-503400-wg.jpg",
    dest: "princess-cut-riviera-cathedral-pave-platinum.avif",
    title: "Riviera Cathedral Pavé Diamond Engagement Ring in Platinum — Princess Cut Center",
    desc: "Riviera cathedral pavé diamond engagement ring in platinum with princess cut center. 1/2 ct tw riviera pavé band, cathedral arch, platinum durability. 111 reviews on Blue Nile.",
  },
  {
    src: "cath-bn-501601-wg.jpg",
    dest: "princess-cut-imperial-micropave-platinum-cathedral.avif",
    title: "Blue Nile Studio Imperial Micropavé Diamond Engagement Ring in Platinum — Princess Cut",
    desc: "Blue Nile Studio Imperial Micropavé diamond engagement ring in platinum with princess cut center. 3/8 ct tw micropavé across cathedral arch and shank. Premium studio tier.",
  },
];

for (const img of images) {
  try {
    const srcPath = path.join(DL, img.src);
    const destPath = path.join(OUT, img.dest);
    await sharp(srcPath)
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
    console.log(`✅ ${img.dest} — ${Math.round(size/1024)}KB`);
  } catch (e) {
    console.error(`❌ ${img.src}: ${e.message}`);
  }
}
await exiftool.end();
console.log("\nAll done.");
