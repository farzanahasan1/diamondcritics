import { readFileSync, writeFileSync } from 'fs';

const FILE = 'content/posts/emerald-cut-diamond-halo-engagement-ring.mdoc';
let content = readFileSync(FILE, 'utf8');

// Mask URLs so sentence splitter doesn't split inside them
const urlMap = {};
let urlIdx = 0;
content = content.replace(/https?:\/\/[^\s)">]+/g, (url) => {
  const key = `URLPLACEHOLDER${urlIdx++}`;
  urlMap[key] = url;
  return key;
});

const lines = content.split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Skip frontmatter, headings, list items, HTML, blockquotes, image lines, empty lines, table rows
  const isSpecial =
    trimmed === '' ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('-') ||
    trimmed.startsWith('|') ||
    trimmed.startsWith('<') ||
    trimmed.startsWith('>') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('!') ||
    trimmed.startsWith('[') ||
    trimmed.startsWith('[![') ||
    trimmed.startsWith('→') ||
    trimmed.startsWith('---') ||
    /^[a-zA-Z]+:/.test(trimmed) && i < 15; // frontmatter

  if (isSpecial) {
    result.push(line);
    continue;
  }

  // Split paragraph into sentences
  const sentences = trimmed
    .split(/(?<=[.!?])\s+(?=[A-Z"[({])/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length <= 3) {
    result.push(line);
    continue;
  }

  // Group into max-3-sentence paragraphs
  const groups = [];
  for (let j = 0; j < sentences.length; j += 3) {
    groups.push(sentences.slice(j, j + 3).join(' '));
  }
  result.push(groups.join('\n\n'));
}

let fixed = result.join('\n');

// Restore URLs
for (const [key, url] of Object.entries(urlMap)) {
  fixed = fixed.replaceAll(key, url);
}

writeFileSync(FILE, fixed);
console.log('Done. Fixed paragraphs in', FILE);
