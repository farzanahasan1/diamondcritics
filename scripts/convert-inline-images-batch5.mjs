import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "round-diamond-si1-eye-clean-guide.jpeg",
    dest: "round-diamond-si1-eye-clean-guide.avif",
    title: "Round Diamond SI1 Clarity Eye-Clean Guide — The 70% Rule",
    description: "SI1 clarity eye-clean rate for round diamonds: 70% of SI1 rounds at 1ct are eye-clean. Inclusion type and location determine visibility. VS2 vs SI1 price and risk comparison.",
    keywords: "SI1 clarity round diamond, eye-clean SI1, SI1 vs VS2, round diamond clarity, SI1 inclusion visible",
  },
  {
    src: "round-diamond-si1-vs-vs2-price-comparison.jpeg",
    dest: "round-diamond-si1-vs-vs2-price-comparison.avif",
    title: "Round Diamond SI1 vs VS2 Price Comparison — $550 Saving Explained",
    description: "SI1 vs VS2 clarity price comparison for 1ct round diamonds. SI1 saves $330–$550 vs VS2 but requires HD video verification. Eye-clean rates: VS2 99%+ vs SI1 70%.",
    keywords: "SI1 vs VS2 round diamond, clarity price comparison, SI1 eye-clean rate, VS2 guaranteed clean, round diamond clarity cost",
  },
  {
    src: " 4-carat-round-diamond-price-guide.jpeg",
    dest: "4-carat-round-diamond-price-guide.avif",
    title: "4 Carat Round Diamond Price Guide 2026 — The Statement Diamond",
    description: "4 carat round diamond prices: natural G-VS2 from $58,110, lab-grown D-VVS1 from $9,680. F color minimum in platinum. 10.2mm face-up diameter. Statement diamond buying guide.",
    keywords: "4 carat round diamond price, 4ct diamond cost, statement diamond, 4 carat diamond ring, lab grown 4ct diamond",
  },
  {
    src: "4-carat-round-diamond-size-comparison.jpeg",
    dest: "4-carat-round-diamond-size-comparison.avif",
    title: "Round Diamond Size Comparison 1ct to 4ct — True Scale Millimeter Guide",
    description: "Round diamond size comparison at true scale: 1ct 6.4mm, 2ct 8.1mm, 3ct 9.4mm, 4ct 10.2mm. Price per carat jumps at each threshold. Natural vs lab-grown size value comparison.",
    keywords: "round diamond size comparison, 4 carat diamond size, diamond mm size chart, 1ct vs 2ct vs 4ct diamond, round diamond millimeter",
  },
  {
    src: "round-diamond-gia-vs-igi-comparison.jpeg",
    dest: "round-diamond-gia-vs-igi-comparison.avif",
    title: "GIA vs IGI Diamond Certificate Comparison — Which Certificate Matters",
    description: "GIA vs IGI certificate comparison for round diamonds. GIA only for natural diamonds — IGI inflates grades 1–2 color + 1 clarity. IGI acceptable for lab-grown. Certificate Arbitrage explained.",
    keywords: "GIA vs IGI diamond certificate, GIA certified round diamond, IGI grading, diamond certificate comparison, natural diamond certification",
  },
  {
    src: "round-diamond-gia-vs-igi-price-value-chart.jpeg",
    dest: "round-diamond-gia-vs-igi-price-value-chart.avif",
    title: "GIA vs IGI Price Value Chart — Certificate Arbitrage Natural vs Lab-Grown",
    description: "Certificate Arbitrage: IGI lab-grown D-VVS1 1.5ct at $1,950 vs GIA natural G-VS2 1ct at $3,230. Lab-grown delivers better grades, larger size, 40% cheaper. Real Blue Nile price comparison.",
    keywords: "GIA vs IGI price comparison, certificate arbitrage, lab grown diamond value, IGI lab grown diamond, GIA natural diamond price",
  },
  {
    src: "round-diamond-table-percentage-guide.jpeg",
    dest: "round-diamond-table-percentage-guide.avif",
    title: "Round Diamond Table Percentage Guide — The Flash Trap at 58%+",
    description: "Round diamond table percentage ideal range 54–57%. The Flash Trap: tables above 58% kill fire (rainbow sparkle). GIA Excellent accepts 53–58%. Fire vs brilliance tradeoff by table size.",
    keywords: "round diamond table percentage, ideal table percentage, flash trap diamond, fire vs brilliance, GIA excellent table",
  },
  {
    src: "round-diamond-table-percentage-fire-brilliance-chart.jpeg",
    dest: "round-diamond-table-percentage-fire-brilliance-chart.avif",
    title: "Round Diamond Fire vs Brilliance Chart — Table Percentage Tradeoff",
    description: "Fire vs brilliance tradeoff by table percentage for round brilliant diamonds. Ideal balance at 54–57% table. Fire decreases above 58%. Brilliance peaks at large tables. Visual sparkle guide.",
    keywords: "round diamond fire brilliance, table percentage sparkle, diamond fire rainbow, brilliance vs fire, round diamond sparkle type",
  },
  {
    src: "round-diamond-vs-asscher-cut-guide.jpeg",
    dest: "round-diamond-vs-asscher-cut-guide.avif",
    title: "Round Diamond vs Asscher Cut Guide — Sparkle vs Windmill Geometry",
    description: "Round brilliant vs Asscher cut comparison: 57-facet brilliant sparkle vs 58 step-facet windmill geometry. GIA cut grade available for round only. VVS2 minimum clarity for Asscher.",
    keywords: "round diamond vs asscher cut, asscher cut diamond, windmill effect diamond, round vs step cut, asscher cut clarity requirement",
  },
  {
    src: "round-diamond-vs-asscher-cut-clarity-comparison.jpeg",
    dest: "round-diamond-vs-asscher-cut-clarity-comparison.avif",
    title: "Asscher Cut Window Effect vs Round Brilliant Clarity Masking",
    description: "The Window Effect: Asscher step-facets make inclusions transparent. VS2 inclusion invisible in round brilliant becomes visible in Asscher. VVS2 minimum required for Asscher vs VS2 for round.",
    keywords: "asscher cut window effect, asscher clarity requirement, round vs asscher clarity, VVS2 asscher, step cut inclusion visibility",
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
  console.log("\nAll 10 inline images converted successfully.");
}

convertAll().catch(console.error);
