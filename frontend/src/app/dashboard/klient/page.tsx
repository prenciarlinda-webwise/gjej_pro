"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  api,
  type Category,
  type KlientProfile,
  type MyJobListItem,
  type ProfilePayload,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { StatusBadge } from "@/components/StatusBadge";

export default function KlientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfilePayload<KlientProfile> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentJobs, setRecentJobs] = useState<MyJobListItem[]>([]);

  useEffect(() => {
    api.myProfile<KlientProfile>().then(setData).catch(() => {});
    api.categories().then(setCategories).catch(() => {});
    api.myJobs({}).then((p) => setRecentJobs(p.results.slice(0, 4))).catch(() => {});
  }, []);

  const openCount = recentJobs.filter((j) => j.status === "open").length;
  const inProgressCount = recentJobs.filter((j) => j.status === "in_progress").length;

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-stone">Paneli juaj</p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">
        Mirë se erdhët, {user?.first_name}.
      </h1>
      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Postoni një kërkesë, merrni oferta nga profesionistë të verifikuar dhe
        zgjidhni më të mirën.
      </p>

      <div className="mt-6">
        <Link href="/dashboard/klient/kerkesat/krijo">
          <Button variant="primary" size="lg">
            + Posto një kërkesë
          </Button>
        </Link>
      </div>

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-lg border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl text-ink">Kërkesat tuaja</h2>
            <Link
              href="/dashboard/klient/kerkesat"
              className="text-xs font-medium text-forest hover:underline"
            >
              Shih të gjitha →
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-6 text-sm">
            <span className="text-stone">
              <span className="text-ink font-medium numeric">{openCount}</span>{" "}
              të hapura
            </span>
            <span className="text-stone">
              <span className="text-ink font-medium numeric">{inProgressCount}</span>{" "}
              në proces
            </span>
          </div>

          {recentJobs.length === 0 ? (
            <div className="mt-5 rounded-md border border-dashed border-line bg-bg p-6 text-center text-sm text-ink-muted">
              Ende pa kërkesa.{" "}
              <Link
                href="/dashboard/klient/kerkesat/krijo"
                className="text-forest font-medium hover:underline"
              >
                Postoni të parën.
              </Link>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-line">
              {recentJobs.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/dashboard/klient/kerkesat/${j.id}`}
                    className="flex items-start justify-between gap-3 py-3 hover:bg-surface-2 -mx-2 px-2 rounded-md transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-stone">
                          {j.category.name}
                        </span>
                        <StatusBadge status={j.status} />
                      </div>
                      <div className="mt-0.5 font-medium text-ink truncate">
                        {j.title}
                      </div>
                    </div>
                    <div className="shrink-0 text-right text-xs text-stone">
                      <div className="numeric font-medium text-ink">
                        {j.quote_count} oferta
                      </div>
                      <div className="numeric mt-0.5">{j.city}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-display text-xl text-ink">Veprime</h2>
          <ul className="mt-4 space-y-1">
            <ActionLink
              href="/dashboard/klient/kerkesat/krijo"
              title="Posto një kërkesë"
              subtitle="Përshkruani punën, merrni oferta"
            />
            <ActionLink
              href="/profesionistet"
              title="Kërkoni profesionistë"
              subtitle="Filtrim sipas kategorisë & zonës"
            />
            <ActionLink
              href="/dashboard/klient/mesazhet"
              title="Mesazhet"
              subtitle="Bisedat tuaja me profesionistët"
            />
            <ActionLink
              href="/dashboard/klient/profili"
              title="Profili juaj"
              subtitle={
                data
                  ? `Plotësueshmëria ${Math.round(data.completion * 100)}%`
                  : "—"
              }
            />
          </ul>
          {data && data.completion < 1 && (
            <div className="mt-5 pt-5 border-t border-line">
              <ProgressBar value={data.completion} label="Plotësueshmëria" />
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl text-ink">Kategoritë e shërbimeve</h2>
          <Link
            href="/profesionistet"
            className="text-xs font-medium text-forest hover:underline"
          >
            Shfleto të gjitha →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line rounded-lg overflow-hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/profesionistet?category=${c.slug}`}
              className="bg-surface px-4 py-4 hover:bg-surface-2 transition"
              title={c.name_en}
            >
              <div className="text-xs text-stone uppercase tracking-wider numeric">
                {String(c.sort_order).padStart(3, "0")}
              </div>
              <div className="mt-1 text-sm font-medium text-ink leading-tight">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ActionLink({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block px-3 py-2 -mx-3 rounded-md hover:bg-surface-2 transition"
      >
        <div className="text-sm text-ink font-medium">{title}</div>
        <div className="text-xs text-stone mt-0.5">{subtitle}</div>
      </Link>
    </li>
  );
}
