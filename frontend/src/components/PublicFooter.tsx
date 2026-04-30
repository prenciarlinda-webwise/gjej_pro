import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ALBANIAN_CITIES } from "@/lib/server-api";

const TOP_CATEGORIES = [
  { slug: "elektricist", name: "Elektricist" },
  { slug: "hidraulik", name: "Hidraulik" },
  { slug: "bravandreqes", name: "Bravandreqës" },
  { slug: "mjeshter-ndertimi", name: "Mjeshtër ndërtimi" },
  { slug: "suvatim-lyerje", name: "Suvatim & Lyerje" },
  { slug: "pastrim-shtepie", name: "Pastrim shtëpie" },
];

export function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface mt-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Logo size={48} />
          <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-[18rem]">
            Profesionistë të verifikuar për çdo punë në shtëpi apo biznes —
            shfletoni, krahasoni, kontaktoni.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-stone">
            Kategoritë
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {TOP_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="text-ink hover:text-forest"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/kategorite"
                className="text-stone hover:text-ink"
              >
                Të gjitha →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-stone">
            Qytete
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {ALBANIAN_CITIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/qytete/${c.slug}`}
                  className="text-ink hover:text-forest"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/qytete" className="text-stone hover:text-ink">
                Të gjitha →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-stone">
            Platforma
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/si-funksionon" className="text-ink hover:text-forest">
                Si funksionon
              </Link>
            </li>
            <li>
              <Link href="/per-profesionistet" className="text-ink hover:text-forest">
                Për profesionistët
              </Link>
            </li>
            <li>
              <Link href="/rreth-nesh" className="text-ink hover:text-forest">
                Rreth nesh
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-ink hover:text-forest">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/pyetjet-e-shpeshta" className="text-ink hover:text-forest">
                Pyetjet e shpeshta
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone">
          <p>© {year} Gjej Pro · Profesionistë për ju</p>
          <p>Shqipëria · Albania</p>
        </div>
      </div>
    </footer>
  );
}
