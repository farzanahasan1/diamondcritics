import fs from 'fs';
import path from 'path';

const xmlFile = '/Users/mehedihasan/Downloads/diamondcriticscom.WordPress.2026-06-19.xml';
const postsDir = path.resolve('content/posts');
const publicImagesDir = path.resolve('public/images');
const xml = fs.readFileSync(xmlFile, 'utf-8');

// Extract all items
const items = [];
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let m;
while ((m = itemRegex.exec(xml)) !== null) {
  items.push(m[1]);
}

// Build attachment map: ID -> filename
const attachments = new Map(); // id -> filename (basename, no path)
for (const item of items) {
  const typeMatch = item.match(/<wp:post_type><!\[CDATA\[([^\]]+)\]\]>/);
  if (!typeMatch || typeMatch[1] !== 'attachment') continue;
  const idMatch = item.match(/<wp:post_id>(\d+)<\/wp:post_id>/);
  const urlMatch = item.match(/<wp:attachment_url><!\[CDATA\[([^\]]+)\]\]>/);
  if (!idMatch || !urlMatch) continue;
  const id = idMatch[1];
  const url = urlMatch[1];
  // Skip thumbnails (contain dimensions like -150x150, -300x200)
  if (!/\-\d+x\d+\.(jpg|png|jpeg|webp)$/i.test(url)) {
    attachments.set(id, path.basename(url));
  }
}

// Build post map: slug -> thumbnail filename
const postImages = new Map(); // slug -> filename
for (const item of items) {
  const typeMatch = item.match(/<wp:post_type><!\[CDATA\[([^\]]+)\]\]>/);
  if (!typeMatch || typeMatch[1] !== 'post') continue;

  const slugMatch = item.match(/<wp:post_name><!\[CDATA\[([^\]]+)\]\]>/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];

  // Find _thumbnail_id meta
  const thumbMatch = item.match(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]>[\s\S]*?<wp:meta_value><!\[CDATA\[(\d+)\]\]>/);
  if (!thumbMatch) continue;
  const thumbId = thumbMatch[1];
  const filename = attachments.get(thumbId);
  if (filename) {
    postImages.set(slug, filename);
  }
}

console.log(`Found ${postImages.size} posts with featured images`);

// Try to match local files (prefer AVIF)
function findLocalImage(filename) {
  const base = filename.replace(/\.(jpe?g|png|webp)$/i, '');
  // Check AVIF first
  const avifName = base + '.avif';
  if (fs.existsSync(path.join(publicImagesDir, avifName))) return `/images/${avifName}`;
  // Fall back to original
  if (fs.existsSync(path.join(publicImagesDir, filename))) return `/images/${filename}`;
  return null;
}

// Inject featuredImage into .mdoc files
let updated = 0, missing = 0, noImage = 0;
const mdocFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdoc'));

for (const file of mdocFiles) {
  const slug = file.replace('.mdoc', '');
  const wpFilename = postImages.get(slug);

  if (!wpFilename) { noImage++; continue; }

  const localPath = findLocalImage(wpFilename);
  if (!localPath) {
    console.log(`  ✗ Image not found locally: ${wpFilename} (for ${slug})`);
    missing++;
    continue;
  }

  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has featuredImage
  if (content.match(/^featuredImage:/m)) {
    console.log(`  ~ Already set: ${slug}`);
    updated++;
    continue;
  }

  // Inject after the last frontmatter field before the closing ---
  content = content.replace(/^(---\n[\s\S]*?)(^---)/m, (_, front, close) => {
    return `${front}featuredImage: "${localPath}"\n${close}`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`  ✓ ${slug} → ${localPath}`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${missing} image not found, ${noImage} no WP thumbnail set`);
