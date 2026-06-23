import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    input: path.join(imgDir, "1-Carat-Diamond-Engagement-Ring.jpg"),
    output: path.join(imgDir, "1-carat-diamond-engagement-ring-featured.avif"),
    title: "1 Carat Diamond Engagement Ring Guide",
    description: "1 carat round diamond engagement ring buying guide showing GIA Excellent G-VS2 at $3,230 as the 1ct Sweet Spot with grade ladder and setting options on white editorial background",
  },
  {
    input: path.join(imgDir, "2-Carat-Diamond-Engagement-Ring.jpg"),
    output: path.join(imgDir, "2-carat-diamond-engagement-ring-featured.avif"),
    title: "2 Carat Diamond Engagement Ring Guide",
    description: "2 carat round diamond engagement ring guide showing natural G-VS2 at $16,490 versus lab D-VVS1 at $2,810 with The 2ct Commitment framework and setting options on white editorial background",
  },
  {
    input: path.join(imgDir, "3-Carat-Diamond-Engagement-Ring.jpg"),
    output: path.join(imgDir, "3-carat-diamond-engagement-ring-featured.avif"),
    title: "3 Carat Diamond Engagement Ring Guide",
    description: "3 carat round diamond engagement ring guide showing natural G-VS2 at $48,780 versus lab E-VVS1 at $5,800 with The 3ct Statement concept and solitaire setting recommendation on white editorial background",
  },
  {
    input: path.join(imgDir, "Round-Diamond-Engagement-Ring-Under-$3,000.jpg"),
    output: path.join(imgDir, "round-diamond-engagement-ring-under-3000-featured.avif"),
    title: "Round Diamond Engagement Ring Under $3,000 Guide",
    description: "Round diamond engagement ring under $3,000 guide showing lab 2ct D-VVS1 at $2,810 and lab 1.5ct D-VVS1 at $1,950 with The $3,000 Diamond Window concept on white editorial background",
  },
  {
    input: path.join(imgDir, "Best-Round-Cut-Diamond-Engagement-Ring.jpg"),
    output: path.join(imgDir, "best-round-cut-diamond-engagement-ring-featured.avif"),
    title: "Best Round Cut Diamond Engagement Ring Guide",
    description: "Best round cut diamond engagement ring guide showing The Buyer's Triangle framework with budget tiers from 1ct G-VS2 at $3,230 to 3ct G-VS2 at $48,780 on white editorial background",
  },
];

for (const job of jobs) {
  try {
    await sharp(job.input)
      .resize(1500, 1000, { fit: "inside" })
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
