import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    src: "round-diamond-pavilion-angle-diagram.jpeg",
    dest: "round-diamond-pavilion-angle-diagram.avif",
    title: "Round Diamond Pavilion Angle Diagram — The Return Gate Cross-Section",
    description: "Cross-section diagram showing three pavilion angle scenarios: below 40° light leakage, 40.6–41.0° The Return Gate optimal, above 42° nailhead effect. Light ray paths illustrated for each.",
    keywords: "round diamond pavilion angle diagram, return gate diagram, pavilion angle light return, diamond cross section, pavilion angle 40.6 41",
  },
  {
    src: "round-diamond-pavilion-angle-light-return.jpeg",
    dest: "round-diamond-pavilion-angle-light-return.avif",
    title: "Round Diamond Pavilion Angle Light Return — Shallow vs Ideal vs Deep",
    description: "Three round brilliant diamonds face-up showing optical performance by pavilion angle: shallow shows light leakage, ideal 40.6–41° shows maximum brilliance, deep shows nailhead dark center effect.",
    keywords: "round diamond pavilion angle light return, shallow deep pavilion comparison, nailhead diamond, diamond light performance face up",
  },
  {
    src: "round-diamond-culet-comparison.jpeg",
    dest: "round-diamond-culet-comparison.avif",
    title: "Round Diamond Culet Size Comparison — None vs Pointed vs Medium vs Large",
    description: "Four round brilliant diamonds face-up comparing culet grades: None and Pointed show clean centers, Medium shows The Pinhole Effect beginning, Large shows prominent dark circle face-up.",
    keywords: "round diamond culet comparison, culet none pointed medium large, pinhole effect diamond, culet size face up, GIA culet grades",
  },
  {
    src: "round-diamond-culet-gia-certificate.jpeg",
    dest: "round-diamond-culet-gia-certificate.avif",
    title: "Round Diamond Culet on GIA Certificate — Where to Find the Culet Grade",
    description: "Illustrated GIA grading report showing the Proportions section with Culet: None highlighted. Annotation showing where to find and verify culet grade on any GIA diamond certificate before purchase.",
    keywords: "round diamond culet GIA certificate, culet grade certificate, GIA proportions section, diamond certificate culet, verify culet grade",
  },
  {
    src: "round-diamond-polish-comparison.jpeg",
    dest: "round-diamond-polish-comparison.avif",
    title: "Round Diamond Polish Grades — GIA Excellent vs Very Good Under 10x Magnification",
    description: "Two diamond facet surfaces under 10x magnification: GIA Excellent shows perfectly smooth surface, GIA Very Good shows barely visible polish line. Caption confirms both appear identical to the naked eye.",
    keywords: "round diamond polish comparison, GIA excellent vs very good polish, polish grade magnification, diamond facet surface quality",
  },
  {
    src: "round-diamond-polish-magnification.jpeg",
    dest: "round-diamond-polish-magnification.avif",
    title: "Round Diamond Polish Features Under 10x Magnification — GIA Grading Scale",
    description: "Diamond facet surface at 10x magnification with five annotated polish features: abrasion, scratch, burn mark, polish lines, extra facet. GIA 5-point scale bar from Excellent to Poor shown below.",
    keywords: "round diamond polish features magnification, GIA polish scale, diamond abrasion scratch burn mark, polish lines extra facet, diamond polish grades",
  },
  {
    src: "round-diamond-symmetry-comparison.jpeg",
    dest: "round-diamond-symmetry-comparison.avif",
    title: "Round Diamond Symmetry Grades — GIA Excellent vs Very Good Face-Up Comparison",
    description: "Two round brilliant diamonds face-up comparing GIA Excellent and Very Good symmetry grades. Both show near-identical 8-fold star facet pattern. Schematic overlays show facet alignment difference only visible under magnification.",
    keywords: "round diamond symmetry comparison, GIA excellent vs very good symmetry, diamond symmetry face up, symmetry grades round brilliant",
  },
  {
    src: "round-diamond-symmetry-hearts-arrows.jpeg",
    dest: "round-diamond-symmetry-hearts-arrows.avif",
    title: "Round Diamond Hearts and Arrows Pattern — Excellent vs Very Good Symmetry",
    description: "Hearts and Arrows optical pattern comparison: GIA Excellent symmetry shows perfect 8 arrowheads face-up and 8 clean hearts face-down. GIA Very Good symmetry shows slight heart variation. H&A requires Excellent symmetry.",
    keywords: "round diamond hearts and arrows, GIA excellent symmetry hearts arrows, H&A pattern symmetry, diamond hearts arrows viewer, excellent symmetry required",
  },
  {
    src: "round-diamond-vs-pear-shape-comparison.jpeg",
    dest: "round-diamond-vs-pear-shape-comparison.avif",
    title: "Round Diamond vs Pear Shape Face-Up Size Comparison — 1ct Side by Side",
    description: "Round brilliant and pear shape diamonds at identical 1.00ct weight shown face-up to scale. Round 6.4mm circle vs pear 10.5mm × 6.5mm teardrop with face-up surface area comparison: 32mm² vs 42mm².",
    keywords: "round diamond vs pear shape size comparison, pear diamond face up size, round vs pear 1ct, pear diamond larger than round, teardrop diamond size",
  },
  {
    src: "round-diamond-vs-pear-shape-bowtie.jpeg",
    dest: "round-diamond-vs-pear-shape-bowtie.avif",
    title: "Pear Diamond Bow-Tie Evaluation Scale — Grade 1 Through Grade 4 Severity",
    description: "Four pear-shaped diamonds face-up showing bow-tie severity grades: Grade 1 no bow-tie, Grade 2 faint, Grade 3 moderate, Grade 4 strong with label 'Do not buy.' Guide for evaluating pear diamond bow-tie in HD video.",
    keywords: "pear diamond bowtie evaluation, pear bowtie grade 1 2 3 4, pear diamond bowtie scale, how to evaluate pear bowtie, pear diamond bowtie severity",
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
