import sharp from "sharp";
import { exiftool } from "exiftool-vendored";
import path from "path";
import fs from "fs";

const DEST = "public/images";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const productUrls = [
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/petite-solitaire-engagement-ring-in-14k-yellow-gold-item-195639",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/solitaire-engagement-ring-with-wire-basket-in-14k-yellow-gold-by-james-allen-item-314774",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/criss-cross-solitaire-engagement-ring-in-14k-yellow-gold-by-james-allen-item-311133",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/ten-prong-solitaire-engagement-ring-in-14k-yellow-gold-by-james-allen-item-311236",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/petite-hidden-halo-solitaire-plus-diamond-engagement-ring-in-14k-yellow-gold-item-192506",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/crown-pave-hidden-halo-diamond-engagement-ring-in-14k-yellow-gold-by-james-allen-item-315156",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/common-prong-diamond-pave-engagement-ring-in-14k-yellow-gold-by-james-allen-item-310973",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/petite-diamond-engagement-ring-in-14k-yellow-gold-1-10-ct-tw-item-195425",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/pave-silhouette-diamond-three-stone-engagement-ring-in-14k-yellow-gold-by-james-allen-item-310849",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/marquise-cut-diamond-three-stone-engagement-ring-in-14k-yellow-gold-by-james-allen-item-315107",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/diamond-whisper-side-stone-engagement-ring-in-14k-yellow-gold-by-james-allen-item-315458",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/escalating-baguette-side-stone-diamond-engagement-ring-in-14k-yellow-gold-by-james-allen-item-310914",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/marquise-diamond-accents-side-stone-engagement-ring-with-pave-basket-in-14k-yellow-gold-by-james-allen-item-316190",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/solitaire-engagement-ring-with-intricate-basket-in-14k-yellow-gold-by-james-allen-item-315036",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/falling-edge-pave-diamond-halo-engagement-ring-in-14k-yellow-gold-by-james-allen-item-311115",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/star-diamond-halo-cathedral-engagement-ring-in-14k-yellow-gold-by-james-allen-item-311139",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/vintage-diamond-halo-engagement-ring-in-14k-yellow-gold-5-8-ct-tw-item-192188",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/solo-infinity-diamond-pave-engagement-ring-in-14k-yellow-gold-by-james-allen-item-316159",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/cathedral-pave-crown-diamond-engagement-ring-in-14k-yellow-gold-by-james-allen-item-315695",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/zac-zac-posen-vintage-inspired-halo-diamond-engagement-ring-in-14k-yellow-gold-item-203824",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/woven-solitaire-engagement-ring-in-14k-rose-gold-by-james-allen-item-310897",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/petite-solitaire-engagement-ring-in-14k-rose-gold-item-195429",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/flat-edge-solitaire-engagement-ring-in-14k-rose-gold-by-james-allen-item-314788",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/engraved-solitaire-engagement-ring-in-14k-rose-gold-by-james-allen-item-314957",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/comfort-fit-six-prong-solitaire-engagement-ring-in-14k-rose-gold-by-james-allen-item-316244",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/french-cut-pave-diamond-engagement-ring-in-14k-rose-gold-by-james-allen-item-314753",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/perfect-pave-diamond-engagement-ring-in-14k-rose-gold-by-james-allen-item-314963",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/solitaire-engagement-ring-with-pave-basket-in-14k-rose-gold-by-james-allen-item-311231",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/criss-cross-solitaire-engagement-ring-in-14k-rose-gold-by-james-allen-item-311129",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/diamond-three-stone-engagement-ring-with-scroll-undergallery-in-14k-rose-gold-by-james-allen-item-315021",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/round-blue-sapphire-three-stone-engagement-ring-in-14k-rose-gold-by-james-allen-item-310975",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/round-diamond-three-stone-engagement-ring-with-pave-set-diamonds-in-14k-rose-gold-by-james-allen-item-314797",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/milgrain-lace-pave-vintage-style-engagement-ring-in-14k-rose-gold-by-james-allen-item-315056",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/graduated-pave-diamond-engagement-ring-in-14k-rose-gold-by-james-allen-item-315028",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/falling-edge-pave-diamond-halo-engagement-ring-in-14k-rose-gold-by-james-allen-item-311111",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/classic-halo-diamond-engagement-ring-in-14k-rose-gold-item-146204",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/micropave-double-halo-diamond-engagement-ring-in-14k-rose-gold-1-3-ct-tw-item-146208",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/leaf-solitaire-engagement-ring-in-14k-rose-gold-item-192443",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/blue-nile-studio-double-halo-gala-diamond-engagement-ring-in-14k-rose-gold-7-8-ct-tw-item-203777",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/comfort-fit-bezel-set-solitaire-engagement-ring-in-14k-rose-gold-by-james-allen-item-315707",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/comfort-fit-bezel-set-solitaire-engagement-ring-in-14k-white-gold-by-james-allen-item-315709",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/comfort-fit-bezel-set-solitaire-engagement-ring-in-14k-yellow-gold-by-james-allen-item-315674",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/comfort-fit-bezel-set-solitaire-engagement-ring-in-platinum-by-james-allen-item-315706",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-solitaire-engagement-ring-in-14k-white-gold-item-296642",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-solitaire-engagement-ring-in-14k-rose-gold-item-296644",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-solitaire-engagement-ring-in-14k-yellow-gold-item-296643",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-solitaire-engagement-ring-in-platinum-item-296647",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-straight-baguette-cut-diamond-three-stone-engagement-ring-in-14k-white-gold-by-james-allen-item-316318",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-straight-baguette-cut-diamond-three-stone-engagement-ring-in-14k-yellow-gold-by-james-allen-item-316319",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-straight-baguette-cut-diamond-three-stone-engagement-ring-in-14k-rose-gold-by-james-allen-item-316314",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-straight-baguette-cut-diamond-three-stone-engagement-ring-in-platinum-by-james-allen-item-316317",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-engagement-ring-with-channel-set-diamond-accent-in-14k-white-gold-item-296630",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-engagement-ring-with-channel-set-diamond-accent-in-14k-yellow-gold-item-296631",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-engagement-ring-with-channel-set-diamond-accent-in-14k-rose-gold-item-296632",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-engagement-ring-with-channel-set-diamond-accent-in-platinum-item-296635",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-set-emerald-cut-side-stone-diamond-engagement-ring-in-14k-white-gold-by-james-allen-item-304632",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-set-emerald-cut-side-stone-diamond-engagement-ring-in-14k-yellow-gold-by-james-allen-item-304633",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-set-emerald-cut-side-stone-diamond-engagement-ring-in-14k-rose-gold-by-james-allen-item-304634",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/bezel-set-emerald-cut-side-stone-diamond-engagement-ring-in-platinum-by-james-allen-item-304637",
];

function extractItemId(url) {
  const m = url.match(/item-(\d+)$/);
  return m ? m[1] : null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

let success = 0;
let skipped = 0;
let failed = 0;

for (const productUrl of productUrls) {
  const itemId = extractItemId(productUrl);
  if (!itemId) { console.log(`SKIP (no item id): ${productUrl}`); skipped++; continue; }

  const outPath = path.join(DEST, `bn-ring-${itemId}.avif`);
  if (fs.existsSync(outPath)) {
    console.log(`SKIP (exists): bn-ring-${itemId}.avif`);
    skipped++;
    continue;
  }

  try {
    // Fetch product page
    const pageRes = await fetch(productUrl, { headers: { "User-Agent": UA } });
    const html = await pageRes.text();

    // Extract first ion.bluenile.com image URL
    const match = html.match(/ion\.bluenile\.com\/sets\/[^\s"']+\.jpg/);
    if (!match) {
      console.log(`SKIP (no image found in page): ${itemId}`);
      skipped++;
      await sleep(800);
      continue;
    }

    const imageUrl = "https://" + match[0];

    // Download image
    const imgRes = await fetch(imageUrl, { headers: { "User-Agent": UA } });
    if (!imgRes.ok) {
      console.log(`FAIL (image download ${imgRes.status}): ${itemId}`);
      failed++;
      await sleep(800);
      continue;
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    // Convert to AVIF
    await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .avif({ quality: 82 })
      .toFile(outPath);

    console.log(`✓ bn-ring-${itemId}.avif`);
    success++;
  } catch (err) {
    console.log(`FAIL: ${itemId} — ${err.message}`);
    failed++;
  }

  await sleep(600);
}

console.log(`\nDone. ✓ ${success} converted, ${skipped} skipped, ${failed} failed.`);
