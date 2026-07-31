import type { MetadataRoute } from "next";
import { SITE } from "@/lib/server-api";

const DISALLOW = ["/dashboard/", "/api/", "/admin/", "/verifiko-emailin/"];

// AI answer-engine / assistant crawlers, explicitly allowed. A bare "*"
// wildcard already lets these through by omission, but that's one tightened
// security rule away from silently cutting off GEO visibility — spelling
// them out makes the allowance a deliberate policy, not an accident.
const AI_ANSWER_ENGINE_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_ANSWER_ENGINE_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
