import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  // Post 11
  { src: "Blue-Nile-Studio-Petite-French-Pavé-Crown-Diamond-Engagement-Ring-in-18k-Yellow-Gold.jpg", dest: "1-carat-princess-cut-diamond-engagement-ring-featured.avif", title: "1 Carat Princess Cut Diamond Engagement Ring — French Pavé 18k Yellow Gold", desc: "Blue Nile French Pavé Crown princess cut diamond engagement ring in 18k yellow gold. Setting price $2,140.", mode: "inside" },
  { src: "Blue Nile Knife Edge Lotus Bridge Platinum Setting Details.jpg", dest: "1-carat-princess-cut-ring-knife-edge-platinum.avif", title: "1 Carat Princess Cut Ring — Knife Edge Lotus Bridge Platinum Setting Detail", desc: "Blue Nile platinum knife edge lotus bridge setting for princess cut diamond engagement ring.", mode: "contain" },
  // Post 12
  { src: "Blue Nile 2ct H-VS1 Princess Cut Engagement Ring Final Price.jpg", dest: "2-carat-princess-cut-diamond-engagement-ring-featured.avif", title: "2 Carat Princess Cut Diamond Engagement Ring — GIA H-VS1 Blue Nile 2026", desc: "Blue Nile 2ct H-VS1 GIA princess cut diamond engagement ring. Live price data 2026.", mode: "inside" },
  { src: "2-carat-princess-cut-ring-james-allen-vs-blue-nile.jpg", dest: "2-carat-princess-cut-ring-james-allen-vs-blue-nile.avif", title: "2 Carat Princess Cut Ring: James Allen vs Blue Nile Price Comparison", desc: "Side-by-side 2ct princess cut diamond ring comparison between James Allen and Blue Nile, price and quality.", mode: "contain" },
  // Post 13
  { src: "BLUE-NILE-RING-SETTING-25-PARCENT-OFF-DEAL.jpg", dest: "princess-cut-diamond-engagement-ring-settings-featured.avif", title: "Princess Cut Diamond Engagement Ring Settings — Blue Nile 2026", desc: "Blue Nile engagement ring settings for princess cut diamonds. Solitaire, pavé, halo styles with pricing.", mode: "inside" },
  { src: "Blue Nile Engagement Rings Price Audit 2026 Real Data & Savings Tips.png", dest: "princess-cut-engagement-ring-price-audit-2026.avif", title: "Princess Cut Engagement Ring Price Audit 2026 — Real Blue Nile Data", desc: "2026 Blue Nile engagement ring price audit with real data and savings tips for princess cut diamonds.", mode: "contain" },
  // Post 14
  { src: "14K White Gold Claw Prong Solitaire Engagement Ring (Flush Fit) 1.jpeg", dest: "princess-cut-solitaire-engagement-ring-featured.avif", title: "Princess Cut Solitaire Engagement Ring — 14K White Gold Claw Prong", desc: "14K white gold claw prong solitaire engagement ring for princess cut diamond. V-prong corner protection shown.", mode: "inside" },
  { src: "Blue Nile Oval 1.5 CT Petite Solitaire ($2,230).png", dest: "princess-cut-solitaire-engagement-ring-petite-platinum.avif", title: "Petite Solitaire Engagement Ring — Blue Nile Platinum Setting", desc: "Blue Nile petite solitaire platinum setting for princess cut diamond. Starting at $1,330.", mode: "contain" },
  // Post 15
  { src: "Blue Nile Studio Double Halo Gala Diamond Engagement Ring in Platinum (7:8 ct. tw.).png", dest: "princess-cut-halo-engagement-ring-featured.avif", title: "Princess Cut Halo Engagement Ring — Blue Nile Studio Double Halo Platinum", desc: "Blue Nile Studio Double Halo Gala diamond engagement ring in platinum 7/8 ct. tw. for princess cut.", mode: "inside" },
  { src: "14K White Gold Pavé Halo And Shank Diamond Engagement Ring (Round Center).jpeg", dest: "princess-cut-halo-engagement-ring-pave-white-gold.avif", title: "Princess Cut Halo Engagement Ring — 14K White Gold Pavé Halo and Shank", desc: "14K white gold pavé halo and shank diamond engagement ring. Round halo framing creates buyer trap warning.", mode: "contain" },
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
