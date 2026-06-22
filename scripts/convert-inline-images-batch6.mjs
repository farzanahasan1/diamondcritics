import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "5-carat-round-diamond-size-comparison.jpeg",
    dest: "5-carat-round-diamond-size-comparison.avif",
    title: "5 Carat Round Diamond Size Comparison — 1ct to 5ct True Scale Guide",
    description: "5 carat round diamond size comparison: 1ct 6.4mm, 2ct 8.1mm, 3ct 9.4mm, 4ct 10.2mm, 5ct 11.0mm. Per-carat price doubles from 4ct to 5ct — The Prestige Premium. Real Blue Nile prices.",
    keywords: "5 carat round diamond size, 5ct diamond millimeter, round diamond size comparison, 5 carat diamond ring, prestige diamond size",
  },
  {
    src: "5-carat-round-diamond-natural-vs-lab.jpeg",
    dest: "5-carat-round-diamond-natural-vs-lab.avif",
    title: "5 Carat Natural vs Lab-Grown Round Diamond Price Comparison 2026",
    description: "5ct natural GIA round diamond from $147,110 vs lab-grown GIA 5ct from $13,150. The Prestige Premium: 91% savings with identical optical performance. Real Blue Nile price comparison.",
    keywords: "5 carat lab grown diamond, 5ct natural vs lab diamond, lab grown 5ct round, diamond price comparison, 5 carat diamond cost",
  },
  {
    src: "round-diamond-vs-heart-shape-comparison.jpeg",
    dest: "round-diamond-vs-heart-shape-comparison.avif",
    title: "Round Diamond vs Heart Shape Comparison — Quality Requirements and Price",
    description: "Round diamond vs heart shape: round needs G-H color and VS2 clarity. Heart shape needs F-G color and VS1 clarity. The Romance Tax — similar price, stricter quality requirements for heart shape.",
    keywords: "round vs heart shape diamond, heart shape diamond quality, heart diamond color grade, round diamond vs heart, heart shape clarity requirement",
  },
  {
    src: "round-diamond-vs-heart-shape-symmetry.jpeg",
    dest: "round-diamond-vs-heart-shape-symmetry.avif",
    title: "Heart Shape Diamond Symmetry Guide — Cleft, Lobes, and Wing Evaluation",
    description: "Heart shape diamond symmetry evaluation: lobes must match within 5%, cleft centered, wings curved symmetrically. The Cleft Symmetry Trap — asymmetric lobes ruin the heart silhouette. HD video required.",
    keywords: "heart shape diamond symmetry, heart diamond cleft symmetry, heart diamond lobes, heart shape evaluation, heart diamond symmetry guide",
  },
  {
    src: "round-diamond-vs-marquise-size-comparison.jpeg",
    dest: "round-diamond-vs-marquise-size-comparison.avif",
    title: "Round Diamond vs Marquise Size Comparison — Elongation Trade-Off",
    description: "Round vs marquise 1ct: round 6.4mm circle vs marquise 12x6mm elongated. Marquise faces up 75% larger by area. The Elongation Trade-Off: size gain vs bow-tie risk and stricter color grade.",
    keywords: "round vs marquise diamond, marquise diamond size, elongation trade-off diamond, marquise vs round carat, marquise diamond face-up size",
  },
  {
    src: "round-diamond-vs-marquise-bowtie.jpeg",
    dest: "round-diamond-vs-marquise-bowtie.avif",
    title: "Marquise Diamond Bow-Tie Severity Scale — Grade 1 to 5 Evaluation Guide",
    description: "Marquise diamond bow-tie grading scale: Grade 1 (no bow-tie) to Grade 5 (severe). 40–50% of marquise cuts have visible bow-tie. Target Grade 1–2. Always verify in HD video before purchase.",
    keywords: "marquise diamond bow-tie, bowtie grading scale, marquise cut bowtie, how to evaluate marquise diamond, marquise diamond defect",
  },
  {
    src: "round-diamond-crown-angle-diagram.jpeg",
    dest: "round-diamond-crown-angle-diagram.avif",
    title: "Round Diamond Crown Angle Diagram — The Scintillation Gate at 34–35°",
    description: "Round diamond crown angle: 34–35° is the Scintillation Gate for maximum fire. GIA Excellent range 32.7–36.0°. Below 32°: fisheye effect. Above 36.5°: nailhead effect. Crown angle diagram.",
    keywords: "round diamond crown angle, scintillation gate diamond, crown angle GIA excellent, diamond crown angle diagram, fisheye diamond effect",
  },
  {
    src: "round-diamond-crown-angle-light-performance.jpeg",
    dest: "round-diamond-crown-angle-light-performance.avif",
    title: "Crown Angle vs Light Performance — Fire and Brilliance at 32°, 34–35°, 38°",
    description: "Crown angle light performance comparison: 28–32° creates fisheye (light escapes through girdle), 34–35° Scintillation Gate (peak fire and brilliance), 38° creates nailhead (dark center table).",
    keywords: "crown angle light performance, diamond fire brilliance, scintillation gate, crown angle fisheye nailhead, round diamond light return",
  },
  {
    src: "round-diamond-girdle-thickness-diagram.jpeg",
    dest: "round-diamond-girdle-thickness-diagram.avif",
    title: "Round Diamond Girdle Thickness Grades — GIA 8-Level Scale Explained",
    description: "GIA girdle thickness grades: Extremely Thin to Extremely Thick. GIA Excellent mandates Thin to Slightly Thick. The Invisible Weight Trap: Very Thick girdles hide 5–7% carat weight in the girdle band.",
    keywords: "round diamond girdle thickness, GIA girdle grades, diamond girdle, invisible weight trap diamond, girdle thickness round diamond",
  },
  {
    src: "round-diamond-girdle-thickness-comparison.jpeg",
    dest: "round-diamond-girdle-thickness-comparison.avif",
    title: "Diamond Girdle Thickness Face-Up Size Comparison — Medium vs Very Thick",
    description: "Girdle thickness face-up size impact: Medium girdle 6.4mm, Slightly Thick 6.3mm, Very Thick 6.1mm. A Very Thick girdle turns a 1ct diamond into 0.93ct appearance while charging 1ct price.",
    keywords: "girdle thickness face-up size, diamond invisible weight trap, thick girdle round diamond, girdle thickness comparison, round diamond face-up diameter",
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
  console.log("\nAll 10 inline images converted successfully.");
}

convertAll().catch(console.error);
