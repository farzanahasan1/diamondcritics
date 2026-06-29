import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  { src: "14K White Gold Six Prong Knife Edged Solitaire Engagement Ring 1.jpeg", dest: "princess-cut-solitaire-ring-six-prong-white-gold.avif", title: "Princess Cut Solitaire Engagement Ring — 14K White Gold Six Prong Knife Edge", desc: "14K white gold six prong knife-edged solitaire engagement ring, compatible with princess cut V-tip modification.", mode: "inside" },
  { src: "14K White Gold East West Half Bezel Solitaire Engagement Ring 1.jpeg", dest: "princess-cut-bezel-solitaire-engagement-ring-white-gold.avif", title: "Princess Cut Half Bezel Solitaire — 14K White Gold East West Setting", desc: "East west half bezel solitaire engagement ring in 14k white gold for princess cut diamonds. Full bezel protects corners.", mode: "inside" },
  { src: "14K White Gold Claw Prong Solitaire Engagement Ring (Flush Fit) 2.jpeg", dest: "princess-cut-claw-prong-solitaire-flush-fit-2.avif", title: "Princess Cut Claw Prong Solitaire — 14K White Gold Flush Fit Side View", desc: "Side profile of 14K white gold claw prong solitaire engagement ring for princess cut diamond, flush fit band.", mode: "inside" },
  { src: "6 prong pave hidden halo three stone 1.jpeg", dest: "princess-cut-halo-hidden-three-stone.avif", title: "Princess Cut Hidden Halo Three Stone — 6 Prong Pavé Setting", desc: "Six prong pavé hidden halo three-stone engagement ring setting for princess cut center diamond.", mode: "inside" },
  { src: "6 prong pave hidden halo three stone 2.jpeg", dest: "princess-cut-halo-pave-three-stone-side.avif", title: "Princess Cut Pavé Halo Three Stone — Side View Setting Detail", desc: "Side view of six prong pavé hidden halo engagement ring setting for princess cut diamond.", mode: "inside" },
  { src: "Best-Cathedral-&-Hidden-Halo-Settings--$3,000+-Luxury-Guide.jpg", dest: "princess-cut-cathedral-hidden-halo-settings-guide.avif", title: "Princess Cut Cathedral & Hidden Halo Settings — $3,000+ Guide", desc: "Best cathedral and hidden halo engagement ring settings for princess cut diamonds at the $3,000+ tier.", mode: "contain" },
  { src: "Blue-Nile-Studio-Petite-French-Pavé-Crown-Diamond-Engagement-Ring-in-18k-Yellow-Gold.jpg", dest: "princess-cut-french-pave-crown-ring-18k-yellow-gold.avif", title: "Princess Cut French Pavé Crown Ring — Blue Nile Studio 18K Yellow Gold", desc: "Blue Nile Studio petite French pavé crown diamond engagement ring in 18K yellow gold, princess cut compatible.", mode: "inside" },
  { src: "Bella-Vaughan-Tapered-Baguette-Three-Stone-Engagement-Ring-In-14k-Rose.jpg", dest: "princess-cut-tapered-baguette-three-stone-rose-gold.avif", title: "Princess Cut Three Stone Baguette — Bella Vaughan 14K Rose Gold Tapered", desc: "Bella Vaughan tapered baguette three-stone engagement ring in 14K rose gold, princess cut center stone.", mode: "inside" },
  { src: "5-Best-Engagement-Ring-Settings-Under-$600-(Maximize-Stone-Budget).jpg", dest: "princess-cut-engagement-ring-settings-budget-guide.avif", title: "Princess Cut Engagement Ring Settings Under $600 — Budget Setting Guide", desc: "Best engagement ring settings under $600 for princess cut diamonds to maximize stone budget.", mode: "contain" },
  { src: "14K-White-Gold-2mm-Knife-Edge-Solitaire-Engagement-Ring.jpg", dest: "princess-cut-knife-edge-solitaire-2mm-white-gold.avif", title: "Princess Cut Knife Edge Solitaire — 14K White Gold 2mm Band", desc: "14K white gold 2mm knife edge solitaire engagement ring, modern slim band for princess cut diamond.", mode: "inside" },
  { src: "Blue Nile 2.01 ct H-VS1 Lab Diamond Princess Ring Price.jpg", dest: "2ct-princess-cut-lab-diamond-ring-h-vs1-blue-nile.avif", title: "2ct Lab Princess Cut Diamond Ring — Blue Nile H-VS1 Price Data", desc: "Blue Nile 2.01ct H-VS1 lab diamond princess cut engagement ring with price analysis.", mode: "contain" },
];

let done = 0, fail = 0;
for (const img of images) {
  try {
    const srcPath = path.join(DL, img.src);
    const destPath = path.join(OUT, img.dest);
    const pipeline = sharp(srcPath);
    if (img.mode === "inside") {
      pipeline.resize(1500, 1000, { fit: "inside" });
    } else {
      pipeline.resize(1500, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } });
    }
    await pipeline.avif({ quality: 82 }).toFile(destPath);
    await exiftool.write(destPath, {
      Title: img.title,
      Description: img.desc,
      Creator: "DiamondCritics",
      Copyright: "© 2026 DiamondCritics",
    }, ["-overwrite_original"]);
    const { size } = await import("fs").then(fs => fs.promises.stat(destPath));
    console.log(`✅ ${img.dest} — ${Math.round(size/1024)}KB`);
    done++;
  } catch (e) {
    console.error(`❌ ${img.src}: ${e.message}`);
    fail++;
  }
}
await exiftool.end();
console.log(`\nDone: ${done} converted, ${fail} failed.`);
