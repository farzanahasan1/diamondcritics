import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/3ct-Cushion-Cut-Diamond-Ring-Guide.jpg";

const title = "3 Carat Cushion Cut Diamond Ring Guide";
const description = "3 carat cushion cut diamond ring — The Crushed Ice Trap and The Pillow Premium explained, natural from $32,692, lab from $5,962. Best settings and buying guide.";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "3-carat-cushion-cut-diamond-ring-featured.avif"));

await exiftool.write(path.join(imgDir, "3-carat-cushion-cut-diamond-ring-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ 3-carat-cushion-cut-diamond-ring-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "3-carat-cushion-cut-diamond-ring-featured.jpg"));

await exiftool.write(path.join(ogDir, "3-carat-cushion-cut-diamond-ring-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/3-carat-cushion-cut-diamond-ring-featured.jpg");

await exiftool.end();
console.log("Done.");
