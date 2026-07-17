import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/4ct-Cushion-Cut-Diamond-Ring-Guide.jpg";

const title = "4 Carat Cushion Cut Diamond Ring Guide";
const description = "4 carat cushion cut diamond ring — The Empty Tier and The Pillow Premium explained, only 3 natural stones from $85,685, lab from $7,412. Complete buying guide.";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "4-carat-cushion-cut-diamond-ring-featured.avif"));

await exiftool.write(path.join(imgDir, "4-carat-cushion-cut-diamond-ring-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ 4-carat-cushion-cut-diamond-ring-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "4-carat-cushion-cut-diamond-ring-featured.jpg"));

await exiftool.write(path.join(ogDir, "4-carat-cushion-cut-diamond-ring-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/4-carat-cushion-cut-diamond-ring-featured.jpg");

await exiftool.end();
console.log("Done.");
