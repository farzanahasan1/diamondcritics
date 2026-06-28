import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { readFile } from "fs/promises";

const DL = "/Users/mehedihasan/Downloads";
const OUT = "/Users/mehedihasan/Desktop/diamondcritics/public/images";

const images = [
  {
    src: path.join(DL, "Princess-Diamond-Engagement-Ring-Guide.jpg"),
    dest: "princess-cut-diamond-engagement-ring-settings-featured.avif",
    title: "Princess Diamond Engagement Ring Guide — Best Settings, Metals & Picks 2026",
    desc: "Woman wearing princess cut diamond engagement ring with pavé band. Editorial guide to the best princess cut settings on Blue Nile — solitaire, pavé, halo, three-stone, and vintage ranked by review count and structural design.",
  },
  {
    src: path.join(DL, "Princess-Diamond-Engagement-Ring-Under-$10000.jpg"),
    dest: "princess-cut-diamond-ring-under-10000-featured.avif",
    title: "Princess Diamond Engagement Ring Under $10,000 — Luxury Tier Guide 2026",
    desc: "Woman wearing princess cut diamond engagement ring with pavé band. What a $10,000 budget unlocks for princess cut rings — luxury settings from $3,000 to $7,030 paired with G-VS1 center diamonds from Blue Nile.",
  },
];

for (const img of images) {
  try {
    const buf = await readFile(img.src);
    const destPath = path.join(OUT, img.dest);
    await sharp(buf)
      .resize(1500, 1000, { fit: "inside" })
      .avif({ quality: 82 })
      .toFile(destPath);
    await exiftool.write(destPath, {
      Title: img.title,
      Description: img.desc,
      Creator: "DiamondCritics",
      Copyright: "© 2026 DiamondCritics",
    }, ["-overwrite_original"]);
    const { size } = await import("fs").then(fs => fs.promises.stat(destPath));
    console.log(`✅ ${img.dest} — ${Math.round(size / 1024)}KB`);
  } catch (e) {
    console.error(`❌ ${img.dest}: ${e.message}`);
  }
}
await exiftool.end();
console.log("\nAll done.");
