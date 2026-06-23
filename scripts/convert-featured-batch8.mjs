import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "6-Carat-Round-Diamond-Price.jpg",
    dest: "6-carat-round-diamond-price-featured.avif",
    title: "6 Carat Round Diamond Price Guide",
    description: "6 carat round diamond price guide showing the Six-Figure Threshold — starting at $187,650 for GIA Excellent G-VS2",
    keywords: "6 carat round diamond price, six carat diamond cost, 6ct round diamond, GIA excellent 6 carat",
  },
  {
    src: "7-Carat-Round-Diamond-Price.jpg",
    dest: "7-carat-round-diamond-price-featured.avif",
    title: "7 Carat Round Diamond Price Guide",
    description: "7 carat round diamond price guide — only 7 GIA Excellent stones available, starting at $243,640 on Blue Nile",
    keywords: "7 carat round diamond price, seven carat diamond cost, 7ct round diamond, rare diamond",
  },
  {
    src: "Round-Diamond-Halo-vs-Solitaire.jpg",
    dest: "round-diamond-halo-vs-solitaire-featured.avif",
    title: "Round Diamond Halo vs Solitaire Ring Guide",
    description: "Round diamond halo versus solitaire engagement ring comparison — The Halo Illusion Tax explained",
    keywords: "round diamond halo vs solitaire, halo engagement ring, solitaire ring, diamond ring settings",
  },
  {
    src: "Round-Diamond-Length-to-Width-Ratio.jpg",
    dest: "round-diamond-length-to-width-ratio-featured.avif",
    title: "Round Diamond Length to Width Ratio Guide",
    description: "Round diamond length to width ratio guide — The Perfect Circle Rule: why 1.00–1.01 guarantees a true circular outline",
    keywords: "round diamond length to width ratio, diamond L:W ratio, perfect circle diamond, round diamond proportions",
  },
  {
    src: "Best-Round-Diamond-Under-$5,000.jpg",
    dest: "round-diamond-under-5000-featured.avif",
    title: "Best Round Diamond Under $5,000 Guide",
    description: "Best round diamond under $5,000 — The $5K Sweet Spot: 1ct GIA Excellent G-VS2 at $3,230 or lab-grown 2ct at $2,810",
    keywords: "round diamond under 5000, best diamond under $5000, 1 carat diamond budget, affordable round diamond",
  },
];

for (const job of jobs) {
  const srcPath = path.join(imgDir, job.src);
  const destPath = path.join(imgDir, job.dest);

  try {
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
        Copyright: "© 2026 DiamondCritics.com",
      },
      ["-overwrite_original"]
    );

    const { size } = await sharp(destPath).metadata();
    console.log(`✓ ${job.dest} — done`);
  } catch (err) {
    console.error(`✗ ${job.src}: ${err.message}`);
  }
}

await exiftool.end();
console.log("\nAll done.");
