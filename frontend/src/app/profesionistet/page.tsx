import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema } from "@/lib/structured-data";
import { serverApi, SITE } from "@/lib/server-api";
import { COUNTRIES } from "@/lib/countries";
import FreelancerBrowseClient from "./FreelancerBrowseClient";

const STRINGS = {
  sq: {
    title: "Profesionistë në Shqipëri",
    description:
      "Shfletoni mijëra profesionistë të verifikuar në Shqipëri: elektricistë, hidraulikë, bravandreqës, pastrues e shumë të tjerë. Filtroni sipas kategorisë, qytetit ose vendndodhjes suaj.",
  },
  en: {
    title: "Albanian professionals",
    description:
      "Browse thousands of verified Albanian professionals: electricians, plumbers, locksmiths, cleaners, and many more. Filter by category, city, or your location.",
  },
};

type SearchParams = Promise<{ locale?: string; country?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { locale: localeParam, country: countryParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const countryConfig = countryParam
    ? Object.values(COUNTRIES).find((c) => c.apiCountry === countryParam)
    : undefined;

  const rawTitle = countryConfig
    ? locale === "en"
      ? `Albanian professionals in ${countryConfig.inLabel}`
      : `Profesionistë shqiptarë në ${countryConfig.label}`
    : t.title;
  const title = `${rawTitle} | ${SITE.name}`;

  return {
    title,
    description: t.description,
    alternates: { canonical: `${SITE.url}/profesionistet` },
    openGraph: {
      title,
      description: t.description,
      url: `${SITE.url}/profesionistet`,
      siteName: SITE.name,
      locale: locale === "en" ? "en_US" : "sq_AL",
      type: "website",
    },
  };
}

// The interactive filter/search UI is entirely client-rendered (geolocation,
// live query params), so this server wrapper exists only to give the page
// metadata and a crawlable ItemList — both invisible to non-JS crawlers
// (including most AI/answer-engine bots) if left inside the "use client" tree.
export default async function FreelancerBrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { country } = await searchParams;
  const list = await serverApi.searchFreelancers({ page: 1, country });
  const freelancers = list?.results ?? [];

  return (
    <>
      {freelancers.length > 0 && (
        <JsonLd
          data={itemListSchema(
            freelancers.map((f) => ({
              name: f.full_name,
              url: `${SITE.url}/profesionist/${f.slug}`,
            })),
          )}
        />
      )}
      <FreelancerBrowseClient />
    </>
  );
}
