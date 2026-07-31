/**
 * schema.org JSON-LD builders. Render the result via <JsonLd data={...} />
 * (see components/JsonLd.tsx). Keep these pure/serializable — no functions,
 * no React elements, no PII (email/phone/exact address are intentionally
 * never shown publicly, see /pyetjet-e-shpeshta).
 */
import type { Category, FreelancerDetail, ReviewItem } from "./api";
import { SITE, type BlogPostDetail } from "./server-api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLd = Record<string, any>;

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/gjej-pro-logo.png`,
    description: SITE.description,
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "sq-AL",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/profesionistet?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageSchema(
  qa: Array<{ q: string; a: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** A service category page — "Elektricistë në Shqipëri", etc. */
export function serviceSchema(category: Category): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: category.name,
    name: category.name,
    description: `${category.name} të verifikuar në Shqipëri, të gjetur përmes ${SITE.name}.`,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: {
      "@type": "Country",
      name: "Albania",
    },
    url: `${SITE.url}/${category.slug}`,
  };
}

/** A simple listing of profile/category cards, for search-result-shaped pages. */
export function itemListSchema(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Every freelancer — solo or with a company_name — is marked up as a
 * generic LocalBusiness. Google restricts review/rating rich results to
 * Organization-shaped entities, not Person, so this is the correct choice
 * even for solo tradespeople (Thumbtack/Angi do the same). Never include
 * telephone/email/street address: those are intentionally private.
 */
export function freelancerSchema(
  profile: FreelancerDetail,
  reviews: ReviewItem[],
): JsonLd {
  const url = `${SITE.url}/profesionist/${profile.slug}`;
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: profile.company_name || profile.full_name,
    url,
  };

  const description = profile.headline || profile.bio;
  if (description) schema.description = description.slice(0, 300);
  if (profile.avatar_url) schema.image = profile.avatar_url;

  if (profile.categories.length > 0) {
    schema.additionalType = profile.categories.map((c) => c.name);
  }

  if (profile.service_areas.length > 0) {
    schema.areaServed = profile.service_areas.map((a) => ({
      "@type": "City",
      name: a.city,
    }));
  }

  if (profile.hourly_rate_min || profile.hourly_rate_max) {
    schema.priceRange = `${profile.hourly_rate_min ?? "?"}-${
      profile.hourly_rate_max ?? "?"
    } ${profile.currency}`;
  }

  if (profile.review_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: profile.avg_rating,
      reviewCount: profile.review_count,
    };
  }

  if (reviews.length > 0) {
    schema.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.reviewer_first_name },
      datePublished: r.created_at,
      ...(r.comment ? { reviewBody: r.comment } : {}),
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  return schema;
}

export function blogPostingSchema(post: BlogPostDetail): JsonLd {
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/gjej-pro-logo.png`,
      },
    },
    mainEntityOfPage: url,
  };
}
