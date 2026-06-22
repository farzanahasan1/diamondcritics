import sharp from 'sharp';
import { ExifTool } from 'exiftool-vendored';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images');

// [source, target, title, description, keywords]
const images = [
  ['1-5-carat-round-diamond-price-guide.jpeg',
   '1-5-carat-round-diamond-price-guide.avif',
   '1.5 Carat Round Diamond Price Guide 2026',
   '1.5 carat round diamond price infographic — GIA Excellent cut G-VS2 from $8,430 natural and $1,930 lab-grown with grade price tiers and size comparison',
   '1.5 carat round diamond price, 1.5ct diamond cost, half carat price trap, round diamond 1.5ct guide, 1.5 carat diamond 2026'],

  ['1-5-carat-round-diamond-size-vs-1ct-2ct-comparison.jpeg',
   '1-5-carat-round-diamond-size-vs-1ct-2ct-comparison.avif',
   '1.5 Carat Round Diamond Size vs 1ct and 2ct Comparison',
   'The Half-Carat Price Trap — 1ct at $3,230 vs 1.5ct at $8,430 vs 2ct at $16,490 with face-up diameter comparison 6.4mm, 7.3mm, 8.1mm',
   'round diamond size comparison, 1.5 carat vs 1 carat, half carat price trap, round diamond mm size chart, carat size visual comparison'],

  ['round-diamond-vs-emerald-cut-guide.jpeg',
   'round-diamond-vs-emerald-cut-guide.avif',
   'Round Diamond vs Emerald Cut Comparison Guide',
   'Round brilliant vs emerald cut comparison — 57 facets and GIA Excellent cut grade vs step-cut hall of mirrors with no GIA cut grade, clarity tax explained',
   'round diamond vs emerald cut, round vs emerald price, emerald cut clarity requirement, round brilliant comparison, emerald cut hall of mirrors'],

  ['round-diamond-vs-emerald-cut-face-up-comparison.jpeg',
   'round-diamond-vs-emerald-cut-face-up-comparison.avif',
   'Round vs Emerald Cut Face-Up Comparison — The Clarity Tax',
   'The Clarity Tax infographic — round diamond VS2 eye-clean vs emerald cut VS1 minimum at 2ct showing true price comparison after clarity adjustment',
   'clarity tax emerald cut, round vs emerald clarity grade, emerald cut VS1 eye clean, round diamond VS2 comparison, emerald cut buying guide'],

  ['round-diamond-vs-radiant-cut-guide.jpeg',
   'round-diamond-vs-radiant-cut-guide.avif',
   'Round Diamond vs Radiant Cut Comparison Guide',
   'Round brilliant vs radiant cut — The Hybrid Trap explained: GIA Excellent grade vs no cut grade, 15-30% price difference, sparkle character comparison',
   'round diamond vs radiant cut, round vs radiant price, radiant cut no GIA grade, hybrid trap radiant, round brilliant vs radiant sparkle'],

  ['round-diamond-vs-radiant-cut-face-up-comparison.jpeg',
   'round-diamond-vs-radiant-cut-face-up-comparison.avif',
   'Round vs Radiant Cut Face-Up Shape Comparison at 1.5ct',
   'Four diamond shapes at 1.5ct compared face-up: round 7.3mm, square radiant 6.6×6.6mm, rectangular radiant 7.4×5.9mm, elongated radiant 8.1×5.3mm',
   'radiant cut shapes comparison, radiant cut length to width ratio, round vs radiant face up size, radiant cut 1.5 carat, rectangular vs square radiant'],

  ['how-to-buy-round-diamond-checklist-guide.jpeg',
   'how-to-buy-round-diamond-checklist-guide.avif',
   'How to Buy a Round Diamond — 5-Step Checklist Guide',
   'How to buy a round diamond checklist — 5 steps: GIA Excellent cut, G color, VS2 clarity, table 55-57% depth 59-62%, Blue Nile HD video saves $3,000+',
   'how to buy round diamond, round diamond buying guide, GIA excellent checklist, round diamond tips, buying round diamond Blue Nile'],

  ['round-diamond-buying-grade-savings-chart.jpeg',
   'round-diamond-buying-grade-savings-chart.avif',
   'Round Diamond Grade Savings Chart — D vs G Color and VVS2 vs VS2',
   'The GIA Excellent Filter — savings chart: D vs G color saves $2,570, VVS2 vs VS2 clarity saves $1,470, GIA Excellent cut worth $450 premium at 1ct',
   'round diamond grade savings, D vs G color diamond, VVS2 vs VS2 diamond price, round diamond buying tips, diamond grade comparison chart'],

  ['round-diamond-depth-percentage-guide.jpeg',
   'round-diamond-depth-percentage-guide.avif',
   'Round Diamond Depth Percentage Guide — The Deep-Cut Trap',
   'The Deep-Cut Trap infographic — round diamond cross-section at 58% shallow, 61% ideal, 65% deep showing light return paths and face-up size difference',
   'round diamond depth percentage, deep cut trap diamond, ideal diamond depth, diamond depth 61 percent, round diamond proportions guide'],

  ['round-diamond-depth-percentage-vs-face-up-size.jpeg',
   'round-diamond-depth-percentage-vs-face-up-size.avif',
   'Round Diamond Depth vs Face-Up Size — Same 1ct Different Sizes',
   'Five 1.00ct round diamonds at different depths: 58%=6.65mm, 60%=6.45mm, 61%=6.40mm ideal, 63%=6.20mm, 65%=6.05mm — same carat, dramatically different face-up',
   'diamond depth vs face up size, round diamond depth chart, 1 carat diamond size by depth, deep cut diamond smaller, round diamond face up comparison'],
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
      await sharp(srcPath)
        .resize(1500, 1000, { fit: 'cover', position: 'centre' })
        .avif({ quality: 82 })
        .toFile(destPath);

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
  console.log('\nDone — 10 round cluster images processed.');
}

run().catch(console.error);
