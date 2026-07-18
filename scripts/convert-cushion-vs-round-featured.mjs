import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");
const ogDir = path.join(imgDir, "og");

const input = "/Users/mehedihasan/Downloads/Cushion-vs-Round-Cut--Diamond.jpg";

const title = "Cushion Cut vs Round Diamond Guide";
const description = "Cushion cut vs round diamond complete comparison — The Brilliance Gap and The Pillow Premium explained, price head-to-head at 1ct and 2ct, sparkle differences, face-up size, and which to choose";

// AVIF 1500x1000
await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(path.join(imgDir, "cushion-cut-vs-round-diamond-featured.avif"));

await exiftool.write(path.join(imgDir, "cushion-cut-vs-round-diamond-featured.avif"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ cushion-cut-vs-round-diamond-featured.avif");

// OG JPEG 1200x630
await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(path.join(ogDir, "cushion-cut-vs-round-diamond-featured.jpg"));

await exiftool.write(path.join(ogDir, "cushion-cut-vs-round-diamond-featured.jpg"), {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});

console.log("✓ og/cushion-cut-vs-round-diamond-featured.jpg");

await exiftool.end();
console.log("Done.");
