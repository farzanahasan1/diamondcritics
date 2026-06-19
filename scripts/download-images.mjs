/**
 * Downloads all WordPress images from the live site
 * Run: node scripts/download-images.mjs
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const baseUrl = 'https://diamondcritics.com';
const outputDir = path.resolve('public/images');
fs.mkdirSync(outputDir, { recursive: true });

// Collect all image URLs from content files
const contentDirs = ['content/posts', 'content/pages'];
const imageUrls = new Set();

for (const dir of contentDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    const text = fs.readFileSync(path.join(dir, file), 'utf-8');
    const matches = text.matchAll(/wp-content\/uploads\/([^\s"')<>]+)/g);
    for (const m of matches) {
      imageUrls.add('wp-content/uploads/' + m[1]);
    }
  }
}

console.log(`Found ${imageUrls.size} unique images to download.\n`);

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) { resolve('skip'); return; }
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    const file = fs.createWriteStream(dest);
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve('fail:' + res.statusCode);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('ok'); });
    });
    req.on('error', (e) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve('err:' + e.message);
    });
    req.on('timeout', () => { req.destroy(); resolve('timeout'); });
  });
}

let ok = 0, skip = 0, fail = 0;

for (const wpPath of imageUrls) {
  const url = `${baseUrl}/${wpPath}`;
  // Flatten to public/images/<filename>
  const filename = path.basename(wpPath);
  const dest = path.join(outputDir, filename);
  const result = await download(url, dest);
  if (result === 'ok') { ok++; process.stdout.write(`✓ ${filename}\n`); }
  else if (result === 'skip') { skip++; }
  else { fail++; process.stdout.write(`✗ ${filename} (${result})\n`); }
}

console.log(`\nDone: ${ok} downloaded, ${skip} skipped, ${fail} failed.`);

// Output a URL map for content rewriting
const map = {};
for (const wpPath of imageUrls) {
  const filename = path.basename(wpPath);
  map[wpPath] = `/images/${filename}`;
}
fs.writeFileSync('scripts/image-map.json', JSON.stringify(map, null, 2));
console.log('Image map written to scripts/image-map.json');
