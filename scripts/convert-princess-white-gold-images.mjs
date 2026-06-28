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
    local: path.join(DL, "Princess-Diamond-Engagement-Ring-in-White-Gold.jpg"),
    dest: "princess-cut-white-gold-engagement-ring-featured.avif",
    title: "Princess Diamond Engagement Ring in White Gold — H-Color Floor Guide 2026",
    desc: "Princess cut diamond engagement ring in white gold with tapered baguette side stones on dark blue background. White gold rhodium plating reflects neutral light — H color acceptable where yellow gold requires G minimum.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504230/504230_M1_PRN_DIM_wht_0100CT_W_Box3_003_1600X1600.jpg",
    dest: "princess-cut-white-gold-solitaire-setting.avif",
    title: "Flush Fit Claw Prong Solitaire Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Flush fit claw prong solitaire engagement ring in 14K white gold with princess cut center diamond. Low-profile band, claw prongs grip all four 90° corners. 146 reviews on Blue Nile. James Allen.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/502480/502480_M1_PRN_DIM_wht_0100CT_W_Box6_003_1600X1600.jpg",
    dest: "princess-cut-white-gold-cross-prong-setting.avif",
    title: "Cross Prong Pavé Surprise Diamond Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Cross prong pavé set surprise diamond engagement ring in 14K white gold with princess cut center. X-prong head provides superior corner coverage. Surprise diamonds hidden in prong arms. James Allen. Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/503250/503250_M1_PRN_DIM_wht_0100CT_W_Box5_001_1600X1600.jpg",
    dest: "princess-cut-white-gold-three-stone-setting.avif",
    title: "Marquise Three Stone Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Marquise three stone engagement ring in 14K white gold with princess cut center and east-west marquise diamond side stones. 152 reviews. James Allen on Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505013/505013_M1_PRN_DIM_wht_0100CT_W_Box4_002_1600X1600.jpg",
    dest: "princess-cut-white-gold-riviera-pave-setting.avif",
    title: "Riviera Pavé Diamond Engagement Ring in 14K White Gold — Princess Cut (5/8 ct tw)",
    desc: "Riviera pavé diamond engagement ring in 14K white gold with princess cut center. 5/8 ct tw pavé diamonds set continuously around the full band. 89 reviews. Blue Nile.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/503390/503390_M1_PRN_DIM_wht_0100CT_W_Box8_004_1600X1600.jpg",
    dest: "princess-cut-white-gold-halo-setting.avif",
    title: "Round Split Band Diamond Halo Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Round split band diamond halo engagement ring in 14K white gold with princess cut center. Split band branches from head. 210 reviews — most reviewed halo in white gold on Blue Nile. James Allen.",
  },
  {
    cdn: "https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/502540/502540_M1_PRN_DIM_wht_0100CT_W_Box4_001_1600X1600.jpg",
    dest: "princess-cut-white-gold-baguette-setting.avif",
    title: "Escalating Baguette Side Stone Engagement Ring in 14K White Gold — Princess Cut",
    desc: "Escalating baguette side stone engagement ring in 14K white gold with princess cut center. Ascending baguette-cut diamonds increase in size toward center. Step-cut baguettes complement princess cut faceting. James Allen. Blue Nile.",
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
