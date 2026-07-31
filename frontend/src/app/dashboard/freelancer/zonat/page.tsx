"use client";

import { useEffect, useState } from "react";
import { api, ApiError, type ServiceArea } from "@/lib/api";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { US_CITIES, UK_CITIES } from "@/lib/countries";

const ALBANIAN_CITIES = [
  "Tiranë", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Fier", "Korçë",
  "Berat", "Lushnjë", "Pogradec", "Kavajë", "Lezhë", "Sarandë", "Kukës",
  "Gjirokastër", "Patos", "Krujë", "Kuçovë",
];

const COUNTRY_OPTIONS: Array<{ code: string; label: string; quickCities: string[] }> = [
  { code: "AL", label: "Shqipëri", quickCities: ALBANIAN_CITIES },
  { code: "US", label: "SHBA", quickCities: US_CITIES.map((c) => c.name) },
  { code: "GB", label: "Mbretëria e Bashkuar", quickCities: UK_CITIES.map((c) => c.name) },
];

function countryLabel(code: string): string {
  return COUNTRY_OPTIONS.find((c) => c.code === code)?.label ?? code;
}

export default function FreelancerAreasPage() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("AL");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const a = await api.myServiceAreas();
    setAreas(a);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.createServiceArea({
        city: city.trim(),
        region: region.trim(),
        country,
      });
      setCity("");
      setRegion("");
      void refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gabim.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function onRemove(id: number) {
    await api.deleteServiceArea(id);
    void refresh();
  }

  function quickAdd(c: string) {
    setCity(c);
  }

  if (loading) return <div className="text-stone">Po ngarkohet…</div>;

  const existingAreaKeys = new Set(areas.map((a) => `${a.country}:${a.city}`));
  const quickCities =
    COUNTRY_OPTIONS.find((c) => c.code === country)?.quickCities ?? [];

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-stone">
        Paneli i profesionistit
      </p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">Zonat e punës</h1>
      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Shtoni qytetet ku ofroni shërbimet tuaja. Klientët do t&apos;ju gjejnë
        kur kërkojnë në këto zona.
      </p>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-lg border border-line bg-surface p-5">
          <h2 className="font-display text-xl text-ink">Zonat aktuale</h2>
          {areas.length === 0 ? (
            <p className="mt-3 text-sm text-stone">
              Ende nuk keni shtuar asnjë qytet.
            </p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {areas.map((a) => (
                <li
                  key={a.id}
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-2 pl-3 pr-1.5 py-1 text-sm"
                >
                  <span className="font-medium text-ink">{a.city}</span>
                  {a.region && a.region !== a.city && (
                    <span className="text-xs text-stone">· {a.region}</span>
                  )}
                  {a.country !== "AL" && (
                    <span className="text-[10px] uppercase tracking-wider text-forest bg-forest/10 rounded-full px-1.5 py-0.5">
                      {countryLabel(a.country)}
                    </span>
                  )}
                  <button
                    onClick={() => onRemove(a.id)}
                    aria-label={`Hiq ${a.city}`}
                    className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded text-stone hover:text-danger hover:bg-danger/10"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={onAdd} className="mt-6 pt-5 border-t border-line space-y-3">
            <div className="text-xs font-medium uppercase tracking-wider text-stone">
              Shto qytet
            </div>
            {error && (
              <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                Vendi
              </span>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Qyteti"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={country === "AL" ? "p.sh. Tiranë" : "p.sh. " + (quickCities[0] ?? "")}
                required
              />
              <Field
                label="Qarku (opsionale)"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="p.sh. Tiranë"
              />
            </div>
            <Button type="submit" variant="primary" disabled={submitting || !city.trim()}>
              {submitting ? "..." : "Shto"}
            </Button>
          </form>
        </div>

        <aside className="rounded-lg border border-line bg-surface p-5">
          <h3 className="text-xs font-medium uppercase tracking-wider text-stone">
            Qytete të zakonshme
          </h3>
          <p className="mt-1 text-xs text-stone">
            Klikoni për të prefilluar formën.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {quickCities.map((c) => (
              <button
                key={c}
                onClick={() => quickAdd(c)}
                disabled={existingAreaKeys.has(`${country}:${c}`)}
                className={[
                  "text-xs rounded-md px-2 py-1 border transition",
                  existingAreaKeys.has(`${country}:${c}`)
                    ? "border-line bg-surface-2 text-stone line-through opacity-60 cursor-not-allowed"
                    : "border-line bg-surface text-ink hover:border-forest hover:bg-surface-2",
                ].join(" ")}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
