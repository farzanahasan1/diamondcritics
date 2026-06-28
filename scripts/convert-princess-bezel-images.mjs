import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: "Princess-Cut-Bezel-Engagement-Ring.jpg",
    dest: "princess-cut-bezel-setting-featured.avif",
    title: "Princess Cut Bezel Engagement Ring — Full Corner Protection Guide 2026",
    desc: "Princess cut bezel engagement ring in rose gold with emerald cut side stones. Full bezel construction is the only setting that completely encases all four princess cut corners, eliminating chip and snag risk.",
  },
  {
    src: "bezel-bn-505118-yg.jpg",
    dest: "princess-cut-comfort-fit-bezel-yellow-gold.avif",
    title: "Comfort Fit Bezel Set Solitaire Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Comfort fit bezel set solitaire engagement ring in 14K yellow gold with princess cut center. Domed interior band slides over knuckle easily. Full bezel encases all four princess cut corners. Blue Nile.",
  },
  {
    src: "bezel-bn-505014-wg.jpg",
    dest: "princess-cut-bezel-solitaire-white-gold.avif",
    title: "Bezel Solitaire Engagement Ring in 14K White Gold — Princess Cut Center",
    desc: "Bezel solitaire engagement ring in 14K white gold with princess cut center diamond. Continuous metal wall fully encases all four 90° corners. Zero corner chip risk, zero corner snag risk. Blue Nile.",
  },
  {
    src: "bezel-bn-505115-wg.jpg",
    dest: "princess-cut-bezel-baguette-three-stone-white-gold.avif",
    title: "Bezel Straight Baguette Three Stone Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Bezel straight baguette cut diamond three stone engagement ring in 14K white gold with princess cut center. All three stones fully bezeled — no exposed prongs on any stone. Blue Nile.",
  },
  {
    src: "bezel-bn-504961-wg.jpg",
    dest: "princess-cut-bezel-channel-set-platinum.avif",
    title: "Bezel Engagement Ring with Channel Set Diamond Accent in Platinum — Princess Cut",
    desc: "Bezel engagement ring with channel set diamond accent in platinum with princess cut center. Fully prong-free construction: bezel center and channel band. Maximum daily-wear safety for princess cut.",
  },
  {
    src: "bezel-bn-505115-rg.jpg",
    dest: "princess-cut-bezel-baguette-three-stone-rose-gold.avif",
    title: "Bezel Straight Baguette Three Stone Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "Bezel straight baguette cut diamond three stone engagement ring in 14K rose gold with princess cut center. Warm rose gold frames all three bezeled stones. Blue Nile.",
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
