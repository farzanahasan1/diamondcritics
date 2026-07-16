import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/Old-Mine--Cut-Cushion-Diamond-Guide.jpg";

const title = "Old Mine Cushion Cut Diamond Guide";
const description = "Old mine cushion cut diamond guide showing The Old Mine Window and The Estate Premium concepts with a three-stone antique cushion ring in yellow gold featuring a natural fancy yellow old mine cut center stone";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "old-mine-cushion-cut-diamond-featured.avif"));

await exiftool.write(path.join(imgDir, "old-mine-cushion-cut-diamond-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ old-mine-cushion-cut-diamond-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "old-mine-cushion-cut-diamond-featured.jpg"));

await exiftool.write(path.join(ogDir, "old-mine-cushion-cut-diamond-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/old-mine-cushion-cut-diamond-featured.jpg");

await exiftool.end();
console.log("Done.");
