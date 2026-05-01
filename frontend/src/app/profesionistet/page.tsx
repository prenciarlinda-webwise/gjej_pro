"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  api,
  type Category,
  type FreelancerListItem,
  type PaginatedResponse,
} from "@/lib/api";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { FreelancerCard } from "@/components/FreelancerCard";
import { Field } from "@/components/Field";
import { Button } from "@/components/Button";
import { HeroDecoration } from "@/components/HeroDecoration";
import { MapView, type MapPin } from "@/components/MapView";

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

interface Coords {
  lat: number;
  lng: number;
}

export default function FreelancerBrowsePage() {
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
        verified,
        lat: coords?.lat,
        lng: coords?.lng,
        radius_km: coords ? radiusKm : undefined,
        page,
      })
      .then((r) => setResults(r))
      .finally(() => setLoading(false));
  }, [q, category, city, verified, coords, radiusKm, page]);

  // Keep the URL in sync with the active filters so the page is shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (verified) params.set("verified", "1");
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
  }, [q, category, city, verified, page, router, pathname]);

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
      setCoordsError("Shfletuesi nuk mbështet vendndodhjen.");
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
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Lejimi i vendndodhjes u mohua."
            : "Nuk arritëm të lexojmë vendndodhjen tuaj.";
        setCoordsError(msg);
        setRequestingLocation(false);
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  }

  const hasFilters = q || category || city || verified || coords;

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <HeroDecoration variant="warm" />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
            <p className="text-xs uppercase tracking-wider text-stone">
              Profesionistët
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mt-2 text-ink leading-[1.05]">
              Profesionistë në Shqipëri
            </h1>
            <p className="mt-3 text-base text-ink-muted max-w-2xl">
              Filtroni sipas kategorisë, qytetit, vlerësimit, ose gjeni
              profesionistë pranë vendndodhjes suaj.
            </p>
            <div className="mt-6 max-w-xl">
              <Field
                label="Kërko"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Emër, kategori, fjalë kyçe…"
              />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="card p-5 space-y-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                  Pranë meje
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
                      {requestingLocation ? "Po lexohet…" : "📍 Përdor vendndodhjen time"}
                    </Button>
                    {coordsError && (
                      <p className="mt-2 text-xs text-danger">{coordsError}</p>
                    )}
                    <p className="mt-2 text-[11px] text-stone leading-snug">
                      Shfletuesi do të kërkojë leje për të ndarë vendndodhjen.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mt-2 text-xs text-emerald font-medium">
                      ✓ Vendndodhja aktive
                    </div>
                    <label className="mt-3 block">
                      <span className="text-[10px] uppercase tracking-wider text-stone">
                        Rrezja: {radiusKm} km
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
                      Hiqe filtrin e afërsisë
                    </Button>
                  </>
                )}
              </div>
            </div>

            <FilterGroup label="Kategoria">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15"
              >
                <option value="">Të gjitha</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Qyteti">
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
                <option value="">Të gjitha</option>
                {ALBANIAN_CITIES.map((c) => (
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
              Vetëm të verifikuar
            </label>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Pastro filtrat
              </Button>
            )}
          </aside>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-stone numeric">
                {loading ? "…" : `${results?.count ?? 0} rezultate`}
              </span>
              {coords && (
                <span className="text-xs text-stone">
                  Brenda {radiusKm} km nga ju
                </span>
              )}
            </div>

            <div className="mt-4">
              <MapView
                pins={(results?.results ?? []).map<MapPin>((f) => ({
                  id: f.id,
                  name: f.full_name,
                  subtitle: f.headline || f.categories[0]?.name,
                  city: f.cities[0],
                }))}
                userCoords={coords}
                height={340}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results?.results.map((f) => (
                <FreelancerCard key={f.id} f={f} />
              ))}
            </div>

            {!loading && results?.results.length === 0 && (
              <div className="mt-8 card p-10 text-center">
                <p className="text-sm text-ink-muted">
                  Asnjë profesionist nuk u gjet. Provoni filtra të tjerë ose
                  rritni rrezen e kërkimit.
                </p>
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
                  ← E mëparshme
                </Button>
                <span className="text-stone numeric">Faqja {page}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!results.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  E ardhshme →
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <PublicFooter />
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
