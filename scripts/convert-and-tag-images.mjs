import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import { resolve } from "path";

const DIR = "public/images";

const IMAGES = [
  {
    src: "1-carat-round-diamond-price-tiers-infographic.png",
    out: "1-carat-round-diamond-price-tiers-infographic.avif",
    title: "1 Carat Round Diamond Price Tiers By Quality Grade",
    description:
      "Price comparison chart for 1 carat round diamonds across quality grades — G-VS1 ($3,200–$3,840), G-VVS2 ($3,760–$5,090), F-VS1 ($3,830–$5,060), and F-VVS2 ($5,060–$5,090) Excellent cut stones from Blue Nile.",
    keywords: [
      "1 carat round diamond price",
      "round diamond price tiers",
      "G VS1 round diamond",
      "diamond price by quality grade",
      "1ct round diamond buying guide",
    ],
  },
  {
    src: "1-carat-round-diamond-excellent-vs-very-good-cut-light-return.png",
    out: "1-carat-round-diamond-excellent-vs-very-good-cut-light-return.avif",
    title: "1 Carat Round Diamond Excellent vs Very Good Cut Light Return",
    description:
      "Side-by-side comparison of GIA Excellent cut (95% light return) versus Very Good cut (75–80% light return) for 1 carat round brilliant diamonds. The Cut Dividend explained.",
    keywords: [
      "GIA Excellent cut round diamond",
      "diamond cut light return comparison",
      "1 carat round diamond cut grade",
      "excellent vs very good cut diamond",
      "round diamond brilliance",
    ],
  },
  {
    src: "round-vs-oval-diamond-light-return-bow-tie-comparison.png",
    out: "round-vs-oval-diamond-light-return-bow-tie-comparison.avif",
    title: "Round vs Oval Diamond Light Return and Bow Tie Effect Comparison",
    description:
      "Visual comparison of uniform light return in round brilliant diamonds versus the bow-tie shadow effect visible in over 50% of oval diamonds. Why the bow-tie penalty matters before buying.",
    keywords: [
      "round vs oval diamond",
      "oval diamond bow tie effect",
      "round diamond light return",
      "diamond shape comparison",
      "oval diamond dark center",
    ],
  },
  {
    src: "1-carat-round-vs-oval-diamond-face-up-size-comparison.png",
    out: "1-carat-round-vs-oval-diamond-face-up-size-comparison.avif",
    title: "1 Carat Round vs Oval Diamond Face Up Size Comparison",
    description:
      "Face-up size comparison of a 1 carat round brilliant diamond (6.4mm diameter) versus a 1 carat oval diamond (8.0×5.5mm), showing the oval's larger visual footprint. The Oval Illusion Math explained.",
    keywords: [
      "round vs oval diamond size",
      "1 carat diamond face up size",
      "oval diamond larger than round",
      "diamond mm size comparison",
      "1 carat round diamond vs oval",
    ],
  },
  {
    src: "hearts-and-arrows-diamond-pavilion-view-8-hearts-pattern.png",
    out: "hearts-and-arrows-diamond-pavilion-view-8-hearts-pattern.avif",
    title: "Hearts and Arrows Diamond — 8 Perfect Hearts Pavilion View",
    description:
      "Pavilion (bottom-up) view of a true Hearts and Arrows round diamond through an H&A scope, showing the 8 perfectly symmetrical heart shapes that confirm genuine ideal cut alignment.",
    keywords: [
      "hearts and arrows diamond",
      "H&A diamond scope view",
      "8 hearts pattern diamond",
      "hearts and arrows pavilion view",
      "ideal cut round diamond",
    ],
  },
  {
    src: "hearts-and-arrows-diamond-fraud-spectrum-guide.png",
    out: "hearts-and-arrows-diamond-fraud-spectrum-guide.avif",
    title: "Hearts and Arrows Diamond Fraud Spectrum — True 8×8 to False H&A",
    description:
      "The H&A Fraud Spectrum: comparing true 8×8 Hearts and Arrows diamonds (perfect symmetry) against partial H&A (4–6 hearts) and falsely-labeled H&A stones. 60–70% of marketed H&A diamonds fail the true standard.",
    keywords: [
      "hearts and arrows diamond guide",
      "H&A diamond fraud",
      "true hearts and arrows diamond",
      "fake hearts and arrows diamond",
      "round diamond cut quality",
    ],
  },
  {
    src: "four-prong-vs-six-prong-round-diamond-solitaire-setting.png",
    out: "four-prong-vs-six-prong-round-diamond-solitaire-setting.avif",
    title: "4-Prong vs 6-Prong Round Diamond Solitaire Setting Comparison",
    description:
      "Side-by-side comparison of 4-prong and 6-prong solitaire settings for round diamonds — showing differences in diamond exposure, brilliance visibility, security, and price from Blue Nile.",
    keywords: [
      "4 prong vs 6 prong diamond setting",
      "round diamond solitaire setting",
      "engagement ring prong comparison",
      "best setting for round diamond",
      "round diamond engagement ring settings",
    ],
  },
  {
    src: "round-diamond-ring-setting-budget-decision-matrix.png",
    out: "round-diamond-ring-setting-budget-decision-matrix.avif",
    title: "Round Diamond Engagement Ring Setting Budget Decision Matrix",
    description:
      "Budget decision matrix for choosing round diamond engagement ring settings at every price tier: solitaire ($700+), pavé band ($1,200+), and halo ($1,255+). Specific Blue Nile setting prices included.",
    keywords: [
      "round diamond engagement ring settings",
      "engagement ring setting budget guide",
      "solitaire vs halo vs pave setting",
      "round diamond ring setting comparison",
      "best engagement ring settings 2026",
    ],
  },
  {
    src: "lab-grown-diamond-price-trend-2019-to-2026.png",
    out: "lab-grown-diamond-price-trend-2019-to-2026.avif",
    title: "Lab Grown Round Diamond Price Trend 2019–2026",
    description:
      "Line chart showing lab-grown round diamond price decline from ~$9,000 in 2019 to ~$1,500 in 2024, then stabilizing — the Lab Price Floor Effect. Prices have not continued falling since late 2025.",
    keywords: [
      "lab grown diamond price trend",
      "lab diamond price history 2026",
      "lab grown diamond price drop",
      "lab grown round diamond price",
      "are lab diamond prices still falling",
    ],
  },
  {
    src: "cvd-vs-hpht-lab-grown-diamond-production-method-comparison.png",
    out: "cvd-vs-hpht-lab-grown-diamond-production-method-comparison.avif",
    title: "CVD vs HPHT Lab Grown Diamond Production Method Comparison",
    description:
      "Infographic comparing CVD (Chemical Vapor Deposition) and HPHT (High Pressure High Temperature) lab-grown diamond creation methods — growth process, typical certification bodies, and quality differences.",
    keywords: [
      "CVD vs HPHT diamond",
      "lab grown diamond production methods",
      "how lab diamonds are made",
      "CVD diamond vs HPHT diamond",
      "lab diamond types",
    ],
  },
];

const AUTHOR = "Farzana Hasan";
const COPYRIGHT = `© ${new Date().getFullYear()} DiamondCritics.com`;
const CREATOR = "DiamondCritics.com";

async function run() {
  for (const img of IMAGES) {
    const srcPath = resolve(DIR, img.src);
    const outPath = resolve(DIR, img.out);

    // Step 1: Convert PNG → AVIF (sharp strips all source metadata by default)
    const info = await sharp(srcPath)
      .resize({ width: 1500, withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(outPath);
    console.log(`✓ ${img.out} → ${Math.round(info.size / 1024)}KB ${info.width}×${info.height}`);

    // Step 2: Write SEO metadata via exiftool
    await exiftool.write(
      outPath,
      {
        // XMP Core
        Title: img.title,
        Description: img.description,
        Subject: img.keywords,
        // IPTC
        ObjectName: img.title,
        Caption: img.description,
        Keywords: img.keywords,
        CopyrightNotice: COPYRIGHT,
        By_line: AUTHOR,
        // Exif
        ImageDescription: img.description,
        Artist: AUTHOR,
        Copyright: COPYRIGHT,
        // XMP Rights
        Creator: CREATOR,
        Rights: COPYRIGHT,
      },
      ["-overwrite_original"]
    );
    console.log(`  ↳ SEO metadata written`);
  }

  await exiftool.end();
  console.log("\nDone. All 10 images converted and tagged.");
}

run().catch((e) => { console.error(e); process.exit(1); });
