/**
 * Cleans CSS/JS bleed from imported WordPress content
 * and rewrites image paths from wp-content/uploads/ to /images/
 */
import fs from 'fs';
import path from 'path';

const dirs = ['content/posts', 'content/pages'];

function clean(text) {
  // 1. Remove escaped CSS blocks: starts with /* or .class { and ends with }
  //    These appear as lines of raw CSS text from WP custom HTML blocks
  text = text.replace(/\/\\\*[\s\S]*?\\\*\/[^`\n]*/g, '');

  // 2. Remove lines that are pure CSS/JS junk (no markdown content)
  //    Pattern: long line containing CSS selectors { ... }
  text = text.replace(/^[^\n]*\{[^}]{20,}\}[^\n]*$/gm, '');

  // 3. Remove JavaScript lines
  text = text.replace(/^[^\n]*(document\.|window\.|addEventListener|querySelector|classList|function\s*\(|=>\s*\{)[^\n]*$/gm, '');

  // 4. Remove JSON-LD fragments that leaked out
  text = text.replace(/\{\s*"@context"\s*:\s*"https:\/\/schema\.org"[\s\S]*?\}/g, '');
  text = text.replace(/@context|@type|mainEntity|FAQPage/g, '');

  // 5. Remove <script> blocks
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');

  // 6. Remove <style> blocks
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');

  // 7. Clean FAQ question markers (the + sign accordion trigger)
  text = text.replace(/^(#{1,4} .+?)\+\s*$/gm, '$1');

  // 8. Rewrite wp-content/uploads image paths to /images/filename
  text = text.replace(/(?:https?:\/\/diamondcritics\.com\/)?wp-content\/uploads\/\d{4}\/\d{2}\/([^\s"')<>\]]+)/g, '/images/$1');

  // 9. Clean up multiple blank lines
  text = text.replace(/\n{4,}/g, '\n\n\n');

  return text.trim() + '\n';
}

let count = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.match(/\.(mdoc|mdx|md)$/)) continue;
    const filePath = path.join(dir, file);
    const original = fs.readFileSync(filePath, 'utf-8');
    const cleaned = clean(original);
    if (cleaned !== original) {
      fs.writeFileSync(filePath, cleaned, 'utf-8');
      count++;
      console.log(`✓ cleaned: ${file}`);
    }
  }
}
console.log(`\nDone. ${count} files updated.`);
