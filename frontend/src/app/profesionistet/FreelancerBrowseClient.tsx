"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  api,
  type Category,
  type FreelancerListItem,
  type PaginatedResponse,
} from "@/lib/api";
import { PublicHeader, type UiLocale } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { FreelancerCard } from "@/components/FreelancerCard";
import { Field } from "@/components/Field";
import { Button } from "@/components/Button";
import { HeroDecoration } from "@/components/HeroDecoration";
import { MapView, type MapPin } from "@/components/MapView";
import { COUNTRIES, type CountryConfig } from "@/lib/countries";

const ALBANIAN_CITIES: { slug: string; name: string }[] = [
  { slug: "tirane", name: "Tiranë" },
  { slug: "durres", name: "Durrës" },
  { slug: "vlore", name: "Vlorë" },
  { slug: "elbasan", name: "Elbasan" },
  { slug: "shkoder", name: "Shkodër" },
  { slug: "fier", name: "Fier" },
  { slug: "korce", name: "Korçë" },
  { slug: "berat", name: "Berat" },
  { slug: "sarande", name: "Sarandë" },
];

const STRINGS: Record<UiLocale, {
  kicker: string;
  title: string;
  titleInCountry: (country: CountryConfig) => string;
  subtitle: string;
  search: string;
  searchPlaceholder: string;
  nearMe: string;
  useMyLocation: string;
  locating: string;
  locationHint: string;
  locationActive: string;
  radius: (km: number) => string;
  removeProximity: string;
  category: string;
  all: string;
  city: string;
  verifiedOnly: string;
  clearFilters: string;
  results: (n: number) => string;
  withinKm: (km: number) => string;
  emptyState: string;
  previous: string;
  next: string;
  page: (n: number) => string;
  geoUnsupported: string;
  geoDenied: string;
  geoFailed: string;
}> = {
  sq: {
    kicker: "Profesionistët",
    title: "Profesionistë në Shqipëri",
    titleInCountry: (c) => `Profesionistë shqiptarë në ${c.label}`,
    subtitle:
      "Filtroni sipas kategorisë, qytetit, vlerësimit, ose gjeni profesionistë pranë vendndodhjes suaj.",
    search: "Kërko",
    searchPlaceholder: "Emër, kategori, fjalë kyçe…",
    nearMe: "Pranë meje",
    useMyLocation: "📍 Përdor vendndodhjen time",
    locating: "Po lexohet…",
    locationHint: "Shfletuesi do të kërkojë leje për të ndarë vendndodhjen.",
    locationActive: "✓ Vendndodhja aktive",
    radius: (km) => `Rrezja: ${km} km`,
    removeProximity: "Hiqe filtrin e afërsisë",
    category: "Kategoria",
    all: "Të gjitha",
    city: "Qyteti",
    verifiedOnly: "Vetëm të verifikuar",
    clearFilters: "Pastro filtrat",
    results: (n) => `${n} rezultate`,
    withinKm: (km) => `Brenda ${km} km nga ju`,
    emptyState: "Asnjë profesionist nuk u gjet. Provoni filtra të tjerë ose rritni rrezen e kërkimit.",
    previous: "← E mëparshme",
    next: "E ardhshme →",
    page: (n) => `Faqja ${n}`,
    geoUnsupported: "Shfletuesi nuk mbështet vendndodhjen.",
    geoDenied: "Lejimi i vendndodhjes u mohua.",
    geoFailed: "Nuk arritëm të lexojmë vendndodhjen tuaj.",
  },
  en: {
    kicker: "Professionals",
    title: "Albanian professionals",
    titleInCountry: (c) => `Albanian professionals in ${c.inLabel}`,
    subtitle:
      "Filter by category, city, rating, or find professionals near your location.",
    search: "Search",
    searchPlaceholder: "Name, category, keyword…",
    nearMe: "Near me",
    useMyLocation: "📍 Use my location",
    locating: "Locating…",
    locationHint: "Your browser will ask for permission to share your location.",
    locationActive: "✓ Location active",
    radius: (km) => `Radius: ${km} km`,
    removeProximity: "Remove proximity filter",
    category: "Category",
    all: "All",
    city: "City",
    verifiedOnly: "Verified only",
    clearFilters: "Clear filters",
    results: (n) => `${n} ${n === 1 ? "result" : "results"}`,
    withinKm: (km) => `Within ${km} km of you`,
    emptyState: "No professional found. Try different filters or widen the search radius.",
    previous: "← Previous",
    next: "Next →",
    page: (n) => `Page ${n}`,
    geoUnsupported: "Your browser doesn't support location.",
    geoDenied: "Location permission was denied.",
    geoFailed: "We couldn't read your location.",
  },
};

interface Coords {
  lat: number;
  lng: number;
}

export default function FreelancerBrowseClient() {
  return (
    <Suspense fallback={null}>
      <FreelancerBrowse />
    </Suspense>
  );
}

function FreelancerBrowse() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const locale: UiLocale = sp.get("locale") === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const apiCountry = sp.get("country") ?? "";
  const countryConfig = apiCountry
    ? Object.values(COUNTRIES).find((c) => c.apiCountry === apiCountry)
    : undefined;
  const cityOptions = countryConfig ? countryConfig.cities : ALBANIAN_CITIES;
  const pageTitle = countryConfig ? t.titleInCountry(countryConfig) : t.title;

  const [categories, setCategories] = useState<Category[]>([]);
  const [results, setResults] = useState<PaginatedResponse<FreelancerListItem> | null>(null);
  const [q, setQ] = useState<string>(() => sp.get("q") ?? "");
  const [category, setCategory] = useState<string>(() => sp.get("category") ?? "");
  const [city, setCity] = useState<string>(() => sp.get("city") ?? "");
  const [verified, setVerified] = useState<boolean>(() => sp.get("verified") === "1");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [coordsError, setCoordsError] = useState<string>("");
  const [requestingLocation, setRequestingLocation] = useState(false);
  const [radiusKm, setRadiusKm] = useState(25);
  const [page, setPage] = useState<number>(() => Math.max(1, Number(sp.get("page") || 1)));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .searchFreelancers({
        q,
        category,
        city,
        country: apiCountry || undefined,
        verified,
        lat: coords?.lat,
        lng: coords?.lng,
        radius_km: coords ? radiusKm : undefined,
        page,
      })
      .then((r) => setResults(r))
      .finally(() => setLoading(false));
  }, [q, category, city, apiCountry, verified, coords, radiusKm, page]);

  // Keep the URL in sync with the active filters so the page is shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (apiCountry) params.set("country", apiCountry);
    if (verified) params.set("verified", "1");
    if (page > 1) params.set("page", String(page));
    if (locale === "en") params.set("locale", "en");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
  }, [q, category, city, apiCountry, verified, page, locale, router, pathname]);

  function clearFilters() {
    setQ("");
    setCategory("");
    setCity("");
    setVerified(false);
    setCoords(null);
    setCoordsError("");
    setPage(1);
  }

  async function requestLocation() {
    if (!("geolocation" in navigator)) {
      setCoordsError(t.geoUnsupported);
      return;
    }
    setRequestingLocation(true);
    setCoordsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setCity(""); // Clear city filter — "near me" replaces it
        setPage(1);
        setRequestingLocation(false);
      },
      (err) => {
        const msg = err.code === err.PERMISSION_DENIED ? t.geoDenied : t.geoFailed;
        setCoordsError(msg);
        setRequestingLocation(false);
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  }

  const hasFilters = q || category || city || verified || coords;

  return (
    <>
      <PublicHeader locale={locale} />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <HeroDecoration variant="warm" />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
            <p className="text-xs uppercase tracking-wider text-stone">
              {t.kicker}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mt-2 text-ink leading-[1.05]">
              {pageTitle}
            </h1>
            <p className="mt-3 text-base text-ink-muted max-w-2xl">
              {t.subtitle}
            </p>
            <div className="mt-6 max-w-xl">
              <Field
                label={t.search}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder={t.searchPlaceholder}
              />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="card p-5 space-y-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                  {t.nearMe}
                </div>
                {!coords ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={requestLocation}
                      disabled={requestingLocation}
                      className="mt-2 w-full"
                    >
                      {requestingLocation ? t.locating : t.useMyLocation}
                    </Button>
                    {coordsError && (
                      <p className="mt-2 text-xs text-danger">{coordsError}</p>
                    )}
                    <p className="mt-2 text-[11px] text-stone leading-snug">
                      {t.locationHint}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mt-2 text-xs text-emerald font-medium">
                      {t.locationActive}
                    </div>
                    <label className="mt-3 block">
                      <span className="text-[10px] uppercase tracking-wider text-stone">
                        {t.radius(radiusKm)}
                      </span>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={radiusKm}
                        onChange={(e) => {
                          setRadiusKm(Number(e.target.value));
                          setPage(1);
                        }}
                        className="w-full mt-1"
                      />
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCoords(null);
                        setPage(1);
                      }}
                      className="mt-1 text-danger"
                    >
                      {t.removeProximity}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <FilterGroup label={t.category}>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15"
              >
                <option value="">{t.all}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {locale === "en" ? c.name_en || c.name : c.name}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label={t.city}>
              <select
                value={city}
                onChange={(e) => {
                  const next = e.target.value;
                  setCity(next);
                  if (next && coords) {
                    setCoords(null);
                  }
                  setPage(1);
                }}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15"
              >
                <option value="">{t.all}</option>
                {cityOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </FilterGroup>

            <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => {
                  setVerified(e.target.checked);
                  setPage(1);
                }}
              />
              {t.verifiedOnly}
            </label>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t.clearFilters}
              </Button>
            )}
          </aside>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-stone numeric">
                {loading ? "…" : t.results(results?.count ?? 0)}
              </span>
              {coords && (
                <span className="text-xs text-stone">
                  {t.withinKm(radiusKm)}
                </span>
              )}
            </div>

            <div className="mt-4">
              <MapView
                pins={(results?.results ?? []).map<MapPin>((f) => ({
                  id: f.id,
                  name: f.full_name,
                  subtitle:
                    f.headline ||
                    (locale === "en"
                      ? f.categories[0]?.name_en || f.categories[0]?.name
                      : f.categories[0]?.name),
                  city: f.cities[0],
                }))}
                userCoords={coords}
                height={340}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results?.results.map((f) => (
                <FreelancerCard key={f.id} f={f} locale={locale} />
              ))}
            </div>

            {!loading && results?.results.length === 0 && (
              <div className="mt-8 card p-10 text-center">
                <p className="text-sm text-ink-muted">{t.emptyState}</p>
              </div>
            )}

            {results && (results.next || results.previous) && (
              <div className="mt-6 flex items-center justify-between text-sm">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!results.previous}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t.previous}
                </Button>
                <span className="text-stone numeric">{t.page(page)}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!results.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t.next}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <PublicFooter locale={locale} country={countryConfig} />
    </>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      {children}
    </div>
  );
}
