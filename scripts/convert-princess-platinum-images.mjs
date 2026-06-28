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
    local: path.join(DL, "Princess-Diamond-Engagement-Ring-in-Platinum.jpg"),
    dest: "princess-cut-platinum-engagement-ring-featured.avif",
    title: "Princess Diamond Engagement Ring in Platinum — V-Prong Corner Safety Guide 2026",
    desc: "Princess cut diamond engagement ring in platinum with four-prong solitaire setting on cream background. Platinum work-hardens rather than thinning — V-prongs maintain corner grip mass over decades, unlike gold prongs that lose metal through wear.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504700/504700_M1_PRN_DIM_wht_0100CT_W_Box3_003_1600X1600.jpg",
    dest: "princess-cut-platinum-solitaire-setting.avif",
    title: "Comfort Fit Solitaire Engagement Ring in Platinum by James Allen — Princess Cut",
    desc: "Comfort fit solitaire engagement ring in platinum with princess cut center diamond. Domed interior band, four-prong V-grip on all corners. 1,107 reviews — most-reviewed princess cut platinum solitaire on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505096/505096_M1_PRN_DIM_wht_0100CT_W_Box4_001_1600X1600.jpg",
    dest: "princess-cut-platinum-vintage-setting.avif",
    title: "Beaded Filigree Cathedral Kite-Set Vintage Style Engagement Ring in Platinum by James Allen — Princess Cut",
    desc: "Beaded filigree cathedral kite-set vintage style engagement ring in platinum with princess cut center. Beaded metalwork, open filigree cathedral shoulders, kite-set accent diamonds. 57 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/501400/501400_M1_PRN_DIM_wht_0100CT_W_Box6_002_1600X1600.jpg",
    dest: "princess-cut-platinum-three-stone-setting.avif",
    title: "Marquise Cut Diamond Three Stone Engagement Ring in Platinum by James Allen — Princess Cut",
    desc: "Marquise cut diamond three stone engagement ring in platinum with princess cut center and east-west marquise side stones. 152 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/502760/502760_M1_PRN_DIM_wht_0100CT_W_Box4_002_1600X1600.jpg",
    dest: "princess-cut-platinum-riviera-pave-setting.avif",
    title: "Riviera Pavé Lab-Grown Diamond Engagement Ring in Platinum by James Allen — Princess Cut",
    desc: "Riviera pavé engagement ring in platinum with princess cut center and 1/6 ct tw lab-grown diamond pavé band. 390 reviews — second most-reviewed setting in this guide. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505010/505010_M1_PRN_DIM_wht_0100CT_W_Box4_004_1600X1600.jpg",
    dest: "princess-cut-platinum-pave-lotus-setting.avif",
    title: "Pavé Knife Edge Lotus Basket Diamond Engagement Ring in Platinum by James Allen — Princess Cut",
    desc: "Pavé knife edge lotus basket diamond engagement ring in platinum with princess cut center. Knife-edge shank, lotus basket beneath center, pavé along band. 251 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505106/505106_M1_PRN_DIM_wht_0100CT_W_Box4_002_1600X1600.jpg",
    dest: "princess-cut-platinum-crown-halo-setting.avif",
    title: "Crown Pavé Hidden Halo Diamond Engagement Ring in Platinum by James Allen — Princess Cut",
    desc: "Crown pavé hidden halo diamond engagement ring in platinum with princess cut center. Pavé-set prong crown, hidden halo beneath. 26 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/505055/505055_M1_PRN_DIM_wht_0100CT_W_Box2_003_1600X1600.jpg",
    dest: "princess-cut-platinum-wide-band-setting.avif",
    title: "Wide Band Solitaire Engagement Ring in Platinum 5mm — Princess Cut",
    desc: "Wide band solitaire engagement ring in platinum with princess cut center. 5mm band width provides structural mass at head junction. 49 reviews on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501580/501580_M1_PRN_DIM_wht_0100CT_W_Box5_004_1600X1600.jpg",
    dest: "princess-cut-platinum-statement-halo-setting.avif",
    title: "French Pavé Diamond Halo Engagement Ring in Platinum — Princess Cut (1/2 ct tw)",
    desc: "French pavé diamond halo engagement ring in platinum with princess cut center. V-cut notches between pavé diamonds maximize light entry. 1/2 ct tw accent diamonds. 14 reviews on Blue Nile.",
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
