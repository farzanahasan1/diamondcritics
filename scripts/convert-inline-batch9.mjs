import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    input: path.join(imgDir, "6-carat-round-diamond-price-1.png"),
    output: path.join(imgDir, "6-carat-round-diamond-price-1.avif"),
    title: "6 Carat Round Diamond Face-Up Size",
    description: "6 carat round diamond 11.7mm face-up diameter size comparison chart on white editorial background",
  },
  {
    input: path.join(imgDir, "6-carat-round-diamond-price-2.png"),
    output: path.join(imgDir, "6-carat-round-diamond-price-2.avif"),
    title: "6 Carat Round Diamond Per-Carat Price Chart",
    description: "6 carat round diamond per-carat price progression chart from 1ct to 7ct on white editorial background",
  },
  {
    input: path.join(imgDir, "7-carat-round-diamond-price-1.png"),
    output: path.join(imgDir, "7-carat-round-diamond-price-1.avif"),
    title: "7 Carat Round Diamond Face-Up Diameter",
    description: "7 carat round diamond 12.4mm face-up diameter comparison to smaller carat rounds on white editorial background",
  },
  {
    input: path.join(imgDir, " 7-carat-round-diamond-price-2.png"),
    output: path.join(imgDir, "7-carat-round-diamond-price-2.avif"),
    title: "7 Carat Round Diamond Per-Carat Price Progression",
    description: "7 carat round diamond per-carat price comparison chart from 1ct to 7ct on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-halo-vs-solitaire-1.png"),
    output: path.join(imgDir, "round-diamond-halo-vs-solitaire-1.avif"),
    title: "Round Diamond Halo vs Solitaire Size Comparison",
    description: "Round diamond halo ring versus solitaire ring side by side on white editorial background showing face-up size difference",
  },
  {
    input: path.join(imgDir, "round-diamond-halo-vs-solitaire-2.png"),
    output: path.join(imgDir, "round-diamond-halo-vs-solitaire-2.avif"),
    title: "Round Diamond Halo vs Solitaire On Hand",
    description: "Round diamond solitaire ring on hand versus halo ring on hand showing real-world size and style comparison on white background",
  },
  {
    input: path.join(imgDir, "round-diamond-length-to-width-ratio-1.png"),
    output: path.join(imgDir, "round-diamond-length-to-width-ratio-1.avif"),
    title: "Round Diamond Length to Width Ratio Diagram",
    description: "Round diamond length to width ratio diagram showing 1.00 perfect circle versus 1.04 oval outline on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-length-to-width-ratio-2.png"),
    output: path.join(imgDir, "round-diamond-length-to-width-ratio-2.avif"),
    title: "Round Diamond L:W Ratio Light Return Pattern",
    description: "Round diamond top view showing symmetrical light return pattern on perfect 1.00 L:W ratio versus slightly asymmetric pattern on 1.04 L:W on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-under-5000-1.png"),
    output: path.join(imgDir, "round-diamond-under-5000-1.avif"),
    title: "Best Round Diamond Under $5000 Comparison",
    description: "Round diamond buying guide under $5000 showing 1ct natural versus 2ct lab-grown comparison on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-under-5000-2.png"),
    output: path.join(imgDir, "round-diamond-under-5000-2.avif"),
    title: "Round Diamond Under $5000 Size and Price Chart",
    description: "Round diamond comparison chart showing 1ct natural GIA versus 2ct lab-grown IGI side by side on white editorial background with size and price data",
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
