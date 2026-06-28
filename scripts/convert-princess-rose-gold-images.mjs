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
    local: path.join(DL, "Princess-Diamond-Engagement-Ring-in-Rose-Gold.jpg"),
    dest: "princess-cut-rose-gold-engagement-ring-featured.avif",
    title: "Princess Diamond Engagement Ring in Rose Gold — G-Color Minimum Guide 2026",
    desc: "Princess cut diamond engagement ring in rose gold with ornate floral halo. Rose gold copper alloy adds pink warmth to princess cut corners — G color is the minimum safe grade for this combination.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/503350/503350_M1_PRN_DIM_wht_0100CT_R_Box5_004_1600X1600.jpg",
    dest: "princess-cut-rose-gold-entry-setting.avif",
    title: "Classic Comfort Fit Solitaire Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "Classic comfort fit solitaire engagement ring in 14K rose gold with princess cut center diamond. 2.5mm domed interior band. 191 reviews. Most-reviewed rose gold princess cut solitaire on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/502481/502481_M1_PRN_DIM_wht_0100CT_R_Box4_004_1600X1600.jpg",
    dest: "princess-cut-rose-gold-side-stone-setting.avif",
    title: "East-West Sidestone and Pavé Diamond Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "East-west sidestone and pavé diamond engagement ring in 14K rose gold with princess cut center. Side stones set perpendicular to band. 1/4 ct tw pavé accents. 19 reviews. Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/502591/502591_M1_PRN_DIM_wht_0100CT_R_Box3_004_1600X1600.jpg",
    dest: "princess-cut-rose-gold-halo-setting.avif",
    title: "Pavé Diamond Halo Cathedral Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "Pavé diamond halo cathedral engagement ring in 14K rose gold with princess cut center diamond. Cathedral arch elevation with full pavé halo. 102 reviews — highest reviewed halo in rose gold on Blue Nile. James Allen.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505013/505013_M1_PRN_DIM_wht_0100CT_R_Box8_003_1600X1600.jpg",
    dest: "princess-cut-rose-gold-gallery-setting.avif",
    title: "Gallery Collection Cathedral Pavé Diamond Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "Gallery Collection cathedral pavé diamond engagement ring in 14K rose gold with princess cut center. Premium Gallery Collection tier. 5/8 ct tw pavé across cathedral arch and band. Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504992/504992_M1_PRN_DIM_wht_0100CT_R_Box3_003_1600X1600.jpg",
    dest: "princess-cut-rose-gold-statement-setting.avif",
    title: "Gallery Collection Rolled Micropavé Diamond Engagement Ring in 14K Rose Gold — Princess Cut",
    desc: "Gallery Collection rolled micropavé diamond engagement ring in 14K rose gold with princess cut center. Diamonds roll over band edge — visible from sides and above. 3/8 ct tw micropavé. Blue Nile.",
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
