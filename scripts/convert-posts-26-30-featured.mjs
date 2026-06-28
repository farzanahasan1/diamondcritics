import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { readFile } from "fs/promises";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: path.join(DL, "How-to-Buy-Princess-Cut-Diamond-Guide.png"),
    dest: "how-to-buy-princess-cut-diamond-featured.avif",
    title: "How to Buy a Princess Cut Diamond — The Complete 2026 Guide",
    desc: "Woman's hand resting on cream linen wearing a princess cut diamond solitaire in platinum. Editorial guide covering all 6 princess cut buying traps: proportions, cut quality, color, clarity, setting, and budget allocation.",
  },
  {
    src: path.join(DL, "Princess-Cut-Diamond-Cut-Quality-Guide.png"),
    dest: "princess-cut-diamond-cut-quality-guide-featured.avif",
    title: "Princess Cut Diamond Cut Quality Guide — No GIA Excellent Exists 2026",
    desc: "GIA diamond certificate showing Cut Grade field as 'Not Graded' alongside a face-up princess cut diamond. GIA does not grade princess cut cut quality — what to evaluate instead: table %, depth %, polish, and symmetry.",
  },
  {
    src: path.join(DL, "Princess-Cut-Diamond-Clarity-Guide.png"),
    dest: "princess-cut-diamond-clarity-guide-featured.avif",
    title: "Princess Cut Diamond Clarity Guide — Corner Clarity Trap, VS1 True Minimum 2026",
    desc: "Face-up princess cut diamond with four corners highlighted in red, showing the corner clarity concentration zones. VS1 is the true minimum — corners concentrate inclusions due to the chevron facet pattern.",
  },
  {
    src: path.join(DL, "Princess-Cut-Diamond-Color-Guide.png"),
    dest: "princess-cut-diamond-color-guide-featured.avif",
    title: "Princess Cut Diamond Color Guide — Corner Color Trap, G vs H by Metal 2026",
    desc: "Princess cut diamond in yellow gold prongs beside a D-to-J color grade scale. Corner color concentration guide: G minimum in white metal, H acceptable in warm metal. Face-up color appearance by grade.",
  },
  {
    src: path.join(DL, "Princess-Cut-Diamond-Ideal-Proportions.png"),
    dest: "princess-cut-diamond-ideal-proportions-featured.avif",
    title: "Princess Cut Diamond Ideal Proportions — Table 68-72%, Depth 65-70%, L:W 1.00-1.02",
    desc: "Technical line diagram of princess cut diamond showing table 68-72%, depth 65-70%, and L:W ratio 1.00-1.02. The ideal proportion window for maximum brilliance and fire in a princess cut diamond.",
  },
];

for (const img of images) {
  try {
    const buf = await readFile(img.src);
    const destPath = path.join(OUT, img.dest);
    await sharp(buf)
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
    console.log(`✅ ${img.dest} — ${Math.round(size / 1024)}KB`);
  } catch (e) {
    console.error(`❌ ${img.dest}: ${e.message}`);
  }
}
await exiftool.end();
console.log("\nAll done.");
