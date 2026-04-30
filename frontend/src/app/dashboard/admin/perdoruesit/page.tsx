"use client";

import { useEffect, useState } from "react";
import {
  api,
  type PaginatedResponse,
  type Role,
  type User,
} from "@/lib/api";
import { Field } from "@/components/Field";
import { Button } from "@/components/Button";

const ROLE_OPTIONS: Array<{ value: Role | ""; label: string }> = [
  { value: "", label: "Të gjithë" },
  { value: "klient", label: "Klient" },
  { value: "freelancer", label: "Profesionist" },
  { value: "admin", label: "Administrator" },
];

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  freelancer: "Profesionist",
  klient: "Klient",
};

export default function AdminUsersPage() {
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .adminUsers({ q, role: role || undefined, page })
      .then(setData)
      .finally(() => setLoading(false));
  }, [q, role, page]);

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-stone">
        Paneli i administratorit
      </p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">Përdoruesit</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Lista e të gjithë përdoruesve të platformës.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
        <Field
          label="Kërko"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Email, emër, telefon…"
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Roli
          </label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as Role | "");
              setPage(1);
            }}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15 focus:border-forest"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-stone numeric">
            {loading ? "Po ngarkohet…" : `${data?.count ?? 0} përdorues`}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-stone">
            <tr>
              <Th>Emri</Th>
              <Th>Email</Th>
              <Th>Roli</Th>
              <Th>Verifikuar</Th>
              <Th>Anëtar që</Th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <Td>
                  <div className="font-medium text-ink">{u.full_name || "—"}</div>
                  {u.phone && (
                    <div className="text-xs text-stone numeric">{u.phone}</div>
                  )}
                </Td>
                <Td className="text-ink-muted">{u.email}</Td>
                <Td>
                  <span className="inline-block rounded border border-line bg-surface-2 px-2 py-0.5 text-xs text-forest font-medium">
                    {ROLE_LABEL[u.role]}
                  </span>
                </Td>
                <Td>
                  {u.is_email_verified ? (
                    <span className="text-xs text-success font-medium">✓</span>
                  ) : (
                    <span className="text-xs text-stone">—</span>
                  )}
                </Td>
                <Td className="text-stone numeric">
                  {new Date(u.date_joined).toLocaleDateString("sq-AL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Td>
              </tr>
            ))}
            {!loading && data?.results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-stone">
                  Asnjë rezultat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-medium text-xs uppercase tracking-wide">
      {children}
    </th>
  );
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
