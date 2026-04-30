"use client";

import { useEffect, useState } from "react";
import { api, type AdminStats } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.adminStats()
      .then(setStats)
      .catch((e) => setError(e?.message ?? "Gabim gjatë ngarkimit."));
  }, []);

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.18em] text-forest/80">
        Paneli i administratorit
      </p>
      <h1 className="font-display text-4xl mt-2 text-ink">
        Mirë se erdhët, {user?.first_name}.
      </h1>
      <p className="mt-2 text-stone">
        Vështrim i përgjithshëm i platformës Gjej Pro.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Përdorues gjithsej" value={stats?.totals.all_users} highlight />
        <StatCard label="Profesionistë" value={stats?.totals.freelancers} />
        <StatCard label="Klientë" value={stats?.totals.klients} />
        <StatCard label="Administratorë" value={stats?.totals.admins} />
      </section>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Regjistrime sot" value={stats?.signups.today} small />
        <StatCard
          label="Regjistrime / 7 ditët e fundit"
          value={stats?.signups.last_7_days}
          small
        />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Regjistrimet më të fundit</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-stone">
              <tr>
                <Th>Emri</Th>
                <Th>Email</Th>
                <Th>Roli</Th>
                <Th>Data</Th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <Td className="font-medium">{u.full_name}</Td>
                  <Td className="text-stone">{u.email}</Td>
                  <Td>
                    <span className="inline-block rounded border border-line bg-surface-2 px-2 py-0.5 text-xs text-forest font-medium">
                      {u.role}
                    </span>
                  </Td>
                  <Td className="text-stone">
                    {new Date(u.date_joined).toLocaleDateString("sq-AL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Td>
                </tr>
              ))}
              {!stats && (
                <tr>
                  <Td className="text-stone">Po ngarkohet…</Td>
                  <Td>—</Td>
                  <Td>—</Td>
                  <Td>—</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
  small,
}: {
  label: string;
  value: number | undefined;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-white px-5 py-4",
        highlight ? "border-forest/30 bg-forest/[0.03]" : "border-line",
      ].join(" ")}
    >
      <div className="text-xs text-stone uppercase tracking-wide">{label}</div>
      <div
        className={[
          "mt-2 font-display text-ink",
          small ? "text-2xl" : "text-4xl",
          highlight ? "text-forest" : "",
        ].join(" ")}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">{children}</th>;
}
function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
