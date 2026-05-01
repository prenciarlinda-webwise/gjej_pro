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
    lastModified: now,
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

  // Per-freelancer detail pages (cap at first ~200 to keep sitemap reasonable)
  const freelancersList = await serverApi.searchFreelancers({ page: 1 });
  const freelancerEntries: MetadataRoute.Sitemap =
    (freelancersList?.results ?? []).map((f) => ({
      url: `${SITE.url}/profesionist/${f.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  // Blog posts
  const posts = await serverApi.blogPosts();
  const postEntries: MetadataRoute.Sitemap =
    (posts?.results ?? []).map((p) => ({
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
