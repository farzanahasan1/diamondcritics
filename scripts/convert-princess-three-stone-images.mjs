import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: "bn-prn-502270-yg.jpg",
    dest: "princess-cut-three-stone-marquise-sides-yellow-gold.avif",
    title: "Marquise Cut Diamond Three Stone Engagement Ring in 14K Yellow Gold — Princess Cut Center",
    desc: "Marquise cut diamond three stone engagement ring in 14K yellow gold with princess cut center. Marquise side stones at 60% width of center. $1,970 on Blue Nile.",
  },
  {
    src: "bn-prn-505023-yg-superimpose.jpg",
    dest: "princess-cut-three-stone-pave-knife-edge-yellow-gold.avif",
    title: "Pavé Knife Edge Diamond Three Stone Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Pavé knife edge diamond three stone engagement ring in 14K yellow gold with princess cut center diamond. Knife edge band with pavé accents. $3,400 on Blue Nile.",
  },
  {
    src: "bn-prn-502482-wg.jpg",
    dest: "princess-cut-three-stone-micropave-trio-white-gold.avif",
    title: "Petite Micropavé Trio Diamond Engagement Ring in 14k White Gold — Princess Cut Center",
    desc: "Petite micropavé trio diamond engagement ring in 14K white gold with princess cut center. 1/5 ct tw micropavé side stones. Entry-level three stone at $1,765 on Blue Nile.",
  },
  {
    src: "bn-prn-505115-wg.jpg",
    dest: "princess-cut-three-stone-elongated-princess-white-gold.avif",
    title: "Three-Stone Elongated Princess Diamond Engagement Ring in 14K White Gold",
    desc: "Three stone elongated princess cut diamond engagement ring in 14K white gold. 1/2 ct tw princess cut side stones. Three matching princess cuts in a row. $4,450 on Blue Nile.",
  },
  {
    src: "bn-prn-501201-wg-superimpose.jpg",
    dest: "princess-cut-three-stone-emerald-sides-white-gold.avif",
    title: "Three-Stone Emerald Cut Diamond Engagement Ring in 14K White Gold — Princess Cut Center",
    desc: "Three stone emerald cut diamond engagement ring in 14K white gold with princess cut center. 5/8 ct tw step-cut emerald side stones. $4,510 on Blue Nile.",
  },
  {
    src: "bn-prn-503822-rg.jpg",
    dest: "princess-cut-three-stone-scroll-undergallery-rose-gold.avif",
    title: "Diamond Three Stone Engagement Ring With Scroll Undergallery in 14K Rose Gold — Princess Cut",
    desc: "Diamond three stone engagement ring with scroll undergallery detail in 14K rose gold with princess cut center stone. Round side diamonds, scrollwork gallery. $2,410 on Blue Nile.",
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
