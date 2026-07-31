import type { MetadataRoute } from "next";
import { ALBANIAN_CITIES, serverApi, SITE } from "@/lib/server-api";

const STATIC_PATHS = [
  "/",
  "/profesionistet",
  "/kategorite",
  "/qytete",
  "/si-funksionon",
  "/per-profesionistet",
  "/rreth-nesh",
  "/pyetjet-e-shpeshta",
  "/blog",
  "/hyr",
  "/regjistrohu",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "/" ? 1.0 : 0.7,
  }));

  // Per-category pages
  const categories = (await serverApi.categories()) ?? [];
  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE.url}/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Per-city pages
  const cityEntries: MetadataRoute.Sitemap = ALBANIAN_CITIES.map((c) => ({
    url: `${SITE.url}/qytete/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Per-freelancer detail pages. Walks all result pages (capped at 300 —
  // comfortably above current inventory; raise the cap well before it binds).
  const allFreelancers = await serverApi.allFreelancers(300);
  const freelancerEntries: MetadataRoute.Sitemap = allFreelancers.map((f) => ({
    url: `${SITE.url}/profesionist/${f.slug}`,
    lastModified: f.updated_at ? new Date(f.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Blog posts (capped at 200 — see allFreelancers note above).
  const allPosts = await serverApi.allBlogPosts(200);
  const postEntries: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...cityEntries,
    ...freelancerEntries,
    ...postEntries,
  ];
}
