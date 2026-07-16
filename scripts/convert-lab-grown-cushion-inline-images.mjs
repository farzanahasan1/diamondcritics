import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const images = [
  {
    input: "/Users/mehedihasan/Downloads/lab-grown-cushion-certification-gap.png",
    output: "lab-grown-cushion-certification-gap.avif",
    title: "The Certification Gap: IGI vs GIA Lab Cushion Pricing",
    description: "Table comparing IGI vs GIA lab cushion cut diamond pricing at 1.5ct, 2ct, and 3ct — showing the gap that flips at 3ct D-VVS1 where GIA is actually cheaper by $253",
  },
  {
    input: "/Users/mehedihasan/Downloads/lab-grown-cushion-vs-natural-cushion.png",
    output: "lab-grown-cushion-vs-natural-cushion.avif",
    title: "Lab vs Natural Cushion Cut Diamond Price Comparison",
    description: "Side-by-side comparison of lab grown vs natural cushion cut diamond prices from 1.5ct to 4ct — lab savings range from 68% at 1.5ct to 91% at 4ct ($78,000+ saved)",
  },
  {
    input: "/Users/mehedihasan/Downloads/lab-grown-cushion-modified-brilliant-split.png",
    output: "lab-grown-cushion-modified-brilliant-split.avif",
    title: "The Modified Brilliant Split: Cushion Modified vs Cushion Brilliant",
    description: "Side-by-side comparison of cushion modified brilliant (crushed-ice, scattered sparkle, lower price) vs cushion brilliant (chunky facets, bold flashes, higher price) — the cert word that costs or saves $2,000",
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
