import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/Cushion-vs-Radiant-Cut-Diamond-feature-image.jpg";

const title = "Cushion Cut vs Radiant Cut Diamond Guide";
const description = "Cushion cut vs radiant cut diamond complete comparison — The Corner Question and The Elongation Divide explained, price head-to-head, sparkle differences, and which to choose for your engagement ring";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "cushion-cut-vs-radiant-cut-diamond-featured.avif"));

await exiftool.write(path.join(imgDir, "cushion-cut-vs-radiant-cut-diamond-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ cushion-cut-vs-radiant-cut-diamond-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "cushion-cut-vs-radiant-cut-diamond-featured.jpg"));

await exiftool.write(path.join(ogDir, "cushion-cut-vs-radiant-cut-diamond-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/cushion-cut-vs-radiant-cut-diamond-featured.jpg");

await exiftool.end();
console.log("Done.");
