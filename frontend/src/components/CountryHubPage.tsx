import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { serverApi, SITE } from "@/lib/server-api";
import type { CountryConfig } from "@/lib/countries";

export async function CountryHubPage({ country }: { country: CountryConfig }) {
  const [categories, count] = await Promise.all([
    serverApi.categories(),
    serverApi
      .searchFreelancers({ country: country.apiCountry, page_size: 1 })
      .then((r) => r?.count ?? 0),
  ]);
  const cats = categories ?? [];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE.url },
          { name: country.label, url: `${SITE.url}${country.pathPrefix}` },
        ])}
      />
      <PublicHeader locale="en" />
      <main className="flex-1">
        <section className="bg-gradient-warm">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
            <p className="text-xs uppercase tracking-wider text-stone">
              {country.heroKicker}
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl text-ink leading-[1.05] max-w-2xl">
              {country.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
              {country.heroBody}
            </p>
            <p className="mt-3 text-sm font-medium text-forest max-w-xl">
              0% platform commission. Free for professionals and clients.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/profesionistet?country=${country.apiCountry}&locale=en`}>
                <Button variant="primary" size="lg">
                  See professionals →
                </Button>
              </Link>
              <Link href="/regjistrohu?role=freelancer&locale=en">
                <Button variant="secondary" size="lg">
                  Become a professional
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {count === 0 && (
          <section className="border-y border-line bg-surface">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
              <div className="card p-8 text-center max-w-2xl mx-auto">
                <p className="text-xs uppercase tracking-wider text-forest mb-2">
                  Just getting started here
                </p>
                <h2 className="font-display text-2xl text-ink">
                  No professionals listed in {country.inLabel} yet.
                </h2>
                <p className="mt-3 text-ink-muted">
                  Are you an Albanian professional in {country.inLabel}? Create
                  your free profile and be the first clients find.
                </p>
                <div className="mt-5">
                  <Link href="/regjistrohu?role=freelancer&locale=en">
                    <Button variant="primary">Be the first →</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs uppercase tracking-wider text-stone mb-1">
              Categories
            </p>
            <h2 className="font-display text-3xl text-ink">
              What are you looking for?
            </h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cats.slice(0, 12).map((c) => (
                <Link
                  key={c.id}
                  href={`${country.pathPrefix}/${c.slug}`}
                  className="card card-link p-5 group"
                >
                  <div
                    className="inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "rgba(31, 77, 58, 0.08)",
                      color: "var(--color-forest)",
                    }}
                  >
                    <CategoryIcon slug={c.icon || "monitor"} size={22} />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink leading-tight">
                    {c.name_en || c.name}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/kategorite"
                className="text-sm font-medium text-forest hover:underline"
              >
                All categories →
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs uppercase tracking-wider text-stone mb-1">
              Cities
            </p>
            <h2 className="font-display text-3xl text-ink">
              {country.label} — by city
            </h2>
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
              {country.cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`${country.pathPrefix}/qytete/${city.slug}`}
                    className="card card-link block px-4 py-3"
                  >
                    <span className="text-ink font-medium">{city.name}</span>
                    <span className="block mt-1 text-xs text-forest">
                      See professionals →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 text-center">
            <h2 className="font-display text-2xl text-ink">
              Are you an Albanian professional in {country.inLabel}?
            </h2>
            <p className="mt-2 text-ink-muted max-w-xl mx-auto">
              Create your free profile. No subscriptions, no commissions —
              100% of the price goes to you.
            </p>
            <div className="mt-5">
              <Link href="/regjistrohu?role=freelancer&locale=en">
                <Button variant="primary" size="lg">
                  Sign up free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter locale="en" country={country} />
    </>
  );
}
