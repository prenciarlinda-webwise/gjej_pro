import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CategoryTile } from "@/components/CategoryTile";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { serverApi, SITE } from "@/lib/server-api";

const STRINGS = {
  sq: {
    metaTitle: `Kategoritë e shërbimeve | ${SITE.name}`,
    metaDescription:
      "Të gjitha kategoritë e shërbimeve në Gjej Pro: elektricistë, hidraulikë, bravandreqës, mjeshtra ndërtimi, pastrim shtëpie, dhe shumë të tjera.",
    kicker: "Kategoritë",
    titlePre: "Çfarë po kërkoni",
    titleEm: "sot?",
    subtitle: (count: number, pros: number) =>
      `${count}+ kategori shërbimesh. ${pros} profesionistë të verifikuar gati t'ju ndihmojnë.`,
    browseAll: "Shfleto të gjithë profesionistët →",
    postRequest: "Posto një kërkesë",
    notFoundTitle: "Nuk e gjeni kategorinë tuaj?",
    notFoundBody:
      "Po shtojmë kategori të reja vazhdimisht. Postoni kërkesën tuaj dhe do t'ju gjejmë profesionistin e duhur.",
  },
  en: {
    metaTitle: `Service categories | ${SITE.name}`,
    metaDescription:
      "All service categories on Gjej Pro: electricians, plumbers, locksmiths, construction, home cleaning, and many more.",
    kicker: "Categories",
    titlePre: "What are you looking for",
    titleEm: "today?",
    subtitle: (count: number, pros: number) =>
      `${count}+ service categories. ${pros} verified professionals ready to help.`,
    browseAll: "Browse all professionals →",
    postRequest: "Post a request",
    notFoundTitle: "Can't find your category?",
    notFoundBody:
      "We're adding new categories all the time. Post your request and we'll find you the right professional.",
  },
};

type SearchParams = Promise<{ locale?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `${SITE.url}/kategorite` },
  };
}

export default async function CategoriesIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const q = locale === "en" ? "?locale=en" : "";
  const qAmp = locale === "en" ? "&locale=en" : "";

  const categories = (await serverApi.categories()) ?? [];
  const totalPros = categories.reduce(
    (acc, c) => acc + (c.freelancer_count ?? 0),
    0,
  );

  return (
    <>
      <PublicHeader locale={locale} />
      <main className="flex-1">
        <section className="bg-gradient-warm relative overflow-hidden">
          {/* Decorative shapes */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, rgba(46, 125, 91, 0.15), transparent)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 w-[360px] h-[360px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201, 169, 97, 0.15), transparent)",
            }}
          />

          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20 relative">
            <p className="text-xs uppercase tracking-wider text-stone">
              {t.kicker}
            </p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 text-ink leading-[1.05] max-w-3xl">
              {t.titlePre} <span className="italic text-forest">{t.titleEm}</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl leading-relaxed">
              {t.subtitle(categories.length, totalPros)}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/profesionistet${q}`}>
                <Button variant="primary" size="lg">
                  {t.browseAll}
                </Button>
              </Link>
              <Link href={`/regjistrohu?role=klient${qAmp}`}>
                <Button variant="secondary" size="lg">
                  {t.postRequest}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => (
              <CategoryTile
                key={c.id}
                slug={c.slug}
                name={c.name}
                name_en={c.name_en}
                icon={c.icon}
                count={c.freelancer_count ?? 0}
                locale={locale}
              />
            ))}
          </div>
        </section>

        <section className="bg-gradient-forest text-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              {t.notFoundTitle}
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              {t.notFoundBody}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href={`/regjistrohu?role=klient${qAmp}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-forest hover:bg-white/90"
                >
                  {t.postRequest}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter locale={locale} />
    </>
  );
}
