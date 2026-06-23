import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    input: path.join(imgDir, "Round-Diamond-VS1-vs-VS2.jpg"),
    output: path.join(imgDir, "round-diamond-vs1-vs-vs2-featured.avif"),
    title: "Round Diamond VS1 vs VS2 Clarity Guide",
    description: "Round diamond VS1 versus VS2 clarity comparison guide showing The VS Split concept with real Blue Nile pricing from $3,230 on white editorial background",
  },
  {
    input: path.join(imgDir, "2-Carat-vs-3-Carat-Round-Diamond.jpg"),
    output: path.join(imgDir, "round-diamond-2-carat-vs-3-carat-featured.avif"),
    title: "2 Carat vs 3 Carat Round Diamond Guide",
    description: "2 carat versus 3 carat round diamond comparison showing The Luxury Jump Tax concept with 196% price increase for 35% more face-up area on white editorial background",
  },
  {
    input: path.join(imgDir, "F-vs-G-Color-Round-Diamond.jpg"),
    output: path.join(imgDir, "round-diamond-f-vs-g-color-featured.avif"),
    title: "F vs G Color Round Diamond Comparison",
    description: "F color versus G color round diamond buying guide showing The Colorless Entry Tax concept with real Blue Nile pricing across 1ct through 3ct on white editorial background",
  },
  {
    input: path.join(imgDir, "Round-Diamond-Solitaire-Ring.jpg"),
    output: path.join(imgDir, "round-diamond-solitaire-ring-featured.avif"),
    title: "Round Diamond Solitaire Ring Buying Guide",
    description: "Round diamond solitaire ring buying guide showing The Solitaire Standard concept with 4-prong versus 6-prong settings and budget matrix on white editorial background",
  },
  {
    input: path.join(imgDir, "Round-Diamond-vs-Moissanite.jpg"),
    output: path.join(imgDir, "round-diamond-vs-moissanite-featured.avif"),
    title: "Round Diamond vs Moissanite Comparison Guide",
    description: "Round diamond versus moissanite comparison guide showing The Carbon Copy Question concept with chemical formula difference SiC versus C and real pricing data on white editorial background",
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
