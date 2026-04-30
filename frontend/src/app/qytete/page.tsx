import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { ALBANIAN_CITIES, SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Qytetet e mbuluara në Shqipëri | ${SITE.name}`,
  description:
    "Profesionistë të verifikuar në Tiranë, Durrës, Vlorë, Elbasan, Shkodër, Korçë e shumë qytete të tjera shqiptare.",
  alternates: { canonical: `${SITE.url}/qytete` },
};

export default function CitiesIndexPage() {
  // Group by region for nicer browse experience
  const grouped: Record<string, typeof ALBANIAN_CITIES> = {};
  for (const c of ALBANIAN_CITIES) {
    const key = c.region ?? c.name;
    (grouped[key] ??= []).push(c);
  }

  return (
    <>
      <PublicHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-xs uppercase tracking-wider text-stone">Qytetet</p>
        <h1 className="font-display text-4xl mt-1.5 text-ink">
          Qytetet që mbulojmë
        </h1>
        <p className="mt-3 text-base text-ink-muted max-w-2xl">
          Profesionistët e Gjej Pro punojnë në mbarë Shqipërinë. Klikoni
          qytetin tuaj për të parë mjeshtrat e disponueshëm.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-lg overflow-hidden">
          {Object.entries(grouped).map(([region, cities]) => (
            <div key={region} className="bg-surface p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-stone">
                Qarku · {region}
              </h2>
              <ul className="mt-3 space-y-1.5">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/qytete/${c.slug}`}
                      className="text-sm text-ink hover:text-forest"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
