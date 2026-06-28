import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { readFile } from "fs/promises";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

async function fetchBuf(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

const images = [
  {
    local: path.join(DL, "Princess-Cut-Yellow-Gold-Engagement-Ring.jpg"),
    dest: "princess-cut-yellow-gold-engagement-ring-featured.avif",
    title: "Princess Cut Yellow Gold Engagement Ring — G-Color Floor Guide 2026",
    desc: "Princess cut yellow gold engagement ring with pear-shaped diamond side stones. Yellow gold amplifies warmth in all four princess cut corners — G color is the minimum safe grade for this metal and cut combination.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505129/505129_M1_PRN_DIM_wht_0100CT_Y_Box8_003_1600X1600.jpg",
    dest: "princess-cut-yellow-gold-solitaire-setting.avif",
    title: "Petite Solitaire Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Petite solitaire engagement ring in 14K yellow gold with princess cut center diamond. Thin 1.6mm band, four V-prongs. 1,020 reviews on Blue Nile. Most-reviewed princess cut solitaire in yellow gold.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/505032/505032_M1_PRN_DIM_wht_0100CT_Y_Box3_003_1600X1600.jpg",
    dest: "princess-cut-yellow-gold-twist-setting.avif",
    title: "Petite Twist Engagement Ring with Diamonds in 14K Yellow Gold — Princess Cut",
    desc: "Petite twist engagement ring with 1/10 ct tw diamonds in 14K yellow gold with princess cut center. Twisted band design with diamond accents. 417 reviews on Blue Nile.",
  },
  // NOTE: 504380 uses RND (round) diamond in CDN URL — confirm this is Men's Channel ring
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504380/504380_M1_RND_DIM_wht_0100CT_Y_Box6_003_1600X1600.jpg",
    dest: "princess-cut-yellow-gold-channel-setting.avif",
    title: "Bow-Tie Channel Set Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Bow-tie channel set engagement ring in 14K yellow gold with princess cut center diamond. Channel set accent diamonds in bow-tie arrangement flanking the center stone. 146 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505130/505130_M1_PRN_DIM_wht_0100CT_Y_Box4_003_1600X1600.jpg",
    dest: "princess-cut-yellow-gold-pave-setting.avif",
    title: "Common Prong Pavé Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Common prong pavé engagement ring in 14K yellow gold with princess cut center diamond. Shared prong construction maximizes sparkle density along the band. 107 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504979/504979_M1_PRN_DIM_wht_0100CT_Y_Box7_002_1600X1600.jpg",
    dest: "princess-cut-yellow-gold-three-stone-setting.avif",
    title: "Marquise Three Stone Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Marquise three stone engagement ring in 14K yellow gold with princess cut center and east-west marquise diamond side stones. 152 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/502270/502270_M1_PRN_DIM_wht_0100CT_Y_Box5_001_1600X1600.jpg",
    dest: "princess-cut-yellow-gold-halo-setting.avif",
    title: "Falling Edge Pavé Halo Engagement Ring in 14K Yellow Gold — Princess Cut",
    desc: "Falling edge pavé halo engagement ring in 14K yellow gold with princess cut center diamond. Halo extends downward along the setting sides for maximum visual impact. 368 reviews. James Allen on Blue Nile.",
  },
];

for (const img of images) {
  try {
    const inputBuffer = img.local
      ? await readFile(img.local)
      : await fetchBuf(img.cdn);
    const destPath = path.join(OUT, img.dest);
    await sharp(inputBuffer)
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
    console.error(`❌ ${img.dest}: ${e.message}`);
  }
}
await exiftool.end();
console.log("\nAll done.");
