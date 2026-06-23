import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, "../public/images");

const jobs = [
  {
    input: path.join(imgDir, "round-diamond-vs1-vs-vs2.jpeg"),
    output: path.join(imgDir, "round-diamond-vs1-vs-vs2-1.avif"),
    title: "Round Diamond VS1 vs VS2 Clarity Comparison",
    description: "Round diamond VS1 versus VS2 clarity audit at 1ct showing GIA graded stones G-VS2 at $3,230 and G-VS1 at $3,300 with The VS Split concept on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-vs1-vs-vs2 image 2.jpeg"),
    output: path.join(imgDir, "round-diamond-vs1-vs-vs2-2.avif"),
    title: "VS2 vs VS1 Price Gap at 3 Carats",
    description: "Round diamond VS2 versus VS1 price gap comparison at 3 carat showing $5,860 premium for VS1 certificate with lab 3ct D-VVS1 alternative at $7,000 on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-2-carat-vs-3-carat.jpeg"),
    output: path.join(imgDir, "round-diamond-2-carat-vs-3-carat-1.avif"),
    title: "2 Carat vs 3 Carat Round Diamond Size Comparison",
    description: "2 carat round diamond at 8.1mm versus 3 carat at 9.4mm face-up size comparison showing 196% price increase for 35% more face-up area with The Luxury Jump Tax concept on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-2-carat-vs-3-carat image 2.jpeg"),
    output: path.join(imgDir, "round-diamond-2-carat-vs-3-carat-2.avif"),
    title: "2ct vs 3ct Diamond Natural vs Lab Budget Matrix",
    description: "2 carat versus 3 carat round diamond natural and lab-grown budget matrix showing lab 3ct D-VVS1 IGI at $7,000 versus natural 3ct G-VS2 at $48,780 on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-f-vs-g-color.jpeg"),
    output: path.join(imgDir, "round-diamond-f-vs-g-color-1.avif"),
    title: "F vs G Color Round Diamond 1-Carat Comparison",
    description: "F color versus G color round diamond 1-carat audit showing GIA graded F-VS2 at $3,490 versus G-VS2 at $3,230 with The Colorless Entry Tax concept on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-f-vs-g-color image 2.jpeg"),
    output: path.join(imgDir, "round-diamond-f-vs-g-color-2.avif"),
    title: "F vs G Color Diamond Setting Metal Decision Guide",
    description: "F versus G color round diamond metal setting decision guide showing platinum versus yellow gold setting impact on color perception at 1ct through 3ct on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-solitaire-ring.jpeg"),
    output: path.join(imgDir, "round-diamond-solitaire-ring-1.avif"),
    title: "Round Diamond Solitaire Ring 4-Prong vs 6-Prong Guide",
    description: "Round diamond solitaire ring 4-prong versus 6-prong setting guide with metal decision matrix showing platinum 18k white gold and yellow gold options with The Solitaire Standard concept on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-solitaire-ring image 2.jpeg"),
    output: path.join(imgDir, "round-diamond-solitaire-ring-2.avif"),
    title: "Round Diamond Solitaire Budget Matrix $3,500 to $16,000",
    description: "Round diamond solitaire ring budget matrix from $3,500 to $16,000 showing 1ct G-VS2 entry through 2ct G-VS2 premium with lab alternatives and cut grade priority on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-vs-moissanite.jpeg"),
    output: path.join(imgDir, "round-diamond-vs-moissanite-1.avif"),
    title: "Round Diamond vs Moissanite 1-Carat Price Comparison",
    description: "Round diamond versus moissanite 1-carat price comparison showing Charles & Colvard DEF at $380 versus GIA G-VS1 natural at $3,300 with chemical formula difference SiC versus C on white editorial background",
  },
  {
    input: path.join(imgDir, "round-diamond-vs-moissanite image 2.jpeg"),
    output: path.join(imgDir, "round-diamond-vs-moissanite-2.avif"),
    title: "Lab-Grown Diamond vs Moissanite Budget Grid",
    description: "Lab-grown diamond versus moissanite budget comparison grid showing 1.5ct IGI D-VVS1 at $1,950 and 2ct IGI D-VVS1 at $2,810 versus moissanite equivalents with The Carbon Copy Question concept on white editorial background",
  },
];

for (const job of jobs) {
  try {
    await sharp(job.input)
      .resize(1500, 1000, { fit: "cover", position: "centre" })
      .avif({ quality: 82 })
      .toFile(job.output);

    await exiftool.write(job.output, {
      Title: job.title,
      Description: job.description,
      Creator: "DiamondCritics",
      Copyright: `© ${new Date().getFullYear()} DiamondCritics`,
    });

    console.log(`✓ ${path.basename(job.output)}`);
  } catch (err) {
    console.error(`✗ ${path.basename(job.output)}: ${err.message}`);
  }
}

await exiftool.end();
console.log("Done.");
