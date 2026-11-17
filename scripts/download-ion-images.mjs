import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const POSTS_DIR = '/Users/mehedihasan/Projects/diamondcritics/content/posts'
const IMAGES_DIR = '/Users/mehedihasan/Projects/diamondcritics/public/images'

// Extract all unique ion URLs from all posts
const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdoc'))
const urlToLocal = new Map()

for (const file of files) {
  const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
  const matches = content.match(/https:\/\/ion\.bluenile\.com[^)"' \n]*/g) || []
  for (const url of matches) {
    if (!urlToLocal.has(url)) {
      // Derive local filename from last path segment, replace .jpg with .avif
      const filename = url.split('/').pop().replace(/\.jpg$/i, '.avif')
      urlToLocal.set(url, `/images/${filename}`)
    }
  }
}

console.log(`Found ${urlToLocal.size} unique ion images to download.\n`)

let ok = 0, skipped = 0, errors = 0

for (const [url, localPath] of urlToLocal) {
  const destFile = path.join('/Users/mehedihasan/Projects/diamondcritics/public', localPath)

  if (fs.existsSync(destFile)) {
    skipped++
    process.stdout.write(`[skip] ${localPath}\n`)
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

    ok++
    process.stdout.write(`[ok]   ${localPath}\n`)
  } catch (e) {
    errors++
    process.stdout.write(`[err]  ${url} — ${e.message}\n`)
  }
}

console.log(`\nDownloaded: ${ok}  Skipped: ${skipped}  Errors: ${errors}`)
if (errors > 0) process.exit(1)

// Now update all post files
console.log('\nUpdating post references...')
let filesUpdated = 0

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file)
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false

  for (const [url, localPath] of urlToLocal) {
    if (content.includes(url)) {
      content = content.split(url).join(localPath)
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content)
    filesUpdated++
    console.log(`  Updated: ${file}`)
  }
}

console.log(`\nDone. ${filesUpdated} files updated.`)
