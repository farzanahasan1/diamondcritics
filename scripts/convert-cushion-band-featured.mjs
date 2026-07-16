import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/Cushion-Cut-Diamond-Band-Guide.jpg";

const title = "Cushion Cut Diamond Band Guide";
const description = "Cushion cut diamond band guide showing The Band Gap concept with seven-stone, full eternity, and bezel cushion bands in rose gold, white gold, and yellow gold metals";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "cushion-cut-diamond-band-featured.avif"));

await exiftool.write(path.join(imgDir, "cushion-cut-diamond-band-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ cushion-cut-diamond-band-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "cushion-cut-diamond-band-featured.jpg"));

await exiftool.write(path.join(ogDir, "cushion-cut-diamond-band-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/cushion-cut-diamond-band-featured.jpg");

await exiftool.end();
console.log("Done.");
