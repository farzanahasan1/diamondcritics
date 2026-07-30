import sharp from 'sharp';
import https from 'https';
import { writeFileSync } from 'fs';

const DEST = 'public/images/';

const ions = [
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/504961/504961_M1_EMR_DIM_wht_0100CT_Y_Box3_002_1600X1600.jpg',
    file: 'petite-solitaire-emerald-cut-diamond-ring-yellow-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501740/501740_M1_EMR_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-yellow-gold-tapered.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501472/501472_M1_EMR_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-ring-yellow-gold-prong-solitaire.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/500000/500000_M1_EMR_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-yellow-gold-ring-classic.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504979/504979_M1_EMR_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-engagement-ring-yellow-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/505036/505036_M1_EMR_DIM_wht_0100CT_Y_Box6_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-ring-yellow-gold-pave-halo.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/501350/501350_M1_EMR_DIM_wht_0100CT_Y_Box3_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-ring-yellow-gold-falling-edge.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501350/501350_M1_EMR_DIM_wht_0100CT_Y_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-ring-yellow-gold-falling-edge-box.avif',
  },
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

for (const { url, file } of ions) {
  console.log('Downloading', file);
  const buf = await fetchBuffer(url);
  const avif = await sharp(buf)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 82 })
    .toBuffer();
  writeFileSync(DEST + file, avif);
  console.log('Saved', DEST + file, Math.round(avif.length / 1024) + 'KB');
}

console.log('All done.');
