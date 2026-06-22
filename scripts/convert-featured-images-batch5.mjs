import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "Round-Diamond-SI1-Clarity.jpg",
    dest: "round-diamond-si1-eye-clean-featured.avif",
    title: "Round Diamond SI1 Clarity — Is It Eye-Clean? The 70% Rule",
    description: "Is SI1 clarity eye-clean for a round diamond? 70% of SI1 rounds are eye-clean at 1ct. The SI1 Roulette: inclusion type and location determine visibility. Real Blue Nile prices from $2,680.",
    keywords: "SI1 clarity round diamond, eye-clean SI1, round diamond clarity guide, SI1 vs VS2, round diamond inclusion",
  },
  {
    src: "4-Carat-Round-Diamond-Price.jpg",
    dest: "4-carat-round-diamond-price-featured.avif",
    title: "4 Carat Round Diamond Price Guide 2026 — The Statement Diamond",
    description: "4 carat round diamond price: natural GIA Excellent G-VS2 from $58,110, lab-grown D-VVS1 from $9,680. F color minimum in platinum. The Statement Diamond buying guide with real Blue Nile prices.",
    keywords: "4 carat round diamond price, 4ct diamond cost 2026, statement diamond, 4 carat diamond ring price, lab grown 4 carat diamond",
  },
  {
    src: "GIA-vs-IGI-for-Round-Diamonds.jpg",
    dest: "round-diamond-gia-vs-igi-featured.avif",
    title: "GIA vs IGI Round Diamonds 2026 — Which Certificate Actually Matters?",
    description: "GIA vs IGI for round diamonds: GIA only for natural, IGI acceptable for lab-grown. The Certificate Arbitrage: lab-grown IGI D-VVS1 at $1,950 vs natural GIA G-VS2 at $3,230. Real price comparison.",
    keywords: "GIA vs IGI diamond certificate, GIA certified round diamond, IGI grading accuracy, natural diamond certification 2026, lab grown IGI diamond",
  },
  {
    src: "Round-Diamond-Table-Percentage-Guide-.jpg",
    dest: "round-diamond-table-percentage-featured.avif",
    title: "Round Diamond Table Percentage Guide 2026 — The Flash Trap at 58%+",
    description: "Round diamond table percentage ideal range: 54–57% for balanced fire and brilliance. The Flash Trap: tables above 58% kill rainbow fire. GIA Excellent accepts 53–58%. Real Blue Nile price examples.",
    keywords: "round diamond table percentage, ideal table percentage round diamond, flash trap diamond, fire vs brilliance round diamond, GIA excellent proportions",
  },
  {
    src: "Round-Diamond-vs-Asscher-Cut.jpg",
    dest: "round-diamond-vs-asscher-cut-featured.avif",
    title: "Round Diamond vs Asscher Cut 2026 — Which to Buy?",
    description: "Round diamond vs Asscher cut: sparkle vs geometric windmill, GIA cut grade vs no cut grade, VS2 vs VVS2 clarity. The Window Effect and Clarity Tax explained. Real price comparison from Blue Nile.",
    keywords: "round diamond vs asscher cut, asscher cut diamond buying guide, window effect asscher, round vs step cut diamond, asscher clarity requirement VVS2",
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
