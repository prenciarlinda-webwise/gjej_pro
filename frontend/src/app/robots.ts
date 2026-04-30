import type { MetadataRoute } from "next";
import { SITE } from "@/lib/server-api";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/admin/", "/verifiko-emailin/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
