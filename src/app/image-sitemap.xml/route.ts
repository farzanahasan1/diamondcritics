import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE = "https://diamondcritics.com";
const postsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "content/posts");

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractInlineImages(content: string): Array<{ loc: string; title: string }> {
  const images: Array<{ loc: string; title: string }> = [];
  // Matches ![alt text](/images/filename.avif) — any path under /images/
  const re = /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    images.push({
      loc: `${BASE}${match[2]}`,
      title: match[1].trim(),
    });
  }
  return images;
}

export async function GET() {
  const files = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdoc"))
    .sort();

  const urlEntries: string[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data, content } = matter(raw);

    if (data.draft) continue;

    const slug = file.replace(/\.mdoc$/, "");
    const postTitle = (data.title as string | undefined) ?? slug;
    const featuredImage = data.featuredImage as string | undefined;

    const images: Array<{ loc: string; title: string; caption?: string }> = [];

    if (featuredImage) {
      images.push({
        loc: `${BASE}${featuredImage}`,
        title: escapeXml(postTitle),
        caption: escapeXml(`${postTitle} — DiamondCritics.com`),
      });
    }

    for (const img of extractInlineImages(content)) {
      images.push({
        loc: img.loc,
        title: escapeXml(img.title || postTitle),
        caption: escapeXml(img.title || postTitle),
      });
    }

    if (images.length === 0) continue;

    const imageXml = images
      .map(
        (img) => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>${
        img.caption ? `\n      <image:caption>${img.caption}</image:caption>` : ""
      }
    </image:image>`
      )
      .join("\n");

    urlEntries.push(`  <url>
    <loc>${BASE}/${slug}</loc>
${imageXml}
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
