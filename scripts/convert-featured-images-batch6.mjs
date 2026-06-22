import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "5-Carat-Round-Diamond-Price.jpg",
    dest: "5-carat-round-diamond-price-featured.avif",
    title: "5 Carat Round Diamond Price Guide 2026 — Natural vs Lab-Grown",
    description: "5 carat round diamond prices: natural GIA Excellent from $147,110, lab-grown GIA from $13,150. The Prestige Premium — per-carat price doubles at 5ct. Complete buyer's guide with real Blue Nile data.",
    keywords: "5 carat round diamond price, 5ct diamond cost, prestige diamond, 5 carat diamond ring, lab grown 5ct diamond",
  },
  {
    src: "Round-Diamond-vs-Heart-Shape.jpg",
    dest: "round-diamond-vs-heart-shape-featured.avif",
    title: "Round Diamond vs Heart Shape 2026 — Which Should You Buy?",
    description: "Round diamond vs heart shape: round needs G-H color and VS2 clarity. Heart shape needs F-G color and VS1 clarity. The Romance Tax explained with real price comparisons at 1ct and 2ct.",
    keywords: "round diamond vs heart shape, heart shape diamond, round vs heart diamond, heart diamond quality, romance tax diamond",
  },
  {
    src: "Round-Diamond-vs-Marquise-Cut.jpg",
    dest: "round-diamond-vs-marquise-featured.avif",
    title: "Round Diamond vs Marquise Cut 2026 — Size, Price, Trade-Offs",
    description: "Round vs marquise cut: marquise faces up 10–15% larger per carat but 40–50% have visible bow-tie. The Elongation Trade-Off — real price data, color requirements, and who should buy each shape.",
    keywords: "round diamond vs marquise, marquise cut diamond, elongation trade-off, marquise bowtie, round vs marquise price",
  },
  {
    src: "Round-Diamond-Crown-Angle.jpg",
    dest: "round-diamond-crown-angle-featured.avif",
    title: "Round Diamond Crown Angle Guide 2026 — The Scintillation Gate",
    description: "Round diamond crown angle: 34–35° is the Scintillation Gate for maximum fire and scintillation. GIA Excellent range 32.7–36.0°. Fisheye below 32°, nailhead above 36.5°. How to verify on your certificate.",
    keywords: "round diamond crown angle, scintillation gate, crown angle GIA excellent, diamond fire performance, crown angle fisheye nailhead",
  },
  {
    src: "Round-Diamond-Girdle-Thickness.jpg",
    dest: "round-diamond-girdle-thickness-featured.avif",
    title: "Round Diamond Girdle Thickness 2026 — The Invisible Weight Trap",
    description: "Round diamond girdle thickness: Very Thick girdles hide 5–7% of carat weight, making stones appear smaller. GIA Excellent mandates Thin to Slightly Thick. The Invisible Weight Trap explained.",
    keywords: "round diamond girdle thickness, invisible weight trap, GIA girdle grades, diamond girdle, thick girdle round diamond",
  },
];

async function convertAll() {
  for (const job of jobs) {
    const srcPath = path.join(imagesDir, job.src);
    const destPath = path.join(imagesDir, job.dest);

    console.log(`Converting: ${job.src} → ${job.dest}`);

    await sharp(srcPath)
      .resize(1500, 1000, { fit: "cover", position: "center" })
      .avif({ quality: 82 })
      .toFile(destPath);

    await exiftool.write(
      destPath,
      {
        Title: job.title,
        Description: job.description,
        Keywords: job.keywords,
        Creator: "DiamondCritics",
        Copyright: `© ${new Date().getFullYear()} DiamondCritics.com`,
      },
      ["-overwrite_original"]
    );

    console.log(`  ✓ Done: ${job.dest}`);
  }

  await exiftool.end();
  console.log("\nAll 5 featured images converted successfully.");
}

convertAll().catch(console.error);
