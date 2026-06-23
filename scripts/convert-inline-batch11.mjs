import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    input: path.join(imgDir, "8-carat-round-diamond-price-1.jpeg"),
    output: path.join(imgDir, "8-carat-round-diamond-price-1.avif"),
    title: "8 Carat Round Diamond Face-Up Size Comparison",
    description: "8 carat round diamond face-up showing 13.1mm diameter on white editorial background with carat size comparison chart",
  },
  {
    input: path.join(imgDir, "8-carat-round-diamond-price-2.jpeg"),
    output: path.join(imgDir, "8-carat-round-diamond-price-2.avif"),
    title: "8 Carat Round Diamond Per-Carat Price Progression",
    description: "8 carat round diamond per-carat price progression from 1ct to 9ct showing rarity premium acceleration on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-under-10000-1.jpeg"),
    output: path.join(imgDir, "round-diamond-under-10000-1.avif"),
    title: "Best Round Diamond Under $10,000 Comparison",
    description: "round diamond under $10000 buying guide showing 1ct natural GIA versus 4ct lab-grown comparison on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-under-10000-2.jpeg"),
    output: path.join(imgDir, "round-diamond-under-10000-2.avif"),
    title: "Round Diamond Under $10,000 Lab vs Natural Budget",
    description: "round diamond under $10000 lab vs natural comparison showing 3ct lab size versus 1ct natural with setting budget breakdown on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-1-carat-vs-2-carat-1.jpeg"),
    output: path.join(imgDir, "round-diamond-1-carat-vs-2-carat-1.avif"),
    title: "1 Carat vs 2 Carat Round Diamond Size Comparison",
    description: "1 carat round diamond at 6.4mm versus 2 carat round diamond at 8.1mm face-up size comparison on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-1-carat-vs-2-carat-2.jpeg"),
    output: path.join(imgDir, "round-diamond-1-carat-vs-2-carat-2.avif"),
    title: "Lab 2ct vs Natural 1ct Round Diamond Comparison",
    description: "lab-grown 2 carat round diamond IGI certified D-VVS1 compared to natural 1 carat GIA certified G-VS2 price comparison on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-d-color-vs-g-color-1.jpeg"),
    output: path.join(imgDir, "round-diamond-d-color-vs-g-color-1.avif"),
    title: "D Color vs G Color Round Diamond Guide",
    description: "D color versus G color round diamond comparison showing colorless versus near-colorless grading on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-d-color-vs-g-color-2.jpeg"),
    output: path.join(imgDir, "round-diamond-d-color-vs-g-color-2.avif"),
    title: "D vs G Color Price Premium Chart",
    description: "round diamond D color vs G color price comparison chart at 1ct through 3ct on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-vvs-vs-vs2-1.jpeg"),
    output: path.join(imgDir, "round-diamond-vvs-vs-vs2-1.avif"),
    title: "VVS vs VS2 Round Diamond Clarity Comparison",
    description: "VVS versus VS2 round diamond clarity comparison under magnification showing inclusion positions on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-vvs-vs-vs2-2.jpeg"),
    output: path.join(imgDir, "round-diamond-vvs-vs-vs2-2.avif"),
    title: "Lab D-VVS1 vs Natural G-VS2 Clarity Value",
    description: "lab-grown round diamond 2 carat D-VVS1 IGI price comparison versus natural 2 carat G-VS2 GIA on white editorial background",
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
