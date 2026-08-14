import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { FreelancerCard } from "@/components/FreelancerCard";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbSchema,
  itemListSchema,
  serviceSchema,
} from "@/lib/structured-data";
import {
  serverApi,
  SITE,
  ALBANIAN_CITIES,
  hreflangAlternates,
} from "@/lib/server-api";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  const cats = await serverApi.categories({ strict: true });
  return cats?.find((c) => c.slug === slug.toLowerCase()) ?? null;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: `Faqja nuk u gjet | ${SITE.name}` };
  const title = `${cat.name} në Shqipëri | Gjej profesionistin | ${SITE.name}`;
  const description = `Gjeni ${cat.name.toLowerCase()} të verifikuar në Shqipëri. Krahasoni çmimet, vlerësimet dhe zonat e punës. Përgjigje brenda orëve.`;
  const list = await serverApi.searchFreelancers({ category: slug, page_size: 1 });
  const total = list?.count ?? 0;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.url}/${slug}`,
      languages: hreflangAlternates(`/${slug}`),
    },
    // Don't index an empty category page — avoid thin content while supply
    // is still zero. Flips to indexable the moment the first freelancer
    // lists here. Mirrors CategoryCountryView's UK/US equivalent.
    robots: total > 0 ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/${slug}`,
      siteName: SITE.name,
      locale: "sq_AL",
      type: "website",
    },
    keywords: [
      cat.name,
      cat.name_en,
      `${cat.name} Tiranë`,
      `${cat.name} Shqipëri`,
    ].filter(Boolean) as string[],
  };
}

export default async function CategoryDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) notFound();

  const list = await serverApi.searchFreelancers({ category: slug });
  const freelancers = list?.results ?? [];
  const total = list?.count ?? 0;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(cat),
          breadcrumbSchema([
            { name: "Kreu", url: SITE.url },
            { name: "Kategoritë", url: `${SITE.url}/kategorite` },
            { name: cat.name, url: `${SITE.url}/${cat.slug}` },
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
        <section className="bg-gradient-warm relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, rgba(31, 77, 58, 0.10), transparent)",
            }}
          />

          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 sm:py-20 relative">
            <Link href="/kategorite" className="text-xs text-stone hover:text-ink">
              ← Të gjitha kategoritë
            </Link>

            <div className="mt-6 flex items-start gap-6">
              <div
                className="shrink-0 inline-flex items-center justify-center rounded-3xl"
                style={{
                  width: 96,
                  height: 96,
                  backgroundColor: "rgba(31, 77, 58, 0.10)",
                  color: "var(--color-forest)",
                }}
              >
                <CategoryIcon slug={cat.icon || "monitor"} size={56} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-stone">
                  Kategori
                </p>
                <h1 className="mt-1 font-display text-5xl sm:text-6xl text-ink leading-[1.05]">
                  {cat.name}
                </h1>
                {cat.name_en && (
                  <p className="mt-2 text-base text-ink-muted italic">
                    {cat.name_en}
                  </p>
                )}
              </div>
            </div>

            <p className="mt-6 text-base text-ink-muted max-w-2xl">
              {total > 0
                ? `${total}${list?.next ? "+" : ""} profesionistë të verifikuar.`
                : "Ende pa profesionistë të listuar në këtë kategori."}{" "}
              Krahasoni çmimet, lexoni vlerësimet dhe zgjidhni atë që ju
              përshtatet më mirë.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/profesionistet?category=${cat.slug}`}>
                <Button variant="primary" size="lg">
                  Filtroni më hollësisht →
                </Button>
              </Link>
              <Link href={`/regjistrohu?role=freelancer`}>
                <Button variant="secondary" size="lg">
                  Bëhuni profesionist
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
          {freelancers.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-base text-ink-muted">
                Asnjë profesionist nuk është listuar ende në kategorinë{" "}
                <span className="font-medium text-ink">{cat.name}</span>.
              </p>
              <Link href="/regjistrohu?role=freelancer" className="mt-5 inline-block">
                <Button variant="primary">Bëhu i pari!</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-display text-2xl text-ink">
                  Profesionistët e listuar
                </h2>
                <span className="text-xs text-stone numeric">
                  {total} rezultate
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {freelancers.map((f) => <FreelancerCard key={f.id} f={f} />)}
              </div>
            </>
          )}
        </section>

        <section className="border-t border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
            <p className="text-xs uppercase tracking-wider text-stone mb-1">
              Sipas qytetit
            </p>
            <h2 className="font-display text-3xl text-ink">
              {cat.name} në qytetin tuaj
            </h2>
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
              {ALBANIAN_CITIES.slice(0, 12).map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/profesionistet?category=${cat.slug}&city=${encodeURIComponent(city.name)}`}
                    className="card card-link block px-4 py-3"
                  >
                    <span className="text-ink font-medium">{cat.name}</span>{" "}
                    <span className="text-stone">në</span>{" "}
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
      </main>
      <PublicFooter />
    </>
  );
}
