"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  api,
  type NotificationItem,
  type NotificationKind,
  type PaginatedResponse,
} from "@/lib/api";
import { useNotifications } from "@/lib/notifications-context";
import { Button } from "@/components/Button";

const KIND_LABEL: Record<NotificationKind, string> = {
  quote_received: "Ofertë",
  quote_accepted: "Pranim",
  quote_rejected: "Refuzim",
  message_received: "Mesazh",
  review_received: "Vlerësim",
  job_completed: "Përfundim",
  job_cancelled: "Anulim",
};

export function NotificationsList() {
  const [data, setData] = useState<PaginatedResponse<NotificationItem> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { refresh, markOne, markAll } = useNotifications();

  async function load(p: number) {
    setLoading(true);
    try {
      const d = await api.notifications(p);
      setData(d);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(page);
  }, [page]);

  async function onItemClick(n: NotificationItem) {
    if (!n.read_at) {
      await markOne(n.id);
      // Update local list so the row visually updates
      setData((d) =>
        d
          ? {
              ...d,
              results: d.results.map((r) =>
                r.id === n.id ? { ...r, read_at: new Date().toISOString() } : r,
              ),
            }
          : d,
      );
    }
  }

  async function onMarkAll() {
    await markAll();
    setData((d) =>
      d
        ? {
            ...d,
            results: d.results.map((r) => ({
              ...r,
              read_at: r.read_at ?? new Date().toISOString(),
            })),
          }
        : d,
    );
    void refresh();
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone">Paneli juaj</p>
          <h1 className="font-display text-3xl mt-1.5 text-ink">Njoftimet</h1>
        </div>
        {data && data.results.some((n) => !n.read_at) && (
          <Button variant="ghost" size="sm" onClick={onMarkAll}>
            Shëno të gjitha si të lexuara
          </Button>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface overflow-hidden">
        {loading && !data && (
          <div className="px-5 py-8 text-sm text-stone">Po ngarkohet…</div>
        )}

        {!loading && data?.results.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-ink-muted">
            Asnjë njoftim ende.
          </div>
        )}

        <ul>
          {data?.results.map((n) => (
            <li key={n.id} className="border-b border-line last:border-b-0">
              <Link
                href={n.link || "#"}
                onClick={() => void onItemClick(n)}
                className={[
                  "block px-5 py-4 hover:bg-surface-2 transition relative",
                  !n.read_at ? "bg-forest/[0.03]" : "",
                ].join(" ")}
              >
                {!n.read_at && (
                  <span className="absolute left-2 top-6 w-1.5 h-1.5 rounded-full bg-forest" />
                )}
                <div className="flex items-start justify-between gap-3 ml-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-stone">
                        {KIND_LABEL[n.kind] ?? n.kind}
                      </span>
                    </div>
                    <h3
                      className={[
                        "mt-0.5 truncate",
                        n.read_at ? "text-ink-muted" : "text-ink font-medium",
                      ].join(" ")}
                    >
                      {n.title}
                    </h3>
                    {n.body && (
                      <p className="mt-1 text-sm text-stone line-clamp-2">
                        {n.body}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-stone numeric shrink-0">
                    {formatTime(n.created_at)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {data && (data.next || data.previous) && (
        <div className="mt-4 flex items-center justify-between text-sm">
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

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("sq-AL", {
      hour: "2-digit", minute: "2-digit",
    });
  }
  return d.toLocaleDateString("sq-AL", {
    day: "2-digit", month: "short",
  });
}
