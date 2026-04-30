import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CategoryTile } from "@/components/CategoryTile";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { serverApi, SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Kategoritë e shërbimeve | ${SITE.name}`,
  description:
    "Të gjitha kategoritë e shërbimeve në Gjej Pro — elektricistë, hidraulikë, bravandreqës, mjeshtra ndërtimi, pastrim shtëpie, dhe shumë të tjera.",
  alternates: { canonical: `${SITE.url}/kategorite` },
};

export default async function CategoriesIndexPage() {
  const categories = (await serverApi.categories()) ?? [];
  const totalPros = categories.reduce(
    (acc, c) => acc + (c.freelancer_count ?? 0),
    0,
  );

  return (
    <>
      <PublicHeader />
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
              Kategoritë
            </p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 text-ink leading-[1.05] max-w-3xl">
              Çfarë po kërkoni{" "}
              <span className="italic text-forest">sot?</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl leading-relaxed">
              {categories.length}+ kategori shërbimesh. {totalPros} profesionistë
              të verifikuar gati t&apos;ju ndihmojnë.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/profesionistet">
                <Button variant="primary" size="lg">
                  Shfleto të gjithë profesionistët →
                </Button>
              </Link>
              <Link href="/regjistrohu?role=klient">
                <Button variant="secondary" size="lg">
                  Posto një kërkesë
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
              />
            ))}
          </div>
        </section>

        <section className="bg-gradient-forest text-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              Nuk e gjeni kategorinë tuaj?
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              Po shtojmë kategori të reja vazhdimisht. Postoni kërkesën tuaj
              dhe do t&apos;ju gjejmë profesionistin e duhur.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href="/regjistrohu?role=klient">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-forest hover:bg-white/90"
                >
                  Posto një kërkesë
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
