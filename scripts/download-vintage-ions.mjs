import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const sharp = require('sharp')

const IMAGES_DIR = '/Users/mehedihasan/Projects/diamondcritics/public/images'

const urls = [
  'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/505033/505033_M1_EMR_DIM_wht_0100CT_R_Box5_001_1600X1600.jpg',
  'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501500/501500_M1_EMR_DIM_wht_0100CT_W_Box5_003_1600X1600.jpg',
  'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/504770/504770_M1_EMR_DIM_wht_0100CT_W_Box5_001_1600X1600.jpg',
  'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/502540/502540_M1_EMR_DIM_wht_0100CT_W_Box5_002_1600X1600.jpg',
  'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501830/501830_M1_EMR_DIM_wht_0100CT_Y_Box4_004_1600X1600.jpg',
  'https://ion.bluenile.com/sets/Jewelry/Photoshoot/Bluenile/BrioPackshotBox/Rings/501850/501850_M1_EMR_DIM_wht_0100CT_Y_Box5_001_1600X1600.jpg',
]

for (const url of urls) {
  const filename = url.split('/').pop().replace(/\.jpg$/i, '.avif')
  const destFile = `${IMAGES_DIR}/${filename}`

  if (fs.existsSync(destFile)) {
    console.log(`[skip] ${filename}`)
    continue
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .avif({ quality: 82 })
      .toFile(destFile)
    console.log(`[ok]   ${filename}`)
  } catch (e) {
    console.log(`[err]  ${url} — ${e.message}`)
  }
}
