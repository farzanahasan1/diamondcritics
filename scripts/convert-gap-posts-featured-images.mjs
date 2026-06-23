import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";

const jobs = [
  {
    input: "public/images/Round-Diamond-Natural-vs-Lab-Grown.jpg",
    output: "public/images/round-diamond-natural-vs-lab-featured.avif",
    title: "Natural vs Lab Round Diamond: 2026 Buyer's Guide",
    description: "Natural vs lab-grown round diamond comparison: price, quality, and resale value explained.",
  },
  {
    input: "public/images/G-vs-H-Color-Round-Diamond.jpg",
    output: "public/images/round-diamond-g-vs-h-color-featured.avif",
    title: "G vs H Color Round Diamond 2026: Worth It?",
    description: "G vs H color round diamond guide: savings, setting compatibility, and when to choose each.",
  },
  {
    input: "public/images/Round-Diamond-SI2-Clarity.jpg",
    output: "public/images/round-diamond-si2-clarity-featured.avif",
    title: "Round Diamond SI2 Clarity: Eye-Clean? 2026",
    description: "SI2 clarity round diamond guide: eye-clean rates by carat size and when to avoid SI2.",
  },
  {
    input: "public/images/Round-Diamond-Three-Stone-Ring.jpg",
    output: "public/images/round-diamond-three-stone-ring-featured.avif",
    title: "Round Diamond Three-Stone Ring 2026: Complete Guide",
    description: "Round diamond three-stone ring guide: flanker ratios, metal choices, and budget breakdown.",
  },
];

for (const job of jobs) {
  await sharp(job.input)
    .resize(1500, 1000, { fit: "inside" })
    .avif({ quality: 82 })
    .toFile(job.output);

  await exiftool.write(
    job.output,
    {
      Title: job.title,
      Description: job.description,
      Creator: "DiamondCritics",
      Copyright: "© 2026 DiamondCritics",
    },
    ["-overwrite_original"]
  );

  console.log(`✓ ${path.basename(job.output)}`);
}

await exiftool.end();
console.log("Done.");
