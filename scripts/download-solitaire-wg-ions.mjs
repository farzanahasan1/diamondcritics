import sharp from 'sharp';
import https from 'https';
import { writeFileSync } from 'fs';

const DEST = 'public/images/';

const ions = [
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501500/501500_M1_EMR_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-knife-edge.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/502540/502540_M1_EMR_DIM_wht_0100CT_W_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-cathedral.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/503570/503570_M1_EMR_DIM_wht_0100CT_W_Box5_002_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-petite.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504140/504140_M1_EMR_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-classic-four-prong.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504770/504770_M1_EMR_DIM_wht_0100CT_W_Box5_001_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-comfort-fit.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505064/505064_M1_EMR_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-tapered-shank.avif',
  },
  {
    url: 'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioSuperImposeBox/Rings/505031/505031_M1_EMR_DIM_wht_0100CT_W_Box2_004_1600X1600.jpg',
    file: 'emerald-cut-diamond-solitaire-ring-white-gold-six-prong.avif',
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
