import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const imagesDir = path.resolve("public/images");

const jobs = [
  {
    src: "1.5-Carat-Round-Diamond-Price-Guide-2026-—-The-$8,500-Sweet-Spot-Explained.jpg",
    dest: "1-5-carat-round-diamond-price-2026-featured.avif",
    title: "1.5 Carat Round Diamond Price Guide 2026 — The $8,500 Sweet Spot Explained",
    description: "GIA Excellent G-VS2 1.5ct natural starts at $8,430. Lab-grown 1.5ct D-VVS1 starts at $1,950. Full grade breakdown and buying strategy.",
    keywords: "1.5 carat round diamond price, 1.5ct diamond cost, round diamond 2026",
  },
  {
    src: "How-to-Buy-a-Round-Diamond-in-2026--The-5-Step-Checklist-That-Saves-$3,000+.jpg",
    dest: "how-to-buy-round-diamond-2026-featured.avif",
    title: "How to Buy a Round Diamond in 2026 — The 5-Step Checklist That Saves $3,000+",
    description: "5-step round diamond buying checklist: GIA Excellent cut, G color, VS2 clarity, proportions check, Blue Nile HD video review.",
    keywords: "how to buy round diamond, round diamond buying guide, GIA Excellent cut checklist",
  },
  {
    src: "Round-Diamond-Depth-Percentage-Guide.jpg",
    dest: "round-diamond-depth-percentage-2026-featured.avif",
    title: "Round Diamond Depth Percentage Guide 2026 — The Deep-Cut Trap and Ideal Range",
    description: "Ideal round diamond depth range is 59–62.3% for GIA Excellent. Diamonds above 63% depth look small for their carat weight.",
    keywords: "round diamond depth percentage, diamond depth ideal range, deep cut trap",
  },
  {
    src: "Round-Diamond-vs-Emerald-Cut--Which-to-Buy.jpg",
    dest: "round-diamond-vs-emerald-cut-2026-featured.avif",
    title: "Round Diamond vs Emerald Cut — Which to Buy in 2026?",
    description: "Round vs emerald cut compared on brilliance, the Clarity Tax, price, and which to buy at every budget.",
    keywords: "round diamond vs emerald cut, emerald cut clarity tax, round vs emerald price",
  },
  {
    src: "Round-Diamond-vs-Radiant-Cut--Which-to-Buy.jpg",
    dest: "round-diamond-vs-radiant-cut-2026-featured.avif",
    title: "Round Diamond vs Radiant Cut — Which to Buy in 2026?",
    description: "Round vs radiant cut compared on sparkle, GIA cut grade availability, price, and resale value.",
    keywords: "round diamond vs radiant cut, hybrid trap, round vs radiant price comparison",
  },
];

async function convert(job) {
  const srcPath = path.join(imagesDir, job.src);
  const destPath = path.join(imagesDir, job.dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source not found: ${job.src}`);
    return;
  }

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
      Creator: "DiamondCritics.com",
      Copyright: `© ${new Date().getFullYear()} DiamondCritics.com`,
      XPTitle: job.title,
      XPComment: job.description,
      XPKeywords: job.keywords,
      XPAuthor: "Farzana Hasan",
    },
    ["-overwrite_original"]
  );

  const size = fs.statSync(destPath).size;
  console.log(`✅ ${job.dest} (${Math.round(size / 1024)}KB)`);
}

for (const job of jobs) {
  await convert(job);
}

await exiftool.end();
console.log("\nAll 5 featured images converted.");
