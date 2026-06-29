import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  // --- HALO POST ---
  {
    src: "503511_M1_PRN_DIM_wht_0100CT_R_Box4_004_1600X1600.jpg",
    dest: "princess-cut-halo-engagement-ring-pave-white-gold.avif",
    title: "Classic Halo Diamond Ring in 14K Rose Gold — Princess Cut Center",
    desc: "Classic halo engagement ring setting in 14K rose gold with princess cut center diamond. Square halo frames the princess cut. Blue Nile item 146204.",
  },
  {
    src: "503511_M1_PRN_DIM_wht_0100CT_R_Box4_004_1600X1600.jpg",
    dest: "princess-cut-double-halo-gala-rose-gold.avif",
    title: "Blue Nile Studio Double Halo Gala Ring — Princess Cut in Rose Gold",
    desc: "Blue Nile Studio Double Halo Gala diamond engagement ring in 14K rose gold with princess cut center. Premium double halo at $5,985.",
  },
  {
    src: "6 prong pave hidden halo three stone 1.jpeg",
    dest: "princess-cut-halo-hidden-three-stone.avif",
    title: "Petite Hidden Halo Solitaire Plus — Yellow Gold Princess Cut Setting",
    desc: "Petite hidden halo solitaire plus diamond engagement ring in 14K yellow gold with princess cut center. Hidden halo preserves square geometry. $1,255 on Blue Nile.",
  },

  // --- SOLITAIRE POST ---
  {
    src: "500130_M1_PRN_DIM_wht_0100CT_W_006_1600X1600.jpg",
    dest: "princess-cut-claw-prong-solitaire-flush-fit-2.avif",
    title: "Classic Four Prong Solitaire in White Gold — Princess Cut Side View",
    desc: "Classic four prong solitaire engagement ring in white gold with princess cut diamond. V-prong on all four corners. Standard princess cut setting.",
  },
  {
    src: "17471_M1_PRN_DIM_wht_0100CT_Y_004_1600X1600.jpg",
    dest: "princess-cut-solitaire-engagement-ring-petite-platinum.avif",
    title: "Petite Solitaire Engagement Ring — Princess Cut Diamond",
    desc: "Petite solitaire engagement ring with princess cut diamond. Slim band profile. Blue Nile petite solitaire setting with princess cut center stone.",
  },
  {
    src: "14K White Gold Six Prong Knife Edged Solitaire Engagement Ring 1.jpeg",
    dest: "princess-cut-solitaire-ring-six-prong-white-gold.avif",
    title: "Six Prong Knife Edge Solitaire — Wrong Setting for Princess Cut",
    desc: "Six prong knife edge solitaire in 14K white gold. Six round prong heads are designed for round brilliant cuts, not princess cuts. Do not use this style for princess cut diamonds.",
  },

  // --- 2CT POST ---
  {
    src: "2-carat-princess-cut-ring-james-allen-vs-blue-nile.jpg",
    dest: "2-carat-princess-cut-ring-james-allen-vs-blue-nile.avif",
    title: "2 Carat Princess Cut Engagement Ring — James Allen vs Blue Nile",
    desc: "2 carat princess cut diamond engagement ring price comparison between James Allen and Blue Nile. Both offer GIA-certified stones from $12,229.",
  },
  {
    src: "Blue Nile 2ct H-VS1 Princess Cut Engagement Ring Final Price.jpg",
    dest: "2ct-princess-cut-lab-diamond-ring-h-vs1-blue-nile.avif",
    title: "Blue Nile 2ct H-VS1 Princess Cut Engagement Ring Price",
    desc: "Blue Nile 2 carat H-VS1 princess cut lab diamond engagement ring final price breakdown. Lab-grown 2ct princess cut from $2,000 vs natural from $12,229.",
  },
  {
    src: "17471_M1_PRN_DIM_wht_0100CT_Y_006_1600X1600.jpg",
    dest: "princess-cut-four-prong-platinum-solitaire.avif",
    title: "Classic Four Prong Solitaire in Platinum — Standard Princess Cut Setting",
    desc: "Classic four prong solitaire engagement ring in platinum with princess cut diamond. V-prong corners protect the four vulnerable tips. $1,180 on Blue Nile.",
  },

  // --- SETTINGS POST ---
  {
    src: "French Pavé 2 Carat Princess Cut Diamond Engagement Ring in Platinum with F-VVS1 Diamond.jpg",
    dest: "princess-cut-french-pave-crown-ring-18k-yellow-gold.avif",
    title: "French Pavé Princess Cut Diamond Engagement Ring — Platinum Setting",
    desc: "French pavé diamond engagement ring with princess cut center diamond. French pavé band with 1/4 ct tw side diamonds. Blue Nile Studio Petite French Pavé Crown.",
  },
  {
    src: "princess-cut-diamond-rings-on-white-background.jpg",
    dest: "princess-cut-engagement-ring-settings-budget-guide.avif",
    title: "Princess Cut Engagement Ring Settings — Budget Guide",
    desc: "Princess cut engagement ring settings collection. All settings from $790 to $1,635 on Blue Nile. Budget guide covering solitaire, pavé, halo, and three-stone options.",
  },
  {
    src: "Tapered Baguette 2 Carat Princess Cut Diamond Engagement Ring.jpg",
    dest: "princess-cut-tapered-baguette-three-stone-rose-gold.avif",
    title: "Tapered Baguette Three Stone — Princess Cut Diamond Engagement Ring",
    desc: "Tapered baguette three stone engagement ring with princess cut center diamond. Bella Vaughan for Blue Nile tapered baguette three stone in 14K rose gold.",
  },
  {
    src: "Best-Cathedral-&-Hidden-Halo-Settings--$3,000+-Luxury-Guide.jpg",
    dest: "princess-cut-cathedral-hidden-halo-settings-guide.avif",
    title: "Best Cathedral & Hidden Halo Settings — $3,000+ Luxury Guide",
    desc: "Best cathedral and hidden halo engagement ring settings guide. Premium princess cut settings from $3,000 on Blue Nile. Cathedral, hidden halo, double halo options.",
  },

  // --- 1CT POST ---
  {
    src: "James Allen Knife Edge Solitaire Platinum Setting Details.jpg",
    dest: "1-carat-princess-cut-ring-knife-edge-platinum.avif",
    title: "Knife Edge Solitaire Platinum Setting Detail — Princess Cut",
    desc: "Knife edge solitaire engagement ring setting detail in platinum. Clean V-shaped band profile. Setting detail for princess cut diamond engagement ring.",
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
