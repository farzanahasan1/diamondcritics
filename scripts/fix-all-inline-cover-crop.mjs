/**
 * Fixes all inline images that were converted with fit:"cover" from 1376x768 sources.
 * Reconverts each with fit:"contain" + white background so no content is cropped.
 * Reads existing AVIF metadata and preserves it after reconversion.
 */
import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const d = (f) => path.join(__dirname, "../public/images", f);

// All source→output pairs from every batch script that used fit:"cover"
// batch5/6/7 (src/dest flat naming), batch9/11/13/round-cluster/batch2-3 (input/output)
const jobs = [
  // batch5 — si1, si1-vs-vs2
  { src: "round-diamond-si1-eye-clean-guide.jpeg",           out: "round-diamond-si1-eye-clean-guide.avif" },
  { src: "round-diamond-si1-vs-vs2-price-comparison.jpeg",   out: "round-diamond-si1-vs-vs2-price-comparison.avif" },

  // batch6 — crown, culet, girdle, pavilion, polish, symmetry, table
  { src: "round-diamond-crown-angle-diagram.jpeg",           out: "round-diamond-crown-angle-diagram.avif" },
  { src: "round-diamond-crown-angle-light-performance.jpeg", out: "round-diamond-crown-angle-light-performance.avif" },
  { src: "round-diamond-culet-comparison.jpeg",              out: "round-diamond-culet-comparison.avif" },
  { src: "round-diamond-culet-gia-certificate.jpeg",         out: "round-diamond-culet-gia-certificate.avif" },
  { src: "round-diamond-girdle-thickness-comparison.jpeg",   out: "round-diamond-girdle-thickness-comparison.avif" },
  { src: "round-diamond-girdle-thickness-diagram.jpeg",      out: "round-diamond-girdle-thickness-diagram.avif" },
  { src: "round-diamond-pavilion-angle-diagram.jpeg",        out: "round-diamond-pavilion-angle-diagram.avif" },
  { src: "round-diamond-pavilion-angle-light-return.jpeg",   out: "round-diamond-pavilion-angle-light-return.avif" },
  { src: "round-diamond-polish-comparison.jpeg",             out: "round-diamond-polish-comparison.avif" },
  { src: "round-diamond-polish-magnification.jpeg",          out: "round-diamond-polish-magnification.avif" },
  { src: "round-diamond-symmetry-comparison.jpeg",           out: "round-diamond-symmetry-comparison.avif" },
  { src: "round-diamond-symmetry-hearts-arrows.jpeg",        out: "round-diamond-symmetry-hearts-arrows.avif" },
  { src: "round-diamond-table-percentage-fire-brilliance-chart.jpeg", out: "round-diamond-table-percentage-fire-brilliance-chart.avif" },
  { src: "round-diamond-table-percentage-guide.jpeg",        out: "round-diamond-table-percentage-guide.avif" },

  // batch7 — asscher, heart, marquise, pear
  { src: "round-diamond-vs-asscher-cut-guide.jpeg",          out: "round-diamond-vs-asscher-cut-guide.avif" },
  { src: "round-diamond-vs-asscher-cut-clarity-comparison.jpeg", out: "round-diamond-vs-asscher-cut-clarity-comparison.avif" },
  { src: "round-diamond-vs-heart-shape-comparison.jpeg",     out: "round-diamond-vs-heart-shape-comparison.avif" },
  { src: "round-diamond-vs-heart-shape-symmetry.jpeg",       out: "round-diamond-vs-heart-shape-symmetry.avif" },
  { src: "round-diamond-vs-marquise-bowtie.jpeg",            out: "round-diamond-vs-marquise-bowtie.avif" },
  { src: "round-diamond-vs-marquise-size-comparison.jpeg",   out: "round-diamond-vs-marquise-size-comparison.avif" },
  { src: "round-diamond-vs-pear-shape-bowtie.jpeg",          out: "round-diamond-vs-pear-shape-bowtie.avif" },
  { src: "round-diamond-vs-pear-shape-comparison.jpeg",      out: "round-diamond-vs-pear-shape-comparison.avif" },

  // batch2-3 — 4ct, 5ct, gia-vs-igi
  { src: "4-carat-round-diamond-price-guide.jpeg",           out: "4-carat-round-diamond-price-guide.avif" },
  { src: "4-carat-round-diamond-size-comparison.jpeg",       out: "4-carat-round-diamond-size-comparison.avif" },
  { src: "5-carat-round-diamond-natural-vs-lab.jpeg",        out: "5-carat-round-diamond-natural-vs-lab.avif" },
  { src: "5-carat-round-diamond-size-comparison.jpeg",       out: "5-carat-round-diamond-size-comparison.avif" },
  { src: "round-diamond-gia-vs-igi-comparison.jpeg",         out: "round-diamond-gia-vs-igi-comparison.avif" },
  { src: "round-diamond-gia-vs-igi-price-value-chart.jpeg",  out: "round-diamond-gia-vs-igi-price-value-chart.avif" },

  // round-cluster — girdle/table already above, these are the extra ones
  // (all already covered above from the combined grep output)

  // batch9 — PNG sources (6ct, 7ct, halo-vs-solitaire, length-to-width, under-5000)
  { src: "6-carat-round-diamond-price-1.png",                out: "6-carat-round-diamond-price-1.avif" },
  { src: "6-carat-round-diamond-price-2.png",                out: "6-carat-round-diamond-price-2.avif" },
  { src: " 7-carat-round-diamond-price-2.png",               out: "7-carat-round-diamond-price-2.avif" },
  { src: "round-diamond-halo-vs-solitaire-1.png",            out: "round-diamond-halo-vs-solitaire-1.avif" },
  { src: "round-diamond-halo-vs-solitaire-2.png",            out: "round-diamond-halo-vs-solitaire-2.avif" },
  { src: "round-diamond-length-to-width-ratio-1.png",        out: "round-diamond-length-to-width-ratio-1.avif" },
  { src: "round-diamond-length-to-width-ratio-2.png",        out: "round-diamond-length-to-width-ratio-2.avif" },
  { src: "round-diamond-under-5000-1.png",                   out: "round-diamond-under-5000-1.avif" },
  { src: "round-diamond-under-5000-2.png",                   out: "round-diamond-under-5000-2.avif" },

  // batch11 — 8ct, under-10000, 1ct-vs-2ct, d-vs-g, vvs-vs-vs2
  { src: "8-carat-round-diamond-price-1.jpeg",               out: "8-carat-round-diamond-price-1.avif" },
  { src: "8-carat-round-diamond-price-2.jpeg",               out: "8-carat-round-diamond-price-2.avif" },
  { src: "round-diamond-under-10000-1.jpeg",                 out: "round-diamond-under-10000-1.avif" },
  { src: "round-diamond-under-10000-2.jpeg",                 out: "round-diamond-under-10000-2.avif" },
  { src: "round-diamond-1-carat-vs-2-carat-1.jpeg",          out: "round-diamond-1-carat-vs-2-carat-1.avif" },
  { src: "round-diamond-1-carat-vs-2-carat-2.jpeg",          out: "round-diamond-1-carat-vs-2-carat-2.avif" },
  { src: "round-diamond-d-color-vs-g-color-1.jpeg",          out: "round-diamond-d-color-vs-g-color-1.avif" },
  { src: "round-diamond-d-color-vs-g-color-2.jpeg",          out: "round-diamond-d-color-vs-g-color-2.avif" },
  { src: "round-diamond-vvs-vs-vs2-1.jpeg",                  out: "round-diamond-vvs-vs-vs2-1.avif" },
  { src: "round-diamond-vvs-vs-vs2-2.jpeg",                  out: "round-diamond-vvs-vs-vs2-2.avif" },

  // batch13 — vs1-vs-vs2, 2ct-vs-3ct, f-vs-g, solitaire, moissanite
  { src: "round-diamond-vs1-vs-vs2.jpeg",                    out: "round-diamond-vs1-vs-vs2-1.avif" },
  { src: "round-diamond-vs1-vs-vs2 image 2.jpeg",            out: "round-diamond-vs1-vs-vs2-2.avif" },
  { src: "round-diamond-2-carat-vs-3-carat.jpeg",            out: "round-diamond-2-carat-vs-3-carat-1.avif" },
  { src: "round-diamond-2-carat-vs-3-carat image 2.jpeg",    out: "round-diamond-2-carat-vs-3-carat-2.avif" },
  { src: "round-diamond-f-vs-g-color.jpeg",                  out: "round-diamond-f-vs-g-color-1.avif" },
  { src: "round-diamond-f-vs-g-color image 2.jpeg",          out: "round-diamond-f-vs-g-color-2.avif" },
  { src: "round-diamond-solitaire-ring.jpeg",                out: "round-diamond-solitaire-ring-1.avif" },
  { src: "round-diamond-solitaire-ring image 2.jpeg",        out: "round-diamond-solitaire-ring-2.avif" },
  { src: "round-diamond-vs-moissanite.jpeg",                 out: "round-diamond-vs-moissanite-1.avif" },
  { src: "round-diamond-vs-moissanite image 2.jpeg",         out: "round-diamond-vs-moissanite-2.avif" },
];

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const job of jobs) {
  const srcPath = d(job.src);
  const outPath = d(job.out);

  if (!existsSync(srcPath)) {
    console.warn(`⚠ source missing: ${job.src}`);
    skipped++;
    continue;
  }
  if (!existsSync(outPath)) {
    console.warn(`⚠ output missing (not yet converted): ${job.out}`);
    skipped++;
    continue;
  }

  try {
    // 1. Read existing metadata from current AVIF
    const tags = await exiftool.read(outPath);
    const meta = {
      Title: tags.Title || "",
      Description: tags.Description || "",
      Creator: tags.Creator || "DiamondCritics",
      Copyright: tags.Copyright || `© ${new Date().getFullYear()} DiamondCritics`,
    };

    // 2. Check source dimensions — skip if already 1500×1000 (no crop needed)
    const srcMeta = await sharp(srcPath).metadata();
    if (srcMeta.width === 1500 && srcMeta.height === 1000) {
      console.log(`— already correct dims, skip: ${job.src}`);
      skipped++;
      continue;
    }

    // 3. Reconvert with contain (no cropping)
    await sharp(srcPath)
      .resize(1500, 1000, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .avif({ quality: 82 })
      .toFile(outPath);

    // 4. Re-write metadata
    await exiftool.write(outPath, meta);

    console.log(`✓ fixed (${srcMeta.width}×${srcMeta.height}→contain): ${job.out}`);
    fixed++;
  } catch (err) {
    console.error(`✗ ${job.out}: ${err.message}`);
    errors++;
  }
}

await exiftool.end();
console.log(`\nDone. Fixed: ${fixed} | Skipped: ${skipped} | Errors: ${errors}`);
