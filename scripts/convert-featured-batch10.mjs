import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    input: path.join(imgDir, "8-Carat-Round-Diamond-Price.jpg"),
    output: path.join(imgDir, "8-carat-round-diamond-price-featured.avif"),
    title: "8 Carat Round Diamond Price Guide",
    description: "8 carat round diamond price guide showing ultra-rare tier natural diamonds starting at $329,500 on white editorial background",
  },
  {
    input: path.join(imgDir, "Best-Round-Diamond-Under-$10,000.jpg"),
    output: path.join(imgDir, "round-diamond-under-10000-featured.avif"),
    title: "Best Round Diamond Under $10,000 Buying Guide",
    description: "Best round diamond under $10,000 buying guide comparing natural 1ct GIA Excellent with lab-grown 4ct D-VVS1 on white editorial background",
  },
  {
    input: path.join(imgDir, "1-Carat-vs-2-Carat-Round-Diamond.jpg"),
    output: path.join(imgDir, "round-diamond-1-carat-vs-2-carat-featured.avif"),
    title: "1 Carat vs 2 Carat Round Diamond Comparison",
    description: "1 carat versus 2 carat round diamond face-up size and price comparison showing Size Jump Tax on white editorial background",
  },
  {
    input: path.join(imgDir, "D-Color-vs-G-Color-Round-Diamond.jpg"),
    output: path.join(imgDir, "round-diamond-d-color-vs-g-color-featured.avif"),
    title: "D Color vs G Color Round Diamond Guide",
    description: "D color versus G color round diamond comparison showing Colorless Premium price difference on white editorial background",
  },
  {
    input: path.join(imgDir, "VVS-vs-VS2-Round-Diamond.jpg"),
    output: path.join(imgDir, "round-diamond-vvs-vs-vs2-featured.avif"),
    title: "VVS vs VS2 Round Diamond Clarity Guide",
    description: "VVS versus VS2 round diamond clarity comparison showing Invisible Clarity Tax price premium on white editorial background",
  },
];

for (const job of jobs) {
  try {
    await sharp(job.input)
      .resize(1500, 1000, { fit: "cover", position: "centre" })
      .avif({ quality: 82 })
      .toFile(job.output);

    await exiftool.write(job.output, {
      Title: job.title,
      Description: job.description,
      Creator: "DiamondCritics",
      Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
    });

    console.log(`✓ ${path.basename(job.output)}`);
  } catch (err) {
    console.error(`✗ ${path.basename(job.output)}: ${err.message}`);
  }
}

await exiftool.end();
console.log("Done.");
