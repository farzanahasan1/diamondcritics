import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "Round-Diamond-Pavilion-Angle.jpg",
    dest: "round-diamond-pavilion-angle-featured.avif",
    title: "Round Diamond Pavilion Angle Guide 2026 — The Return Gate",
    description: "Round diamond pavilion angle: 40.6–41.0° is The Return Gate for maximum light return. Below 40° causes light leakage, above 42° creates nailhead. GIA Excellent range 40.6–41.8° explained with real price data.",
    keywords: "round diamond pavilion angle, return gate, pavilion angle GIA excellent, diamond light return, pavilion angle 40.6 41 optimal",
  },
  {
    src: "Round-Diamond-Culet.jpg",
    dest: "round-diamond-culet-featured.avif",
    title: "Round Diamond Culet Guide 2026 — The Pinhole Effect Explained",
    description: "Round diamond culet: None or Pointed is the only correct answer. Medium+ culets create The Pinhole Effect — a dark circle visible face-up. GIA Excellent mandates None or Pointed. How to verify on your certificate.",
    keywords: "round diamond culet, pinhole effect diamond, culet none pointed, GIA culet grade, diamond culet size",
  },
  {
    src: "Round-Diamond-Polish.jpg",
    dest: "round-diamond-polish-featured.avif",
    title: "Round Diamond Polish Guide 2026 — The Polish Premium Myth",
    description: "Round diamond polish: Very Good polish performs the same as Excellent under real-world conditions. The Polish Premium Myth costs buyers 3–5% with zero visible benefit. GIA grades and real price data.",
    keywords: "round diamond polish, polish premium myth, GIA polish grades excellent very good, diamond polish grade, triple excellent diamond",
  },
  {
    src: "Round-Diamond-Symmetry.jpg",
    dest: "round-diamond-symmetry-featured.avif",
    title: "Round Diamond Symmetry 2026 — EX vs VG and The EX/VG/VG Rule",
    description: "Round diamond symmetry: GIA Very Good symmetry performs the same as Excellent in real-world conditions. The EX/VG/VG Rule — cut grade dominates polish and symmetry. Hearts and Arrows requirements explained.",
    keywords: "round diamond symmetry, EX VG rule, GIA symmetry grades, triple excellent diamond, hearts and arrows symmetry",
  },
  {
    src: "Round-Diamond-vs-Pear-Shape.jpg",
    dest: "round-diamond-vs-pear-shape-featured.avif",
    title: "Round Diamond vs Pear Shape 2026 — The Teardrop Compromise",
    description: "Round diamond vs pear shape: pear faces up 5–10% larger per carat. The Teardrop Compromise — bow-tie risk, tip color concentration, V-prong requirement. Real price data at 1ct and 2ct with lab-grown comparison.",
    keywords: "round diamond vs pear shape, pear cut diamond, teardrop compromise, pear diamond bowtie, round vs pear price",
  },
];

async function convertAll() {
  for (const job of jobs) {
    const srcPath = path.join(imagesDir, job.src);
    const destPath = path.join(imagesDir, job.dest);

    console.log(`Converting: ${job.src} → ${job.dest}`);

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
        Copyright: `© ${new Date().getFullYear()} DiamondCritics.com`,
      },
      ["-overwrite_original"]
    );

    console.log(`  ✓ Done: ${job.dest}`);
  }

  await exiftool.end();
  console.log("\nAll 5 featured images converted successfully.");
}

convertAll().catch(console.error);
