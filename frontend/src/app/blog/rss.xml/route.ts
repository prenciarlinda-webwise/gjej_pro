import { serverApi, SITE } from "@/lib/server-api";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// RSS feed for the blog — content syndication and a freshness signal for
// feed readers and AI/answer-engine crawlers alike.
export async function GET() {
  const posts = await serverApi.allBlogPosts(100);

  const items = posts
    .map((p) => {
      const url = `${SITE.url}/blog/${p.slug}`;
      const pubDate = p.published_at ? new Date(p.published_at).toUTCString() : undefined;
      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <author>${xmlEscape(p.author_name)}</author>
      ${p.excerpt ? `<description>${xmlEscape(p.excerpt)}</description>` : ""}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(SITE.name)} Blog</title>
    <link>${SITE.url}/blog</link>
    <description>${xmlEscape(SITE.description)}</description>
    <language>sq</language>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
