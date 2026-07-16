import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/Lab-Grown-Cushion-Cut-Diamond.jpg";

const title = "Lab Grown Cushion Cut Diamond Guide";
const description = "Lab grown cushion cut diamond complete guide — The Modified Brilliant Split and The Certification Gap with IGI vs GIA pricing, lab vs natural comparison, and buying recommendations from 1.5ct to 4ct";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "lab-grown-cushion-cut-diamond-featured.avif"));

await exiftool.write(path.join(imgDir, "lab-grown-cushion-cut-diamond-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ lab-grown-cushion-cut-diamond-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "lab-grown-cushion-cut-diamond-featured.jpg"));

await exiftool.write(path.join(ogDir, "lab-grown-cushion-cut-diamond-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/lab-grown-cushion-cut-diamond-featured.jpg");

await exiftool.end();
console.log("Done.");
