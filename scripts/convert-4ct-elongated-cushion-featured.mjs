import sharp from "sharp";
import { exiftool } from "exiftool-vendored";

const imgDir = "/Users/mehedihasan/Projects/diamondcritics/public/images";
const ogDir = imgDir + "/og";
const input = "/Users/mehedihasan/Downloads/4-Carat-Elongated-Cushion-Cut-Diamond-Ring.jpg";
const title = "4 Carat Elongated Cushion Cut Diamond Ring Complete Guide";
const description = "4 carat elongated cushion cut diamond ring — The Empty Tier explained. Lab from $5,800, natural from $33,000. Best 4ct builds and settings.";

await sharp(input)
  .resize(1500, 1000, { fit: "cover", position: "centre" })
  .avif({ quality: 82 })
  .toFile(imgDir + "/4-carat-elongated-cushion-cut-diamond-ring-featured.avif");

await exiftool.write(imgDir + "/4-carat-elongated-cushion-cut-diamond-ring-featured.avif", {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});
console.log("✓ 4-carat-elongated-cushion-cut-diamond-ring-featured.avif");

await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85 })
  .toFile(ogDir + "/4-carat-elongated-cushion-cut-diamond-ring-featured.jpg");

await exiftool.write(ogDir + "/4-carat-elongated-cushion-cut-diamond-ring-featured.jpg", {
  Title: title,
  Description: description,
  Creator: "DiamondCritics",
  Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
});
console.log("✓ og/4-carat-elongated-cushion-cut-diamond-ring-featured.jpg");

await exiftool.end();
console.log("Done.");
