import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: "1 Carat Princess Cut Diamond Engagement Ring feature image.png",
    dest: "1-carat-princess-cut-diamond-engagement-ring-featured.avif",
    title: "1 Carat Princess Cut Diamond Engagement Ring — 27 GIA Picks From $2,141",
    desc: "1 carat princess cut diamond engagement ring featured image. 27 GIA-certified stones from $2,141. Curated picks with complete ring combinations from $3,002.",
  },
  {
    src: "2 Carat Princess Cut Diamond Engagement Ring.png",
    dest: "2-carat-princess-cut-diamond-engagement-ring-featured.avif",
    title: "2 Carat Princess Cut Diamond Engagement Ring — GIA G-VS2 From $12,229",
    desc: "2 carat princess cut diamond engagement ring. GIA G-VS2 from $12,229. Saves $8,000+ vs 2ct round. High-value buyer guide 2026.",
  },
  {
    src: "Princess Cut Diamond Engagement Ring.png",
    dest: "princess-cut-diamond-engagement-ring-settings-featured.avif",
    title: "Princess Cut Diamond Engagement Ring — Every Setting, Every Metal 2026",
    desc: "Princess cut diamond engagement ring master settings guide. Solitaire, pavé, halo, three-stone, bezel, vintage. 40+ settings with live Blue Nile prices.",
  },
  {
    src: "Princess Cut Solitaire Engagement Ring.png",
    dest: "princess-cut-solitaire-engagement-ring-featured.avif",
    title: "Princess Cut Solitaire Engagement Ring — V-Prong on All 4 Corners Is Mandatory",
    desc: "Princess cut solitaire engagement ring. The Corner Chip Risk explained. V-prong on all 4 corners mandatory. Best picks from $790 to $1,635 on Blue Nile.",
  },
  {
    src: "Princess Cut Halo Engagement Ring.png",
    dest: "princess-cut-halo-engagement-ring-featured.avif",
    title: "Princess Cut Halo Engagement Ring — Avoid The Round-Look Buyer Trap",
    desc: "Princess cut halo engagement ring. Round halo makes princess look oval. Hidden halo preserves square geometry from $1,255. Buyer trap explained 2026.",
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
