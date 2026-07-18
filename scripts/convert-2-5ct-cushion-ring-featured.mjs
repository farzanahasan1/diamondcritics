import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/2.5ct-Cushion-Cut-Diamond-Ring-Guide.jpg";

const title = "2.5 Carat Cushion Cut Diamond Ring Guide";
const description = "2.5 carat cushion cut diamond ring complete guide — The Crushed Ice Trap and The Pillow Premium explained, natural from $19,375, lab pricing, best settings, and the 2.5ct vs 3ct decision from Blue Nile";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "2-5-carat-cushion-cut-diamond-ring-featured.avif"));

await exiftool.write(path.join(imgDir, "2-5-carat-cushion-cut-diamond-ring-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ 2-5-carat-cushion-cut-diamond-ring-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "2-5-carat-cushion-cut-diamond-ring-featured.jpg"));

await exiftool.write(path.join(ogDir, "2-5-carat-cushion-cut-diamond-ring-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/2-5-carat-cushion-cut-diamond-ring-featured.jpg");

await exiftool.end();
console.log("Done.");
