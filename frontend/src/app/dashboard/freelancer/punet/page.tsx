"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  api,
  type Category,
  type OpenJobListItem,
  type PaginatedResponse,
} from "@/lib/api";
import { Field } from "@/components/Field";
import { Button } from "@/components/Button";

const ALBANIAN_CITIES = [
  "Tiranë", "Durrës", "Vlorë", "Elbasan", "Shkodër",
  "Fier", "Korçë", "Berat", "Sarandë",
];

export default function FreelancerOpenJobsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<PaginatedResponse<OpenJobListItem> | null>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [mineOnly, setMineOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.openJobs({ q, category, city, mine_only: mineOnly, page })
      .then(setData)
      .finally(() => setLoading(false));
  }, [q, category, city, mineOnly, page]);

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-stone">
        Paneli i profesionistit
      </p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">Punët e hapura</h1>
      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Shfletoni kërkesat e klientëve dhe dorëzoni një ofertë të
        personalizuar.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="space-y-5">
          <Field
            label="Kërko"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Fjalë kyçe…"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Kategoria
            </label>
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Qyteti
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15"
            >
              <option value="">Të gjitha</option>
              {ALBANIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-2 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={mineOnly}
              onChange={(e) => {
                setMineOnly(e.target.checked);
                setPage(1);
              }}
              className="mt-0.5"
            />
            <span>
              Vetëm punët që përshtaten me kategoritë &amp; zonat e mia
            </span>
          </label>
        </aside>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-stone numeric">
              {loading ? "…" : `${data?.count ?? 0} punë`}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {data?.results.map((j) => (
              <Link
                key={j.id}
                href={`/dashboard/freelancer/punet/${j.id}`}
                className="block rounded-lg border border-line bg-surface p-5 hover:border-forest/40 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-stone">
                      {j.category.name}
                    </div>
                    <h3 className="mt-0.5 font-medium text-ink truncate">
                      {j.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-stone">{j.city}</div>
                    <div className="mt-1 text-xs text-ink-muted">
                      <span className="numeric font-medium">{j.quote_count}</span>{" "}
                      oferta
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-stone">
                  <span className="numeric">
                    {j.budget_min || j.budget_max
                      ? `${j.budget_min ?? "?"} – ${j.budget_max ?? "?"} ${j.currency}`
                      : "Buxhet i hapur"}
                  </span>
                  <span className="numeric">
                    {new Date(j.created_at).toLocaleDateString("sq-AL", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </Link>
            ))}

            {!loading && data?.results.length === 0 && (
              <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center text-sm text-ink-muted">
                Asnjë punë e hapur që përshtatet. Provoni filtra të tjerë.
              </div>
            )}
          </div>

          {data && (data.next || data.previous) && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <Button
                variant="secondary"
                size="sm"
                disabled={!data.previous}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← E mëparshme
              </Button>
              <span className="text-stone numeric">Faqja {page}</span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!data.next}
                onClick={() => setPage((p) => p + 1)}
              >
                E ardhshme →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
