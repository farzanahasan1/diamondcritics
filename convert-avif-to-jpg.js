const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public/images');
const POSTS_DIR = path.join(__dirname, 'content/posts');

async function convertAll() {
  // ── 1. Find all AVIF files ──────────────────────────────────────────────
  const allFiles = fs.readdirSync(IMAGES_DIR);
  const avifFiles = allFiles.filter(f => f.toLowerCase().endsWith('.avif'));
  console.log(`Found ${avifFiles.length} AVIF files to convert\n`);

  const success = [];
  const failed = [];

  // ── 2. Convert each AVIF → JPG ─────────────────────────────────────────
  for (let i = 0; i < avifFiles.length; i++) {
    const avifFile = avifFiles[i];
    const avifPath = path.join(IMAGES_DIR, avifFile);
    const jpgFile = avifFile.replace(/\.avif$/i, '.jpg');
    const jpgPath = path.join(IMAGES_DIR, jpgFile);

    try {
      // Skip if JPG already exists and is newer than the AVIF
      if (fs.existsSync(jpgPath)) {
        const avifMtime = fs.statSync(avifPath).mtimeMs;
        const jpgMtime = fs.statSync(jpgPath).mtimeMs;
        if (jpgMtime >= avifMtime) {
          success.push({ avif: avifFile, jpg: jpgFile, skipped: true });
          process.stdout.write(`[${i+1}/${avifFiles.length}] SKIP (JPG exists) ${avifFile}\n`);
          continue;
        }
      }

      await sharp(avifPath)
        .jpeg({ quality: 82, mozjpeg: true })
        .withMetadata()   // preserve EXIF/colour profile/orientation
        .toFile(jpgPath);

      success.push({ avif: avifFile, jpg: jpgFile, skipped: false });
      process.stdout.write(`[${i+1}/${avifFiles.length}] ✓ ${avifFile} → ${jpgFile}\n`);
    } catch (err) {
      failed.push({ file: avifFile, error: err.message });
      process.stdout.write(`[${i+1}/${avifFiles.length}] ✗ FAILED ${avifFile}: ${err.message}\n`);
    }
  }

  console.log(`\n── Conversion done: ${success.filter(s=>!s.skipped).length} converted, ${success.filter(s=>s.skipped).length} skipped, ${failed.length} failed ──\n`);

  if (failed.length > 0) {
    console.log('FAILED FILES:');
    failed.forEach(f => console.log(`  ${f.file}: ${f.error}`));
    console.log('');
  }

  // ── 3. Update all .mdoc post files ────────────────────────────────────
  const mdocFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdoc'));
  console.log(`Scanning ${mdocFiles.length} post files for .avif references...\n`);

  const updatedPosts = [];

  for (const mdoc of mdocFiles) {
    const mdocPath = path.join(POSTS_DIR, mdoc);
    const original = fs.readFileSync(mdocPath, 'utf8');

    if (!original.includes('.avif')) continue;

    const updated = original.replace(/\.avif/gi, '.jpg');
    fs.writeFileSync(mdocPath, updated, 'utf8');
    updatedPosts.push(mdoc);

    const count = (original.match(/\.avif/gi) || []).length;
    console.log(`  Updated ${mdoc} (${count} references)`);
  }

  console.log(`\nUpdated ${updatedPosts.length} post files\n`);

  // ── 4. Delete old AVIF files (only those successfully converted) ───────
  const toDelete = success.filter(s => !s.skipped);
  console.log(`Deleting ${toDelete.length} original AVIF files...`);

  let deleted = 0;
  for (const { avif } of toDelete) {
    try {
      fs.unlinkSync(path.join(IMAGES_DIR, avif));
      deleted++;
    } catch (err) {
      console.error(`  Could not delete ${avif}: ${err.message}`);
    }
  }

  console.log(`Deleted ${deleted} AVIF files\n`);

  // ── 5. Generate URL list for Google Search Console ───────────────────
  const BASE_URL = 'https://diamondcritics.com';
  const slugs = updatedPosts.map(f => f.replace('.mdoc', ''));
  const urls = slugs.map(slug => `${BASE_URL}/${slug}/`);

  fs.writeFileSync(
    path.join(__dirname, 'indexing-urls.txt'),
    urls.join('\n') + '\n'
  );
  console.log(`Wrote ${urls.length} URLs to indexing-urls.txt for Google Search Console\n`);

  // ── 6. Final summary ─────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════');
  console.log(`AVIF files converted : ${success.filter(s=>!s.skipped).length}`);
  console.log(`AVIF files skipped   : ${success.filter(s=>s.skipped).length}`);
  console.log(`AVIF files failed    : ${failed.length}`);
  console.log(`AVIF files deleted   : ${deleted}`);
  console.log(`Posts updated        : ${updatedPosts.length}`);
  console.log(`URLs written         : ${urls.length}`);
  console.log('═══════════════════════════════════════════════════════');
}

convertAll().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
