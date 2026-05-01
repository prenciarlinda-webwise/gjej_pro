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
    slug?: string;
    page?: number;
  } = {}) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.category) sp.set("category", params.category);
    if (params.city) sp.set("city", params.city);
    if (params.slug) sp.set("slug", params.slug);
    if (params.page) sp.set("page", String(params.page));
    const qs = sp.toString();
    return ssrFetch<PaginatedResponse<FreelancerListItem>>(
      `/freelancers/${qs ? `?${qs}` : ""}`,
    );
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
};
