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
    title: `Qytetet e mbuluara në ${country.label} | ${SITE.name}`,
    description: `Profesionistë shqiptarë të verifikuar në ${cityNames} e qytete të tjera në ${country.label}.`,
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
          { name: "Kreu", url: SITE.url },
          { name: country.label, url: `${SITE.url}${country.pathPrefix}` },
          { name: "Qytetet", url: `${SITE.url}${country.pathPrefix}/qytete` },
        ])}
      />
      <PublicHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <Link
          href={country.pathPrefix}
          className="text-xs text-stone hover:text-ink"
        >
          ← {country.label}
        </Link>
        <p className="mt-4 text-xs uppercase tracking-wider text-stone">
          Qytetet
        </p>
        <h1 className="font-display text-4xl mt-1.5 text-ink">
          Qytetet që mbulojmë në {country.label}
        </h1>
        <p className="mt-3 text-base text-ink-muted max-w-2xl">
          Profesionistë shqiptarë në qendrat kryesore të komunitetit në{" "}
          {country.label}. Klikoni qytetin tuaj për të parë mjeshtrat e
          disponueshëm.
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
      <PublicFooter />
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
  if (!city) return { title: `Qyteti nuk u gjet | ${SITE.name}` };

  const url = `${SITE.url}${country.pathPrefix}/qytete/${slug}`;
  const title = `Profesionistë shqiptarë në ${city.name} | ${SITE.name}`;
  const description = `Elektricistë, hidraulikë, pastrues e profesionistë të tjerë shqiptarë të verifikuar në ${city.name}, ${country.label}.`;

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
            { name: "Kreu", url: SITE.url },
            { name: country.label, url: `${SITE.url}${country.pathPrefix}` },
            { name: "Qytetet", url: `${SITE.url}${country.pathPrefix}/qytete` },
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
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
            <Link
              href={`${country.pathPrefix}/qytete`}
              className="text-xs text-stone hover:text-ink"
            >
              ← Të gjitha qytetet · {country.label}
            </Link>
            <h1 className="mt-3 font-display text-4xl text-ink">
              Profesionistë shqiptarë në {city.name}
            </h1>
            <p className="mt-2 text-base text-ink-muted max-w-2xl">
              {freelancers.length > 0
                ? `${freelancers.length}${list?.next ? "+" : ""} profesionistë të verifikuar punojnë në ${city.name}.`
                : `Ende pa profesionistë të listuar në ${city.name}, ${country.label}.`}
            </p>
            <div className="mt-5">
              <Link
                href={`/profesionistet?country=${country.apiCountry}&city=${encodeURIComponent(city.name)}`}
              >
                <Button variant="primary">Filtroni më hollësisht →</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
          {freelancers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center">
              <p className="text-sm text-ink-muted">
                Ende nuk kemi profesionistë të listuar në{" "}
                <span className="font-medium text-ink">{city.name}</span>.
              </p>
              <Link
                href="/regjistrohu?role=freelancer"
                className="mt-4 inline-block"
              >
                <Button variant="secondary">Bëhu i pari në {city.name}!</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {freelancers.map((f) => (
                <FreelancerCard key={f.id} f={f} />
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
