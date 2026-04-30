import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { FreelancerCard } from "@/components/FreelancerCard";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { findCityBySlug, serverApi, SITE } from "@/lib/server-api";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const city = findCityBySlug(slug);
  if (!city) return { title: `Qyteti nuk u gjet | ${SITE.name}` };
  const title = `Profesionistë në ${city.name} | Gjej mjeshtrin e duhur | ${SITE.name}`;
  const description = `Elektricistë, hidraulikë, bravandreqës, pastrues e shumë profesionistë të tjerë të verifikuar në ${city.name}. Vlerësime reale nga klientët, çmime transparente.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/qytete/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/qytete/${slug}`,
      siteName: SITE.name,
      locale: "sq_AL",
      type: "website",
    },
    keywords: [
      city.name,
      `profesionist ${city.name}`,
      `mjeshtër ${city.name}`,
      `shërbime ${city.name}`,
    ],
  };
}

export default async function CityDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const city = findCityBySlug(slug);
  if (!city) notFound();

  const [list, categories] = await Promise.all([
    serverApi.searchFreelancers({ city: city.name }),
    serverApi.categories(),
  ]);
  const freelancers = list?.results ?? [];

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
            <Link href="/qytete" className="text-xs text-stone hover:text-ink">
              ← Të gjitha qytetet
            </Link>
            <h1 className="mt-3 font-display text-4xl text-ink">
              Profesionistë në {city.name}
            </h1>
            <p className="mt-2 text-base text-ink-muted max-w-2xl">
              {freelancers.length > 0
                ? `${freelancers.length}${list?.next ? "+" : ""} profesionistë të verifikuar punojnë në ${city.name}`
                : `Ende pa profesionistë të listuar në ${city.name}`}
              {city.region && city.region !== city.name && (
                <span className="text-stone"> · qarku i {city.region}</span>
              )}
              .
            </p>
            <div className="mt-5">
              <Link href={`/profesionistet?city=${encodeURIComponent(city.name)}`}>
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
              <Link href="/regjistrohu?role=freelancer" className="mt-4 inline-block">
                <Button variant="secondary">Bëhu i pari në {city.name}!</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {freelancers.map((f) => <FreelancerCard key={f.id} f={f} />)}
            </div>
          )}
        </section>

        {/* SEO-friendly internal linking — by category */}
        {categories && categories.length > 0 && (
          <section className="border-t border-line bg-surface">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
              <h2 className="font-display text-2xl text-ink">
                Sipas kategorisë në {city.name}
              </h2>
              <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                {categories.slice(0, 12).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/profesionistet?category=${c.slug}&city=${encodeURIComponent(city.name)}`}
                      className="text-ink hover:text-forest"
                    >
                      {c.name} në {city.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
