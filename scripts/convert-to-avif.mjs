import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('public/images');
const files = fs.readdirSync(imagesDir);

const eligible = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));

let ok = 0, skip = 0, fail = 0;

for (const file of eligible) {
  const src = path.join(imagesDir, file);
  const base = file.replace(/\.(jpe?g|png|webp)$/i, '');
  const dest = path.join(imagesDir, base + '.avif');

  if (fs.existsSync(dest)) { skip++; continue; }

  try {
    await sharp(src)
      .avif({ quality: 72, effort: 6 })
      .toFile(dest);
    const origSize = fs.statSync(src).size;
    const avifSize = fs.statSync(dest).size;
    const pct = Math.round((1 - avifSize / origSize) * 100);
    console.log(`✓ ${file} → ${base}.avif  (${pct}% smaller)`);
    ok++;
  } catch (e) {
    console.log(`✗ ${file}: ${e.message}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} converted, ${skip} skipped, ${fail} failed.`);
