"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type MyJobListItem, type PaginatedResponse } from "@/lib/api";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";

export default function KlientJobsListPage() {
  const [data, setData] = useState<PaginatedResponse<MyJobListItem> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.myJobs({ page })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone">Paneli juaj</p>
          <h1 className="font-display text-3xl mt-1.5 text-ink">Kërkesat e mia</h1>
        </div>
        <Link href="/dashboard/klient/kerkesat/krijo">
          <Button variant="primary">+ Posto kërkesë</Button>
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Postoni një kërkesë, merrni oferta nga profesionistë, zgjidhni më të
        mirën.
      </p>

      <div className="mt-8 space-y-3">
        {loading && <div className="text-sm text-stone">Po ngarkohet…</div>}

        {!loading && data?.results.length === 0 && (
          <div className="rounded-lg border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-sm text-ink-muted">
              Ende nuk keni postuar asnjë kërkesë.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/klient/kerkesat/krijo">
                <Button variant="primary">Postoni të parën</Button>
              </Link>
            </div>
          </div>
        )}

        {data?.results.map((j) => (
          <Link
            key={j.id}
            href={`/dashboard/klient/kerkesat/${j.id}`}
            className="block rounded-lg border border-line bg-surface p-5 hover:border-forest/40 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-stone">
                    {j.category.name}
                  </span>
                  <StatusBadge status={j.status} />
                </div>
                <h3 className="mt-1 font-medium text-ink truncate">{j.title}</h3>
                <p className="mt-1 text-sm text-ink-muted line-clamp-2">
                  {j.description}
                </p>
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
                  year: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
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
  );
}
