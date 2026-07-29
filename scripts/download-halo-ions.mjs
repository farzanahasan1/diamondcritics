import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import https from 'https';

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function toAvif(buffer, dest, width = 1200, height = 1200) {
  await sharp(buffer)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 82 })
    .toFile(dest);
  console.log('✓', dest);
}

const OUT = 'public/images';

// Featured image — 1500x1000
const featuredBuf = readFileSync('/Users/mehedihasan/Downloads/Emerald-Cut-Diamond-Ring-With-Halo.jpg');
await toAvif(featuredBuf, `${OUT}/emerald-cut-diamond-halo-engagement-ring-featured.avif`, 1500, 1000);

// 6 ion ring images — 1200x1200
const ions = [
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/503570/503570_M1_EMR_DIM_wht_0100CT_W_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-halo-ring-white-gold-pave.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505064/505064_M1_EMR_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-halo-engagement-ring-white-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505071/505071_M1_EMR_DIM_wht_0100CT_R_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-halo-ring-rose-gold-falling-edge.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505125/505125_M1_EMR_DIM_wht_0100CT_Y_Box5_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-halo-ring-yellow-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/503630/503630_M1_EMR_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-halo-engagement-ring-yellow-gold-cathedral.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504140/504140_M1_EMR_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-hidden-halo-ring-white-gold.avif',
  },
];

for (const { url, file } of ions) {
  console.log('Downloading', file);
  const buf = await fetchBuffer(url);
  await toAvif(buf, `${OUT}/${file}`);
}

console.log('\nAll done.');
