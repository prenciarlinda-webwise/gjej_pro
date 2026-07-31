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
          { name: "Kreu", url: SITE.url },
          { name: country.label, url: `${SITE.url}${country.pathPrefix}` },
        ])}
      />
      <PublicHeader />
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
              0% komision platforme. Falas për profesionistët dhe klientët.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/profesionistet?country=${country.apiCountry}`}>
                <Button variant="primary" size="lg">
                  Shiko profesionistët →
                </Button>
              </Link>
              <Link href="/regjistrohu?role=freelancer">
                <Button variant="secondary" size="lg">
                  Bëhu profesionist
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
                  Sapo po nisim këtu
                </p>
                <h2 className="font-display text-2xl text-ink">
                  Ende s&apos;ka profesionistë të listuar në {country.label}.
                </h2>
                <p className="mt-3 text-ink-muted">
                  Jeni profesionist shqiptar në {country.label}? Krijoni
                  profilin tuaj falas dhe bëhuni i pari që klientët gjejnë.
                </p>
                <div className="mt-5">
                  <Link href="/regjistrohu?role=freelancer">
                    <Button variant="primary">Bëhu i pari →</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs uppercase tracking-wider text-stone mb-1">
              Kategoritë
            </p>
            <h2 className="font-display text-3xl text-ink">
              Çfarë po kërkoni?
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
                    {c.name}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/kategorite"
                className="text-sm font-medium text-forest hover:underline"
              >
                Të gjitha kategoritë →
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs uppercase tracking-wider text-stone mb-1">
              Qytetet
            </p>
            <h2 className="font-display text-3xl text-ink">
              {country.label} — sipas qytetit
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
                      Shih profesionistët →
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
              Jeni profesionist shqiptar në {country.label}?
            </h2>
            <p className="mt-2 text-ink-muted max-w-xl mx-auto">
              Krijoni profilin tuaj falas. Pa abonime, pa komisione — 100% e
              çmimit shkon te ju.
            </p>
            <div className="mt-5">
              <Link href="/regjistrohu?role=freelancer">
                <Button variant="primary" size="lg">
                  Regjistrohu falas
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
