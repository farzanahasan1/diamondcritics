import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const missing = JSON.parse(fs.readFileSync('scripts/missing-images.json', 'utf-8'));
const outputDir = path.resolve('public/images');

function download(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) { resolve('skip'); return; }
    const file = fs.createWriteStream(dest);
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve); return;
      }
      if (res.statusCode !== 200) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve('fail:' + res.statusCode); return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('ok'); });
    });
    req.on('error', (e) => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); resolve('err'); });
    req.on('timeout', () => { req.destroy(); resolve('timeout'); });
  });
}

let ok = 0, fail = 0;
for (const wpPath of missing) {
  const url = `https://diamondcritics.com/${wpPath}`;
  const dest = path.join(outputDir, path.basename(wpPath));
  const r = await download(url, dest);
  if (r === 'ok') { ok++; process.stdout.write(`✓ ${path.basename(wpPath)}\n`); }
  else { fail++; process.stdout.write(`✗ ${path.basename(wpPath)} (${r})\n`); }
}
console.log(`\nDone: ${ok} downloaded, ${fail} failed. Total images: ${fs.readdirSync(outputDir).length}`);
