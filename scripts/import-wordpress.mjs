/**
 * WordPress XML → MDX content files converter
 * Run: node scripts/import-wordpress.mjs <path-to-xml>
 */

import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import TurndownService from 'turndown';

const xmlFile = process.argv[2];
if (!xmlFile) {
  console.error('Usage: node scripts/import-wordpress.mjs <path-to-xml>');
  process.exit(1);
}

const td = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

// Keep HTML tables as-is (markdown tables are fragile)
td.addRule('tables', {
  filter: ['table'],
  replacement: (content, node) => '\n\n' + node.outerHTML + '\n\n',
});

// Keep blockquotes nicely
td.addRule('blockquote', {
  filter: 'blockquote',
  replacement: (content) => content.split('\n').map(l => '> ' + l).join('\n') + '\n\n',
});

function getCDATA(val) {
  if (!val) return '';
  if (Array.isArray(val)) return val[0] ?? '';
  return val;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapCategory(catSlug) {
  const map = {
    'diamond-buying-guides': 'diamond-buying-guides',
    'diamond-retailer-reviews': 'diamond-retailer-reviews',
    'gemstone-guides': 'gemstone-guides',
    'market-value-price-trends': 'market-value-price-trends',
    // sub-categories → parent
    'diamond-clarity-chart': 'diamond-buying-guides',
    'diamond-color-scale': 'diamond-buying-guides',
    'diamond-shapes-guide': 'diamond-buying-guides',
  };
  return map[catSlug] ?? 'diamond-buying-guides';
}

function getMeta(postmeta, key) {
  if (!postmeta) return '';
  const found = postmeta.find(m => getCDATA(m['wp:meta_key']) === key);
  return found ? getCDATA(found['wp:meta_value']) : '';
}

function htmlToMd(html) {
  if (!html || html.trim() === '') return '';
  // Replace WordPress shortcodes
  const cleaned = html
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gs, '$1')
    .replace(/\[\/?(et_pb|fusion|vc|wc)[^\]]*\]/g, '')
    .replace(/\[([^\]]+)\]/g, '') // remove remaining shortcodes
    .replace(/<!--more-->/g, '')
    .replace(/\r\n/g, '\n');
  try {
    return td.turndown(cleaned);
  } catch {
    return cleaned;
  }
}

function buildFrontmatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '') continue;
    const safe = String(v).includes('\n') || String(v).includes('"')
      ? `|\n  ${String(v).replace(/\n/g, '\n  ')}`
      : `"${String(v).replace(/"/g, '\\"')}"`;
    lines.push(`${k}: ${safe}`);
  }
  lines.push('---');
  return lines.join('\n');
}

async function run() {
  console.log(`Reading ${xmlFile}...`);
  const raw = fs.readFileSync(xmlFile, 'utf-8');

  console.log('Parsing XML...');
  const parsed = await parseStringPromise(raw, { explicitArray: true });
  const items = parsed.rss.channel[0].item ?? [];

  const postsDir = path.resolve('content/posts');
  const pagesDir = path.resolve('content/pages');
  fs.mkdirSync(postsDir, { recursive: true });
  fs.mkdirSync(pagesDir, { recursive: true });

  let postCount = 0;
  let pageCount = 0;
  let skipped = 0;

  for (const item of items) {
    const status = getCDATA(item['wp:status']);
    const postType = getCDATA(item['wp:post_type']);

    if (status !== 'publish') { skipped++; continue; }
    if (!['post', 'page'].includes(postType)) { skipped++; continue; }

    const title = getCDATA(item.title);
    const slug = getCDATA(item['wp:post_name']) || slugify(title);
    const rawContent = getCDATA(item['content:encoded']);
    const rawExcerpt = getCDATA(item['excerpt:encoded']);
    const dateRaw = getCDATA(item['wp:post_date']) || '';
    const publishedAt = dateRaw ? dateRaw.split(' ')[0] : '';

    const postmeta = item['wp:postmeta'] ?? [];
    const seoTitle = getMeta(postmeta, 'rank_math_title') || getMeta(postmeta, '_yoast_wpseo_title') || title;
    const seoDesc = getMeta(postmeta, 'rank_math_description') || getMeta(postmeta, '_yoast_wpseo_metadesc') || rawExcerpt.slice(0, 160);

    // Category
    const cats = (item.category ?? []).map(c => {
      const domain = c.$ && c.$.domain;
      const nicename = c.$ && c.$.nicename;
      return domain === 'category' ? nicename : null;
    }).filter(Boolean);
    const category = cats.length > 0 ? mapCategory(cats[0]) : 'diamond-buying-guides';

    const excerpt = rawExcerpt ? td.turndown(rawExcerpt).replace(/\n+/g, ' ').trim() : '';
    const content = htmlToMd(rawContent);

    if (postType === 'post') {
      const fm = buildFrontmatter({ title, excerpt, publishedAt, category, seoTitle, seoDescription: seoDesc });
      const mdx = `${fm}\n\n${content}\n`;
      fs.writeFileSync(path.join(postsDir, `${slug}.mdoc`), mdx, 'utf-8');
      postCount++;
      console.log(`  ✓ post: ${slug}`);
    } else {
      const fm = buildFrontmatter({ title, seoTitle, seoDescription: seoDesc });
      const mdx = `${fm}\n\n${content}\n`;
      fs.writeFileSync(path.join(pagesDir, `${slug}.mdoc`), mdx, 'utf-8');
      pageCount++;
      console.log(`  ✓ page: ${slug}`);
    }
  }

  console.log(`\nDone! ${postCount} posts, ${pageCount} pages, ${skipped} skipped (drafts/attachments).`);
}

run().catch(console.error);
