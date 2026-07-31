import type { MetadataRoute } from "next";
import { ALBANIAN_CITIES, serverApi, SITE } from "@/lib/server-api";
import { COUNTRIES } from "@/lib/countries";

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

// Country hub + city-index pages are always real, unique content —
// included unconditionally. Country category/city *detail* pages are only
// included once real freelancer supply exists there (they're `noindex`
// until then, see CategoryCountryView/CityCountryView) — derived below
// from actual freelancer data instead of guessed/hardcoded.
const COUNTRY_STATIC_SUFFIXES = ["", "/qytete"];

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

  // Country sections (US/UK diaspora expansion).
  const countryEntries: MetadataRoute.Sitemap = [];
  for (const country of Object.values(COUNTRIES)) {
    for (const suffix of COUNTRY_STATIC_SUFFIXES) {
      countryEntries.push({
        url: `${SITE.url}${country.pathPrefix}${suffix}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: suffix === "" ? 0.8 : 0.6,
      });
    }

    const countryFreelancers = await serverApi.allFreelancers(300, country.apiCountry);
    const categorySlugsWithSupply = new Set(
      countryFreelancers.flatMap((f) => f.categories.map((c) => c.slug)),
    );
    for (const slug of categorySlugsWithSupply) {
      countryEntries.push({
        url: `${SITE.url}${country.pathPrefix}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    const citiesWithSupply = new Set(
      countryFreelancers.flatMap((f) => f.cities.map((c) => c.toLowerCase())),
    );
    for (const city of country.cities) {
      if (!citiesWithSupply.has(city.name.toLowerCase())) continue;
      countryEntries.push({
        url: `${SITE.url}${country.pathPrefix}/qytete/${city.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return [
    ...staticEntries,
    ...categoryEntries,
    ...cityEntries,
    ...freelancerEntries,
    ...postEntries,
    ...countryEntries,
  ];
}
