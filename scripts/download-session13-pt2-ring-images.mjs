import sharp from "sharp";
import path from "path";
import fs from "fs";

const DEST = "public/images";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const productUrls = [
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/six-prong-solitaire-engagement-ring-in-14k-white-gold-item-195391",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/six-prong-solitaire-engagement-ring-in-platinum-item-195393",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/classic-four-prong-solitaire-engagement-ring-in-14k-white-gold-item-195387",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/knife-edge-solitaire-engagement-ring-in-14k-white-gold-by-james-allen-item-314780",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/knife-edge-solitaire-engagement-ring-in-platinum-by-james-allen-item-314783",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/petite-solitaire-engagement-ring-in-platinum-item-195640",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/pave-crown-solitaire-engagement-ring-in-14k-white-gold-by-james-allen-item-311226",
  "https://www.bluenile.com/engagement-rings/design-your-own-ring/pave-crown-solitaire-engagement-ring-in-platinum-by-james-allen-item-311228",
];

function extractItemId(url) {
  const m = url.match(/item-(\d+)$/);
  return m ? m[1] : null;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

for (const productUrl of productUrls) {
  const itemId = extractItemId(productUrl);
  if (!itemId) continue;

  const outPath = path.join(DEST, `bn-ring-${itemId}.avif`);
  if (fs.existsSync(outPath)) { console.log(`SKIP (exists): bn-ring-${itemId}.avif`); continue; }

  try {
    const pageRes = await fetch(productUrl, { headers: { "User-Agent": UA } });
    const html = await pageRes.text();
    const match = html.match(/ion\.bluenile\.com\/sets\/[^\s"']+\.jpg/);
    if (!match) { console.log(`SKIP (no image): ${itemId}`); await sleep(800); continue; }

    const imgRes = await fetch("https://" + match[0], { headers: { "User-Agent": UA } });
    if (!imgRes.ok) { console.log(`FAIL (${imgRes.status}): ${itemId}`); await sleep(800); continue; }

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .avif({ quality: 82 })
      .toFile(outPath);

    console.log(`✓ bn-ring-${itemId}.avif`);
  } catch (err) {
    console.log(`FAIL: ${itemId} — ${err.message}`);
  }
  await sleep(600);
}

console.log("Done.");
