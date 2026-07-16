import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const images = [
  {
    input: "/Users/mehedihasan/Downloads/Old Mine vs Modern Cushion comparison.png",
    output: "old-mine-cushion-vs-modern-cushion.avif",
    title: "Old Mine Cut vs Modern Cushion Head-to-Head Comparison",
    description: "Side-by-side comparison of old mine cut diamond versus modern cushion modified brilliant showing scorecard, performance differences, and price data across 1ct and 2ct",
  },
  {
    input: "/Users/mehedihasan/Downloads/The Old Mine Window.png",
    output: "old-mine-cut-diamond-proportions.avif",
    title: "The Old Mine Window: Why Antique Diamonds Look Different",
    description: "Diagram showing old mine cut diamond proportions versus modern cushion brilliant — crown height, table size, culet, and facet count differences with performance comparison",
  },
  {
    input: "/Users/mehedihasan/Downloads/The Estate Premium.png",
    output: "old-mine-cut-estate-premium.avif",
    title: "The Estate Premium: What You Pay for an Old Mine Cut Diamond",
    description: "Infographic showing The Estate Premium — old mine cut estate pricing versus modern cushion Blue Nile pricing across 0.75ct to 3ct with premium percentages and buying sources",
  },
];

for (const img of images) {
  await sharp(img.input)
    .resize(1500, 1000, { fit: "cover", position: "centre" })
    .avif({ quality: 82 })
    .toFile(path.join(imgDir, img.output));

  await exiftool.write(path.join(imgDir, img.output), {
    Title: img.title,
    Description: img.description,
    Creator: "DiamondCritics",
    Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
  });

  console.log(`✓ ${img.output}`);
}

await exiftool.end();
console.log("Done.");
