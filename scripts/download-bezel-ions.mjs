import sharp from 'sharp';
import https from 'https';
import { writeFileSync } from 'fs';

const DEST = 'public/images/';

const ions = [
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505115/505115_M1_EMR_DIM_wht_0100CT_W_Box8_002_1600X1600.jpg',
    file: 'bezel-set-emerald-cut-diamond-ring-white-gold-solitaire.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504961/504961_M1_EMR_DIM_wht_0100CT_W_Box5_002_1600X1600.jpg',
    file: 'comfort-fit-bezel-solitaire-emerald-cut-diamond-white-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505014/505014_M1_EMR_DIM_wht_0100CT_Y_Box5_003_1600X1600.jpg',
    file: 'bezel-set-emerald-cut-diamond-ring-yellow-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504961/504961_M1_EMR_DIM_wht_0100CT_Y_Box8_001_1600X1600.jpg',
    file: 'comfort-fit-bezel-solitaire-emerald-cut-diamond-yellow-gold.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504962/504962_M1_EMR_DIM_wht_0100CT_R_Box5_002_1600X1600.jpg',
    file: 'bezel-set-emerald-cut-diamond-ring-rose-gold.avif',
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
