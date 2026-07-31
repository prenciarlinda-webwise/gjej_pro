import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { FreelancerCard } from "@/components/FreelancerCard";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";
import { serverApi, SITE, hreflangAlternates } from "@/lib/server-api";
import {
  findCountryCityBySlug,
  type CountryConfig,
} from "@/lib/countries";

// ---------------------------------------------------------------------------
// Index page — /us/qytete, /uk/qytete
// ---------------------------------------------------------------------------

export function cityCountryIndexMetadata(country: CountryConfig): Metadata {
  const url = `${SITE.url}${country.pathPrefix}/qytete`;
  const cityNames = country.cities.map((c) => c.name).join(", ");
  return {
    title: `Cities we cover in ${country.inLabel}`,
    description: `Verified Albanian professionals in ${cityNames} and other cities in ${country.inLabel}.`,
    alternates: {
      canonical: url,
      languages: hreflangAlternates("/qytete"),
    },
  };
}

export function CityCountryIndexView({ country }: { country: CountryConfig }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE.url },
          { name: country.label, url: `${SITE.url}${country.pathPrefix}` },
          { name: "Cities", url: `${SITE.url}${country.pathPrefix}/qytete` },
        ])}
      />
      <PublicHeader locale="en" />
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <Link
          href={country.pathPrefix}
          className="text-xs text-stone hover:text-ink"
        >
          ← {country.label}
        </Link>
        <p className="mt-4 text-xs uppercase tracking-wider text-stone">
          Cities
        </p>
        <h1 className="font-display text-4xl mt-1.5 text-ink">
          Cities we cover in {country.inLabel}
        </h1>
        <p className="mt-3 text-base text-ink-muted max-w-2xl">
          Albanian professionals in the main community hubs in {country.inLabel}.
          Click your city to see available tradespeople.
        </p>

        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
          {country.cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`${country.pathPrefix}/qytete/${c.slug}`}
                className="card card-link block px-4 py-3"
              >
                <span className="text-ink font-medium">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <PublicFooter locale="en" country={country} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Detail page — /us/qytete/[slug], /uk/qytete/[slug]
// ---------------------------------------------------------------------------

export async function cityCountryDetailMetadata(
  country: CountryConfig,
  slug: string,
): Promise<Metadata> {
  const city = findCountryCityBySlug(country, slug);
  if (!city) return { title: "City not found" };

  const url = `${SITE.url}${country.pathPrefix}/qytete/${slug}`;
  const title = `Albanian professionals in ${city.name}`;
  const description = `Electricians, plumbers, cleaners, and other verified Albanian professionals in ${city.name}, ${country.label}.`;

  const list = await serverApi.searchFreelancers({
    city: city.name,
    country: country.apiCountry,
    page_size: 1,
  });
  const total = list?.count ?? 0;

  return {
    title,
    description,
    // No cross-country `languages` here, deliberately: each country's
    // cities are a disjoint set (there's no "/qytete/{slug}" in AL that
    // corresponds to a US/UK city), so there's no real hreflang equivalent
    // to point at — unlike the category or city-index pages.
    alternates: { canonical: url },
    robots: total > 0 ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: country.locale.replace("-", "_"),
      type: "website",
    },
  };
}

export async function CityCountryDetailView({
  country,
  slug,
}: {
  country: CountryConfig;
  slug: string;
}) {
  const city = findCountryCityBySlug(country, slug);
  if (!city) notFound();

  const list = await serverApi.searchFreelancers({
    city: city.name,
    country: country.apiCountry,
  });
  const freelancers = list?.results ?? [];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: SITE.url },
            { name: country.label, url: `${SITE.url}${country.pathPrefix}` },
            { name: "Cities", url: `${SITE.url}${country.pathPrefix}/qytete` },
            {
              name: city.name,
              url: `${SITE.url}${country.pathPrefix}/qytete/${city.slug}`,
            },
          ]),
          ...(freelancers.length > 0
            ? [
                itemListSchema(
                  freelancers.map((f) => ({
                    name: f.full_name,
                    url: `${SITE.url}/profesionist/${f.slug}`,
                  })),
                ),
              ]
            : []),
        ]}
      />
      <PublicHeader locale="en" />
      <main className="flex-1">
        <section className="border-b border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
            <Link
              href={`${country.pathPrefix}/qytete`}
              className="text-xs text-stone hover:text-ink"
            >
              ← All cities · {country.label}
            </Link>
            <h1 className="mt-3 font-display text-4xl text-ink">
              Albanian professionals in {city.name}
            </h1>
            <p className="mt-2 text-base text-ink-muted max-w-2xl">
              {freelancers.length > 0
                ? `${freelancers.length}${list?.next ? "+" : ""} verified professional${freelancers.length === 1 && !list?.next ? "" : "s"} work${freelancers.length === 1 && !list?.next ? "s" : ""} in ${city.name}.`
                : `No professionals listed in ${city.name}, ${country.label} yet.`}
            </p>
            <div className="mt-5">
              <Link
                href={`/profesionistet?country=${country.apiCountry}&city=${encodeURIComponent(city.name)}`}
              >
                <Button variant="primary">Filter in detail →</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
          {freelancers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center">
              <p className="text-sm text-ink-muted">
                We don&apos;t have any professionals listed in{" "}
                <span className="font-medium text-ink">{city.name}</span> yet.
              </p>
              <Link
                href="/regjistrohu?role=freelancer&locale=en"
                className="mt-4 inline-block"
              >
                <Button variant="secondary">Be the first in {city.name}!</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {freelancers.map((f) => (
                <FreelancerCard key={f.id} f={f} locale="en" />
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter locale="en" country={country} />
    </>
  );
}
