import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const SRC = "/Users/mehedihasan/Downloads";
const DEST = "public/images";

const jobs = [
  {
    input: `${SRC}/round-diamond-video-inspection-dark-center.jpeg`,
    output: `${DEST}/round-diamond-video-inspection-dark-center.avif`,
    title: "Round Diamond Video Inspection: Dark Center Failure Guide",
    description: "Round diamond video inspection showing PASS versus FAIL dark center comparison with pavilion angle 40.8 degrees versus 41.3 degrees, light return diagram, and The Video Mandate concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-video-light-return-guide.jpeg`,
    output: `${DEST}/round-diamond-video-light-return-guide.avif`,
    title: "Round Diamond Video Inspection: 5-Step Light Return Protocol",
    description: "Round diamond 5-step video mandate protocol showing light return pass versus fail, dark center check, extinction zones, fluorescence haze detection, and brilliance spread test on white editorial background",
  },
  {
    input: `${SRC}/gia-diamond-report-reading-guide.jpeg`,
    output: `${DEST}/gia-diamond-report-reading-guide.avif`,
    title: "GIA Diamond Report Reading Guide: All 22 Fields Explained",
    description: "GIA diamond report reading guide showing 4Cs zone and proportions zone with all 22 fields annotated, hard reject signal for clouds not shown comment, and The Report Literacy Test concept on white editorial background",
  },
  {
    input: `${SRC}/gia-report-proportions-section-explained.jpeg`,
    output: `${DEST}/gia-report-proportions-section-explained.avif`,
    title: "GIA Report Proportions Section: Pass and Reject Ranges Explained",
    description: "GIA diamond report proportions section showing cross-section diagram with table depth crown pavilion girdle culet annotations, ideal pass ranges versus reject triggers, and reference stone 29090690 data on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-12-point-audit-checklist.jpeg`,
    output: `${DEST}/round-diamond-12-point-audit-checklist.avif`,
    title: "Round Diamond 12-Point Audit Checklist: Pass and Fail Guide",
    description: "Round diamond 12-point audit checklist showing PASS stone 29090690 1ct G-VS2 at $3,230 versus FAIL stone with depth 63.1 at same price, all 12 checkpoints with pass fail criteria, and The 12-Point Diamond Audit concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-buying-checklist-quick-reference.jpeg`,
    output: `${DEST}/round-diamond-buying-checklist-quick-reference.avif`,
    title: "Round Diamond Benchmark Prices 2026: Quick Reference Table",
    description: "Round diamond benchmark price table showing 1ct G-VS2 at $3,230, 1ct F-VS2 at $3,490, 0.90ct G-VS1 at $2,487, 2ct G-VS2 at $16,490, 3ct G-VS2 at $48,780 with per-carat premiums and lab alternative at $1,950 on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-fluorescence-grade-price-impact.jpeg`,
    output: `${DEST}/round-diamond-fluorescence-grade-price-impact.avif`,
    title: "Round Diamond Fluorescence Grade Price Impact Chart",
    description: "Round diamond fluorescence discount chart showing None baseline $3,230 versus Strong Blue $2,810 saving $420, discount percentages by grade from Faint 0-2 percent through Very Strong 10-25 percent, haze risk by grade, and The Fluorescence Discount concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-fluorescence-daylight-vs-indoor.jpeg`,
    output: `${DEST}/round-diamond-fluorescence-daylight-vs-indoor.avif`,
    title: "Round Diamond Fluorescence: Daylight vs Indoor LED Visibility",
    description: "Round diamond Strong Blue fluorescence comparison showing invisible under indoor LED versus visible as blue-white brightness under outdoor noon sun UV, with haze risk data by grade and J-colour double discount strategy on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-inclusion-types-hierarchy-chart.jpeg`,
    output: `${DEST}/round-diamond-inclusion-types-hierarchy-chart.avif`,
    title: "Round Diamond Inclusion Types: 3-Tier Risk Hierarchy Chart",
    description: "Round diamond inclusion hierarchy showing Tier 1 structural risk feather chip cavity indented natural, Tier 2 optical impact cloud knot etch channel, Tier 3 benign crystal pinpoint needle twinning wisp, and The Inclusion Hierarchy concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-gia-plot-diagram-guide.jpeg`,
    output: `${DEST}/round-diamond-gia-plot-diagram-guide.avif`,
    title: "GIA Clarity Plot Diagram: 6-Step Reading Protocol Guide",
    description: "GIA diamond clarity plot reading guide showing PASS VS2 with crystals at girdle versus REJECT VS2 with feather under table, symbol key for all inclusion types, 6-step reading protocol, and hard reject signal for clouds not shown comment on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-face-up-size-mm-chart.jpeg`,
    output: `${DEST}/round-diamond-face-up-size-mm-chart.avif`,
    title: "Round Diamond Face-Up MM Size Chart: 0.25ct to 5ct",
    description: "Round diamond face-up MM size chart showing diamonds to scale from 0.25ct at 4.1mm through 1ct at 6.5mm standard reference to 5ct at 11.2mm, with finger coverage percentages and lab 1.5ct at $1,950 value comparison, and The MM Reality Chart concept on white editorial background",
  },
  {
    input: `${SRC}/round-diamond-size-vs-cut-depth-comparison.jpeg`,
    output: `${DEST}/round-diamond-size-vs-cut-depth-comparison.avif`,
    title: "Round Diamond Cut Depth vs Face-Up Size: 1 Carat Comparison",
    description: "Round diamond cut depth versus face-up size at 1 carat showing four same-weight diamonds from depth 59 percent at 6.55mm to depth 63.5 percent at 6.20mm with face-up area loss data and price implications on white editorial background",
  },
];

for (const job of jobs) {
  if (!fs.existsSync(job.input)) {
    console.log(`SKIP (missing): ${job.input}`);
    continue;
  }

  await sharp(job.input)
    .resize(1500, 1000, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
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
console.log("Done — 12 inline images converted.");
