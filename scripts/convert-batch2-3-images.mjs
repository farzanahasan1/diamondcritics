import sharp from 'sharp';
import { ExifTool } from 'exiftool-vendored';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images');

// source filename → [target avif filename, title, description, keywords]
const images = [
  // ── BATCH 2 ──────────────────────────────────────────────────────────────
  ['2-carat-round-diamond-price-matrix.jpeg',
   '2-carat-round-diamond-price-matrix.avif',
   '2 Carat Round Diamond Price Matrix By Color and Clarity Grade',
   'Price grid showing 2 carat round diamond costs by color (D-G) and clarity (VS2-VVS1) grades, from $16,490 to $54,840',
   '2 carat round diamond price, round diamond price matrix, 2ct diamond price chart, GIA excellent round diamond price, round diamond cost by grade'],

  [' 2-carat-round-diamond-price-matrix.png',
   '2ct-lab-grown-vs-natural-round-diamond-price.avif',
   '2ct Lab-Grown vs Natural Round Diamond Price Comparison',
   'Side-by-side comparison of 2 carat lab-grown (IGI from $2,810) vs natural (GIA from $16,490) round diamond prices with quality specs',
   'lab grown vs natural diamond price, 2ct lab diamond price, 2 carat diamond comparison, IGI vs GIA diamond cost, lab grown round diamond'],

  ['round-diamond-fluorescence-scale-price-impact.jpeg',
   'round-diamond-fluorescence-scale-price-impact.avif',
   'Round Diamond Fluorescence Scale and Price Discount by Grade',
   'Fluorescence grade scale from None to Very Strong showing price discount percentages at each level for round brilliant diamonds',
   'round diamond fluorescence, diamond fluorescence price impact, blue fluorescence diamond discount, GIA fluorescence scale, diamond fluorescence guide'],

  [' round-diamond-fluorescence-color-grade-matrix.jpeg',
   'round-diamond-fluorescence-color-grade-matrix.avif',
   'Round Diamond Fluorescence vs Color Grade Decision Matrix',
   'Buy/avoid matrix showing how each fluorescence grade interacts with color grades D through J for round brilliant diamonds',
   'diamond fluorescence matrix, round diamond color fluorescence, when to avoid strong fluorescence, diamond fluorescence benefit, fluorescence vs color grade'],

  ['round-diamond-anatomy-proportion-guide.jpeg',
   'round-diamond-anatomy-proportion-guide.avif',
   'Round Diamond Anatomy and Ideal Proportion Reference Guide',
   'Labeled cross-section diagram of a round brilliant diamond showing table, crown, girdle, pavilion measurements with ideal percentage ranges',
   'round diamond anatomy, diamond proportion guide, ideal round diamond proportions, table depth crown pavilion diagram, GIA excellent cut proportions'],

  ['round-diamond-ideal-proportion-window_202606221329.jpeg',
   'round-diamond-ideal-proportion-window.avif',
   'Round Diamond Ideal Proportion Window vs GIA Excellent Range',
   'Comparison of spread cut, ideal cut, and deep cut round diamond profiles showing how proportions affect light return and face-up size',
   'round diamond ideal proportions, GIA excellent cut proportions, diamond cut quality guide, pavilion angle crown angle round diamond, AGS ideal cut'],

  // Princess cut — long/truncated filename handled by listing exact basename
  ['Round_vs_Princess_Diamond_Compar…round-diamond-vs-princess-cut-comparison_202606221331.jpeg',
   'round-diamond-vs-princess-cut-comparison.avif',
   'Round Diamond vs Princess Cut Diamond Full Comparison',
   'Side-by-side comparison of round vs princess cut diamonds on brilliance, durability, price, GIA cut grade, and setting options',
   'round vs princess cut diamond, round diamond vs princess cut price, princess cut diamond comparison, round brilliant vs princess, diamond shape comparison'],

  ['round-vs-princess-price-per-carat-chart_202606221332.jpeg',
   'round-vs-princess-price-per-carat-chart.avif',
   'Round vs Princess Diamond Price Per Carat Comparison 1ct to 4ct',
   'Bar chart comparing round and princess cut diamond prices from 1ct to 4ct showing 20-35% princess cut savings at each carat weight',
   'round vs princess diamond price, princess cut cheaper than round, diamond price comparison by shape, 1ct 2ct 3ct round vs princess cost, princess cut price savings'],

  ['round-diamond-carat-to-mm-size-chart_202606221334.jpeg',
   'round-diamond-carat-to-mm-size-chart.avif',
   'Round Diamond Carat to MM Size Chart 0.25ct to 10ct',
   'Visual scale chart showing round diamond actual millimeter diameters from 0.25ct (4.1mm) to 10ct (14.0mm) with proportional circles',
   'round diamond size chart, diamond carat to mm conversion, round diamond millimeter size, 1 carat round diamond diameter, diamond size comparison chart'],

  ['round-diamond-finger-coverage-guide_202606221337.jpeg',
   'round-diamond-finger-coverage-guide.avif',
   'Round Diamond Finger Coverage Guide 0.5ct to 4ct',
   'Visual guide showing how different round diamond carat weights appear on a size 6 finger from 0.5ct to 4ct with percentage finger coverage',
   'round diamond on finger, diamond size on hand, 1 carat ring finger size, diamond finger coverage, round diamond finger size guide'],

  // ── BATCH 3 ──────────────────────────────────────────────────────────────
  ['3-carat-round-diamond-price-tiers.jpeg',
   '3-carat-round-diamond-price-tiers.avif',
   '3 Carat Round Diamond Price Tiers by Color and Clarity',
   'Price ladder showing 3 carat round diamond costs from G-VVS1 at $44,500 to F-VVS1 at $84,710, all GIA Excellent Cut, June 2026',
   '3 carat round diamond price, 3ct diamond cost, GIA excellent 3 carat price, three carat diamond price chart, 3 carat G VS2 price'],

  ['3ct-lab-vs-natural-round-diamond-savings_202606221346.jpeg',
   '3ct-lab-vs-natural-round-diamond-savings.avif',
   '3 Carat Lab vs Natural Round Diamond Price Savings',
   'Comparison showing 3ct natural round diamond ($44,500+) vs 3ct lab-grown round diamond ($5,800) price difference with specs',
   '3 carat lab grown diamond price, lab vs natural 3ct diamond, 3 carat diamond savings lab grown, IGI lab diamond 3ct price, natural vs lab diamond 3 carat'],

  [' round-diamond-color-grade-face-up-comparison.png',
   'round-diamond-color-grade-face-up-comparison.avif',
   'Round Diamond Color Grade Face-Up Comparison D to I',
   'Visual comparison of round diamond color grades D through I shown face-up in white gold setting with price examples',
   'round diamond color comparison, G color round diamond, D vs G diamond color, round diamond color chart, best color for round diamond'],

  ['round-diamond-color-vs-setting-metal-guide.jpeg',
   'round-diamond-color-vs-setting-metal-guide.avif',
   'Round Diamond Color Grade by Setting Metal Guide',
   'Grid showing recommended diamond color grades by carat weight across white gold, yellow gold, and rose gold settings',
   'diamond color for white gold, yellow gold diamond color grade, round diamond color recommendation, best diamond color platinum, diamond color by setting'],

  ['round-diamond-clarity-grade-eye-clean-chart.jpeg',
   'round-diamond-clarity-grade-eye-clean-chart.avif',
   'Round Diamond Clarity Eye-Clean Standard Guide',
   'Horizontal clarity scale from FL to I1 showing eye-clean zones with price anchors and SI1 video review requirement',
   'round diamond clarity guide, VS2 eye clean round diamond, eye clean diamond clarity, SI1 round diamond visible, diamond clarity scale chart'],

  ['round-diamond-si1-vs-vs2-eye-clean-comparison_202606221404.jpeg',
   'round-diamond-si1-vs-vs2-eye-clean-comparison.avif',
   'Round Diamond SI1 vs VS2 Eye-Clean Face-Up Comparison',
   'Side-by-side comparison of SI1 and VS2 round brilliant diamonds face-up, showing eye-clean rates and price differences',
   'SI1 vs VS2 diamond clarity, eye clean SI1 round diamond, VS2 round diamond price, SI1 diamond video review, round diamond clarity comparison'],

  ['round-diamond-vs-cushion-cut-brilliance-comparison.jpeg',
   'round-diamond-vs-cushion-cut-brilliance-comparison.avif',
   'Round Diamond vs Cushion Cut Full Comparison Chart',
   'Comprehensive comparison table of round brilliant vs cushion cut on cut grade, brilliance, price, face-up size, and resale value',
   'round vs cushion cut diamond, cushion cut vs round brilliant price, round diamond vs cushion comparison, cushion cut GIA grade, round vs cushion brilliance'],

  ['round-vs-cushion-face-up-pattern-guide.jpeg',
   'round-vs-cushion-face-up-pattern-guide.avif',
   'Round vs Cushion Cut Light Pattern Comparison',
   'Visual diagram showing round brilliant symmetrical sparkle pattern vs cushion cut crushed ice effect and fire pattern differences',
   'round vs cushion diamond sparkle, crushed ice cushion cut, round brilliant light pattern, cushion cut fire vs brilliance, diamond cut light return'],

  ['gia-round-diamond-certificate-reading-guide.jpeg',
   'gia-round-diamond-certificate-reading-guide.avif',
   'How to Read a GIA Round Diamond Certificate',
   'Annotated diagram of a GIA grading report showing 8 key sections: cut grade, color, clarity, table, depth, pavilion angle, and fluorescence',
   'GIA diamond certificate guide, how to read diamond certificate, GIA report sections, GIA excellent cut grade, diamond grading report explained'],

  ['gia-vs-igi-round-diamond-certificate-comparison.jpeg',
   'gia-vs-igi-round-diamond-certificate-comparison.avif',
   'GIA vs IGI vs AGS Diamond Certificate Comparison',
   'Comparison table of GIA, IGI, and AGS certification labs showing differences in cut grade, grading strictness, and use cases for round diamonds',
   'GIA vs IGI diamond certificate, IGI round diamond grade, AGS ideal cut vs GIA excellent, diamond lab comparison, best certification for round diamond'],
];

async function run() {
  const exiftool = new ExifTool({ taskTimeoutMillis: 30000 });

  for (const [srcName, destName, title, description, keywords] of images) {
    const srcPath = path.join(imgDir, srcName);
    const destPath = path.join(imgDir, destName);

    if (!fs.existsSync(srcPath)) {
      console.warn(`SKIP (not found): ${srcName}`);
      continue;
    }

    try {
      // Convert to AVIF, 1500×1000, quality 80 — sharp strips all source metadata
      await sharp(srcPath)
        .resize(1500, 1000, { fit: 'cover', position: 'centre' })
        .avif({ quality: 80 })
        .toFile(destPath);

      // Write clean SEO metadata
      await exiftool.write(destPath, {
        Title: title,
        Description: description,
        Keywords: keywords,
        Author: 'Farzana Hasan',
        Copyright: '© 2026 DiamondCritics.com',
        ImageDescription: description,
      }, ['-overwrite_original']);

      console.log(`OK: ${srcName} → ${destName}`);
    } catch (err) {
      console.error(`FAIL: ${srcName}`, err.message);
    }
  }

  await exiftool.end();
  console.log('\nDone. All 20 images processed.');
}

run().catch(console.error);
