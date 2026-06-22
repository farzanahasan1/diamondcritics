import sharp from 'sharp';
import { ExifTool } from 'exiftool-vendored';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, '..', 'public', 'images');

// [source, target, title, description, keywords]
const images = [
  ['2-Carat-Round-Diamond-Price.jpg',
   '2-carat-round-diamond-price-guide.avif',
   '2 Carat Round Diamond Price Guide 2026',
   'Complete price guide for 2 carat round diamonds — GIA Excellent Cut natural from $16,490 and lab-grown from $2,810 with full grade breakdown',
   '2 carat round diamond price, 2ct diamond cost, GIA excellent 2 carat, round diamond price guide, 2 carat lab grown diamond'],

  ['Round-Diamond-Fluorescence.jpg',
   'round-diamond-fluorescence-guide.avif',
   'Round Diamond Fluorescence Guide — Blue Glow Dividend Explained',
   'Complete guide to round diamond fluorescence — how none, faint, medium, strong, and very strong fluorescence affects price and appearance',
   'round diamond fluorescence, diamond blue fluorescence, fluorescence price discount, GIA fluorescence guide, diamond fluorescence effect'],

  ['Round-Diamond-Ideal-Proportions.jpg',
   'round-diamond-ideal-proportions-guide.avif',
   'Round Diamond Ideal Proportions — GIA Excellent Cut Explained',
   'Detailed guide to round diamond ideal proportions including table 53-58%, depth 59-62.3%, crown 34-35°, and pavilion 40.6-41° targets',
   'round diamond ideal proportions, GIA excellent cut proportions, diamond table depth guide, round diamond cut quality, pavilion angle crown angle diamond'],

  ['Round-Diamond-vs-Princess-Cut.jpg',
   'round-diamond-vs-princess-cut-guide.avif',
   'Round Diamond vs Princess Cut — Complete Comparison Guide',
   'Round diamond vs princess cut compared on brilliance, price, durability, GIA cut grade, and best settings for engagement rings',
   'round diamond vs princess cut, round vs princess price, princess cut diamond comparison, round brilliant vs princess diamond, diamond shape guide'],

  ['Round-Diamond-Size-Chart.jpg',
   'round-diamond-size-chart-guide.avif',
   'Round Diamond Size Chart — Carat to MM Conversion 0.25ct to 10ct',
   'Complete round diamond size chart showing millimeter diameter, face-up area, and finger coverage from 0.25ct to 10ct with live price examples',
   'round diamond size chart, diamond carat to mm chart, round diamond mm size, carat size comparison chart, diamond size guide'],

  ['3-Carat-Round-Diamond-Price-Guide.jpg',
   '3-carat-round-diamond-price-guide.avif',
   '3 Carat Round Diamond Price Guide 2026',
   'Real 3 carat round diamond prices from $44,500 natural GIA Excellent to $5,800 lab-grown IGI, with full color and clarity breakdown',
   '3 carat round diamond price, 3ct diamond cost, three carat diamond price, GIA excellent 3 carat price, 3ct lab grown diamond price'],

  ['Round-Diamond-Color-Guide.jpg',
   'round-diamond-color-guide.avif',
   'Round Diamond Color Guide — G Sweet Spot and Best Color to Buy',
   'Which color grade to buy for round diamonds — D vs G vs H explained with real prices showing the G Sweet Spot value opportunity',
   'round diamond color guide, best color round diamond, G color diamond, diamond color grade guide, round diamond color recommendation'],

  ['Round-Diamond-Clarity-Guide.jpg',
   'round-diamond-clarity-guide.avif',
   'Round Diamond Clarity Guide — Eye-Clean Standard and Clarity Cliff',
   'Which clarity grade is eye-clean for round diamonds — VS2 eye-clean standard explained with real price data from $3,230 to $26,610',
   'round diamond clarity guide, VS2 eye clean diamond, eye clean round diamond clarity, diamond clarity grade guide, round diamond clarity recommendation'],

  ['Round-Diamond-vs-Cushion-Cut.jpg',
   'round-diamond-vs-cushion-cut-guide.avif',
   'Round Diamond vs Cushion Cut — Which to Buy in 2026',
   'Round diamond vs cushion cut compared on brilliance, crushed ice effect, price difference, GIA cut grade, and best settings for engagement rings',
   'round diamond vs cushion cut, round vs cushion price, cushion cut diamond comparison, crushed ice cushion diamond, round vs cushion engagement ring'],

  ['GIA-Certified-Round-Diamond.jpg',
   'gia-certified-round-diamond-guide.avif',
   'GIA Certified Round Diamond — Complete Certificate Guide',
   'GIA vs IGI vs AGS certification for round diamonds explained — what the GIA Excellent cut grade means and how to read your certificate',
   'GIA certified round diamond, GIA diamond certificate guide, GIA vs IGI diamond, GIA excellent cut round, round diamond certification'],
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
        .avif({ quality: 80 })
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
  console.log('\nDone — 10 featured images processed.');
}

run().catch(console.error);
