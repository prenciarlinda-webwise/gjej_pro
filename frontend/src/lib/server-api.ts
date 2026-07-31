/**
 * Server-side API helper for SSR pages. No localStorage (server has none),
 * no Authorization header (we only call public endpoints from SSR).
 *
 * Pages that need authenticated data must use the client-side `api` instead.
 */
import type {
  Category,
  FreelancerDetail,
  FreelancerListItem,
  PaginatedResponse,
  ReviewItem,
} from "./api";

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  author_name: string;
  published_at: string | null;
}

export interface BlogPostDetail extends BlogPostListItem {
  body: string;
  updated_at: string;
}

// Server-side base URL — falls back to the same env var as the client. In
// production, you can override with INTERNAL_API_BASE_URL to point at a private
// network address that's faster than the public ingress.
const BASE =
  process.env.INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8765/api";

interface SsrFetchOptions {
  /** Cache strategy. "no-store" disables caching; a number triggers ISR. */
  revalidate?: number | false;
}

async function ssrFetch<T>(path: string, opts: SsrFetchOptions = {}): Promise<T | null> {
  const next: { revalidate?: number; tags?: string[] } = {};
  if (opts.revalidate !== undefined) {
    if (opts.revalidate === false) {
      // no-store mode
    } else {
      next.revalidate = opts.revalidate;
    }
  } else {
    next.revalidate = 60; // default: revalidate every 60s
  }

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...(opts.revalidate === false ? { cache: "no-store" } : { next }),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const serverApi = {
  categories: () => ssrFetch<Category[]>("/categories/"),

  searchFreelancers: (params: {
    q?: string;
    category?: string;
    city?: string;
    country?: string;
    slug?: string;
    page?: number;
    page_size?: number;
  } = {}) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.category) sp.set("category", params.category);
    if (params.city) sp.set("city", params.city);
    if (params.country) sp.set("country", params.country);
    if (params.slug) sp.set("slug", params.slug);
    if (params.page) sp.set("page", String(params.page));
    if (params.page_size) sp.set("page_size", String(params.page_size));
    const qs = sp.toString();
    return ssrFetch<PaginatedResponse<FreelancerListItem>>(
      `/freelancers/${qs ? `?${qs}` : ""}`,
    );
  },

  /** Walks `next` pages (each at max page_size) up to `cap` items — used by the sitemap. */
  allFreelancers: async (
    cap = 300,
    country?: string,
  ): Promise<FreelancerListItem[]> => {
    const out: FreelancerListItem[] = [];
    let page = 1;
    while (out.length < cap) {
      const res = await serverApi.searchFreelancers({ page, page_size: 60, country });
      if (!res || res.results.length === 0) break;
      out.push(...res.results);
      if (!res.next) break;
      page += 1;
    }
    return out.slice(0, cap);
  },

  /** Walks all blog pages (max page_size) up to `cap` posts — used by the sitemap. */
  allBlogPosts: async (cap = 200): Promise<BlogPostListItem[]> => {
    const out: BlogPostListItem[] = [];
    let page = 1;
    while (out.length < cap) {
      const sp = new URLSearchParams({ page: String(page), page_size: "50" });
      const res = await ssrFetch<PaginatedResponse<BlogPostListItem>>(
        `/blog/posts/?${sp.toString()}`,
      );
      if (!res || res.results.length === 0) break;
      out.push(...res.results);
      if (!res.next) break;
      page += 1;
    }
    return out.slice(0, cap);
  },

  /** Resolve a public slug to the underlying numeric user_id. */
  resolveFreelancerSlug: async (slug: string): Promise<number | null> => {
    const res = await ssrFetch<PaginatedResponse<FreelancerListItem>>(
      `/freelancers/?slug=${encodeURIComponent(slug)}`,
    );
    return res?.results?.[0]?.id ?? null;
  },

  freelancer: (id: number) =>
    ssrFetch<FreelancerDetail>(`/freelancers/${id}/`),

  freelancerReviews: (id: number) =>
    ssrFetch<PaginatedResponse<ReviewItem>>(`/freelancers/${id}/reviews/`),

  blogPosts: () =>
    ssrFetch<PaginatedResponse<BlogPostListItem>>("/blog/posts/"),

  blogPost: (slug: string) =>
    ssrFetch<BlogPostDetail>(`/blog/posts/${encodeURIComponent(slug)}/`),
};

// City list for /qytete pages (Albanian-first, with English-safe slugs).
export const ALBANIAN_CITIES: Array<{ slug: string; name: string; region?: string }> = [
  { slug: "tirane",       name: "Tiranë",      region: "Tiranë" },
  { slug: "durres",       name: "Durrës",      region: "Durrës" },
  { slug: "vlore",        name: "Vlorë",       region: "Vlorë" },
  { slug: "elbasan",      name: "Elbasan",     region: "Elbasan" },
  { slug: "shkoder",      name: "Shkodër",     region: "Shkodër" },
  { slug: "fier",         name: "Fier",        region: "Fier" },
  { slug: "korce",        name: "Korçë",       region: "Korçë" },
  { slug: "berat",        name: "Berat",       region: "Berat" },
  { slug: "lushnje",      name: "Lushnjë",     region: "Fier" },
  { slug: "pogradec",     name: "Pogradec",    region: "Korçë" },
  { slug: "kavaje",       name: "Kavajë",      region: "Tiranë" },
  { slug: "lezhe",        name: "Lezhë",       region: "Lezhë" },
  { slug: "sarande",      name: "Sarandë",     region: "Vlorë" },
  { slug: "kukes",        name: "Kukës",       region: "Kukës" },
  { slug: "gjirokaster",  name: "Gjirokastër", region: "Gjirokastër" },
  { slug: "patos",        name: "Patos",       region: "Fier" },
  { slug: "kruje",        name: "Krujë",       region: "Durrës" },
  { slug: "kucove",       name: "Kuçovë",      region: "Berat" },
];

export function findCityBySlug(slug: string) {
  return ALBANIAN_CITIES.find((c) => c.slug === slug.toLowerCase());
}

export const SITE = {
  name: "Gjej Pro",
  tagline: "Profesionistë për ju",
  description:
    "Platforma më e madhe shqiptare për të gjetur mjeshtër dhe profesionistë të verifikuar: elektricistë, hidraulikë, bravandreqës, pastrues e shumë të tjerë.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002",
  // The only locale actually served today. Content is Albanian-language,
  // targeted at Albania; use this (not a bare "sq") anywhere a BCP-47 tag
  // is needed (html lang, og:locale, hreflang).
  locale: "sq-AL",
};

/**
 * Country expansion — the default (Albania) section is Albanian-language,
 * for an Albanian audience; the US/UK sections are English-language, aimed
 * at both the Albanian diaspora and local clients hiring Albanian
 * professionals there. `path` is the subdirectory prefix (e.g. `/uk` ->
 * gjejpro.al/uk/...).
 *
 * `alternates.languages` is wired on every page pair using this list —
 * that's the only change needed to keep hreflang correct across the site.
 */
export const COUNTRY_LOCALES: Array<{
  locale: string; // BCP-47
  path: string; // "" for the default (Albania) section
  label: string;
  live: boolean;
}> = [
  { locale: "sq-AL", path: "", label: "Shqipëri", live: true },
  { locale: "en-GB", path: "/uk", label: "United Kingdom", live: true },
  { locale: "en-US", path: "/us", label: "United States", live: true },
];

/**
 * Builds `alternates.languages` for a page that exists in every live
 * country section at the same logical path — e.g. suffix "/elektricist"
 * covers "/elektricist", "/uk/elektricist", "/us/elektricist". Only call
 * this for paths that actually exist in every section (hub pages, category
 * pages, city pages); don't call it for AL-only pages like /blog.
 */
export function hreflangAlternates(suffix: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of COUNTRY_LOCALES) {
    if (!loc.live) continue;
    languages[loc.locale] = `${SITE.url}${loc.path}${suffix}`;
  }
  const albania = COUNTRY_LOCALES.find((l) => l.locale === "sq-AL");
  languages["x-default"] = `${SITE.url}${albania?.path ?? ""}${suffix}`;
  return languages;
}
