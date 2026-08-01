import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ALBANIAN_CITIES } from "@/lib/server-api";
import { COUNTRIES, type CountryConfig } from "@/lib/countries";
import type { UiLocale } from "@/components/PublicHeader";

const TOP_CATEGORIES_SQ = [
  { slug: "elektricist", name: "Elektricist" },
  { slug: "hidraulik", name: "Hidraulik" },
  { slug: "bravandreqes", name: "Bravandreqës" },
  { slug: "mjeshter-ndertimi", name: "Mjeshtër ndërtimi" },
  { slug: "suvatim-lyerje", name: "Suvatim & Lyerje" },
  { slug: "pastrim-shtepie", name: "Pastrim shtëpie" },
];

// Same curated slugs as TOP_CATEGORIES_SQ, English display names (matches
// each Category's `name_en` on the backend).
const TOP_CATEGORIES_EN = [
  { slug: "elektricist", name: "Electrician" },
  { slug: "hidraulik", name: "Plumber" },
  { slug: "bravandreqes", name: "Locksmith" },
  { slug: "mjeshter-ndertimi", name: "Construction" },
  { slug: "suvatim-lyerje", name: "Plastering & Painting" },
  { slug: "pastrim-shtepie", name: "Home Cleaning" },
];

const FOOTER_STRINGS: Record<UiLocale, {
  tagline: string;
  commission: string;
  categoriesHeader: string;
  citiesHeader: string;
  platformHeader: string;
  seeAll: string;
  howItWorks: string;
  forProfessionals: string;
  aboutUs: string;
  blog: string;
  faq: string;
  copyright: (year: number) => string;
  albaniaLabel: string;
}> = {
  sq: {
    tagline: "Falas për të gjithë shqiptarët kudo në botë.",
    commission: "0% komision platforme.",
    categoriesHeader: "Kategoritë",
    citiesHeader: "Qytete",
    platformHeader: "Platforma",
    seeAll: "Të gjitha →",
    howItWorks: "Si funksionon",
    forProfessionals: "Për profesionistët",
    aboutUs: "Rreth nesh",
    blog: "Blog",
    faq: "Pyetjet e shpeshta",
    copyright: (year) => `© ${year} Gjej Pro · Profesionistë për ju`,
    albaniaLabel: "Shqipëri",
  },
  en: {
    tagline: "Free for Albanian professionals everywhere.",
    commission: "0% platform commission.",
    categoriesHeader: "Categories",
    citiesHeader: "Cities",
    platformHeader: "Platform",
    seeAll: "See all →",
    howItWorks: "How it works",
    forProfessionals: "For professionals",
    aboutUs: "About us",
    blog: "Blog",
    faq: "FAQ",
    copyright: (year) => `© ${year} Gjej Pro · Professionals for you`,
    albaniaLabel: "Albania",
  },
};

export function PublicFooter({
  locale = "sq",
  country,
}: {
  locale?: UiLocale;
  /** Only relevant when locale="en" — scopes the Categories/Cities columns
   * to this country section instead of the default Albania ones. */
  country?: CountryConfig;
}) {
  const year = new Date().getFullYear();
  const t = FOOTER_STRINGS[locale];
  const isEn = locale === "en" && country;

  const categories = isEn ? TOP_CATEGORIES_EN : TOP_CATEGORIES_SQ;
  const categoryHref = (slug: string) =>
    isEn ? `${country!.pathPrefix}/${slug}` : `/${slug}`;
  const seeAllCategoriesHref = isEn ? country!.pathPrefix : "/kategorite";

  const cities = isEn ? country!.cities.slice(0, 6) : ALBANIAN_CITIES.slice(0, 6);
  const cityHref = (slug: string) =>
    isEn ? `${country!.pathPrefix}/qytete/${slug}` : `/qytete/${slug}`;
  const seeAllCitiesHref = isEn ? `${country!.pathPrefix}/qytete` : "/qytete";

  const q = locale === "en" ? "?locale=en" : "";

  return (
    <footer className="border-t border-line bg-surface mt-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Logo size={104} />
          <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-[18rem]">
            {t.tagline}
          </p>
          <p className="mt-3 text-xs font-medium text-forest max-w-[18rem]">
            {t.commission}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-stone">
            {t.categoriesHeader}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryHref(c.slug)}
                  className="text-ink hover:text-forest"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={seeAllCategoriesHref}
                className="text-stone hover:text-ink"
              >
                {t.seeAll}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-stone">
            {t.citiesHeader}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={cityHref(c.slug)}
                  className="text-ink hover:text-forest"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href={seeAllCitiesHref} className="text-stone hover:text-ink">
                {t.seeAll}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-stone">
            {t.platformHeader}
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={`/si-funksionon${q}`} className="text-ink hover:text-forest">
                {t.howItWorks}
              </Link>
            </li>
            <li>
              <Link href={`/per-profesionistet${q}`} className="text-ink hover:text-forest">
                {t.forProfessionals}
              </Link>
            </li>
            <li>
              <Link href={`/rreth-nesh${q}`} className="text-ink hover:text-forest">
                {t.aboutUs}
              </Link>
            </li>
            <li>
              <Link href={`/blog${q}`} className="text-ink hover:text-forest">
                {t.blog}
              </Link>
            </li>
            <li>
              <Link href={`/pyetjet-e-shpeshta${q}`} className="text-ink hover:text-forest">
                {t.faq}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone">
          <p>{t.copyright(year)}</p>
          <nav className="flex items-center gap-3">
            <Link href="/" className="hover:text-ink">
              {t.albaniaLabel}
            </Link>
            {Object.values(COUNTRIES).map((c) => (
              <Link key={c.code} href={c.pathPrefix} className="hover:text-ink">
                {c.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
