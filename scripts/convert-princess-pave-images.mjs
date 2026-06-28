import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: "Princess-cut-Pave-engagement-ring.jpg",
    dest: "princess-cut-pave-engagement-ring-featured.avif",
    title: "Princess Cut Pavé Engagement Ring — Size Illusion Guide 2026",
    desc: "Princess cut pavé engagement ring editorial image. Pavé band adds 10–15% visual size illusion to smaller princess cut centers by reflecting light upward toward the stone.",
  },
  {
    src: "pave-bn-501680-yg.jpg",
    dest: "princess-cut-pave-petite-twist-yellow-gold.avif",
    title: "Petite Twist Pavé Diamond Engagement Ring in 14K Yellow Gold — Princess Cut Center",
    desc: "Petite twist pavé diamond engagement ring in 14K yellow gold with princess cut center. Twisted pavé shank reflects light from every rotation angle. Blue Nile.",
  },
  {
    src: "pave-bn-505021-wg.jpg",
    dest: "princess-cut-riviera-pave-white-gold.avif",
    title: "Riviera Pavé Diamond Engagement Ring in 14K White Gold — Princess Cut Center",
    desc: "Riviera pavé diamond engagement ring in 14K white gold with princess cut center. Pavé diamonds flush with band surface, seamless sparkle line from shank to center.",
  },
  {
    src: "pave-bn-501150-wg.jpg",
    dest: "princess-cut-french-pave-platinum.avif",
    title: "French Pavé Diamond Engagement Ring in Platinum — Princess Cut Center",
    desc: "French pavé diamond engagement ring in platinum with princess cut center diamond. V-cut prong pockets expose maximum diamond surface for peak light return. 474 reviews on Blue Nile.",
  },
  {
    src: "pave-bn-501410-wg.jpg",
    dest: "princess-cut-scalloped-pave-platinum.avif",
    title: "Scalloped Pavé Diamond Engagement Ring in Platinum — Princess Cut Center",
    desc: "Scalloped pavé diamond engagement ring in platinum with princess cut center. Scalloped cutouts between each diamond pair create an arched, vintage-looking band. 165 reviews on Blue Nile.",
  },
  {
    src: "pave-bn-505101-rg.jpg",
    dest: "princess-cut-falling-edge-pave-halo-rose-gold.avif",
    title: "Falling Edge Pavé Halo Diamond Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "Falling edge pavé halo diamond engagement ring in 14K rose gold with princess cut center. Halo cascades into a pavé band, creating a continuous diamond flow. 368 reviews on Blue Nile.",
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
