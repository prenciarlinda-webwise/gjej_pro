"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  api,
  ApiError,
  type MyQuote,
  type OpenJobDetail,
} from "@/lib/api";
import { Button } from "@/components/Button";
import { Field, TextareaField } from "@/components/Field";
import { RateWarningBanner } from "@/components/RateWarningBanner";
import { StatusBadge } from "@/components/StatusBadge";
import { isBelowMarket, useRateBenchmark } from "@/lib/use-rate-benchmark";

export default function OpenJobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [job, setJob] = useState<OpenJobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const j = await api.getOpenJob(id);
      setJob(j);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Puna nuk u gjet.";
      setError(msg);
    }
  }

  useEffect(() => {
    if (!id) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div>
        <h1 className="font-display text-2xl text-ink">Nuk u gjet</h1>
        <p className="mt-2 text-stone">{error}</p>
        <Link href="/dashboard/freelancer/punet" className="mt-4 inline-block">
          <Button variant="primary">← Kthehu</Button>
        </Link>
      </div>
    );
  }

  if (!job) return <div className="text-stone">Po ngarkohet…</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      <div>
        <Link
          href="/dashboard/freelancer/punet"
          className="text-xs text-stone hover:text-ink"
        >
          ← Të gjitha punët
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-stone">
            {job.category.name}
          </span>
          <StatusBadge status={job.status} />
          <span className="text-xs text-stone numeric">
            · {job.quote_count} oferta
          </span>
        </div>
        <h1 className="font-display text-3xl mt-1.5 text-ink">{job.title}</h1>
        <div className="mt-2 text-sm text-ink-muted">
          <span>{job.city}</span>
          {job.address && <span className="text-stone"> · {job.address}</span>}
        </div>

        <section className="mt-6 rounded-lg border border-line bg-surface p-5">
          <h3 className="text-xs font-medium uppercase tracking-wider text-stone">
            Përshkrimi
          </h3>
          <p className="mt-3 text-sm text-ink whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
          {(job.budget_min || job.budget_max) && (
            <div className="mt-4 pt-4 border-t border-line text-sm">
              <span className="text-xs uppercase tracking-wider text-stone">
                Buxheti
              </span>
              <span className="ml-2 text-ink numeric font-medium">
                {job.budget_min ?? "?"} – {job.budget_max ?? "?"} {job.currency}
              </span>
            </div>
          )}
          <div className="mt-2 text-xs text-stone numeric">
            Postuar nga {job.customer_name} ·{" "}
            {new Date(job.created_at).toLocaleDateString("sq-AL", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </div>
          {job.my_quote && (
            <div className="mt-4 pt-4 border-t border-line">
              <Link
                href={`/dashboard/freelancer/mesazhet?peer=${job.customer_id}`}
              >
                <Button variant="secondary" size="sm">
                  Mesazh klientit
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>

      <aside>
        <QuotePanel
          job={job}
          existing={job.my_quote}
          onChange={refresh}
        />
      </aside>
    </div>
  );
}

function QuotePanel({
  job,
  existing,
  onChange,
}: {
  job: OpenJobDetail;
  existing: MyQuote | null;
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(!existing);
  const [price, setPrice] = useState(existing?.price ?? "");
  const [currency, setCurrency] = useState(
    existing?.currency ?? job.currency ?? "ALL",
  );
  const [message, setMessage] = useState(existing?.message ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { benchmark } = useRateBenchmark({
    category: job.category.slug,
    city: job.city,
    currency,
  });
  const showRateWarning = isBelowMarket(price, benchmark);

  // Sync local state when the underlying quote changes (e.g. status update).
  useEffect(() => {
    if (existing) {
      setPrice(existing.price);
      setCurrency(existing.currency);
      setMessage(existing.message);
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [existing?.id, existing?.price, existing?.message, existing?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (job.status !== "open") {
    return (
      <div className="rounded-lg border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wider text-stone">
          Statusi i punës
        </p>
        <p className="mt-2 text-sm text-ink">
          Kjo punë nuk është më e hapur për oferta të reja.
        </p>
        {existing && (
          <div className="mt-4 pt-4 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone">
                Oferta juaj
              </span>
              <StatusBadge status={existing.status} />
            </div>
            <div className="mt-2 text-lg font-medium text-ink numeric">
              {existing.price} {existing.currency}
            </div>
            <p className="mt-2 text-sm text-ink whitespace-pre-line">
              {existing.message}
            </p>
          </div>
        )}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const body = {
        price,
        currency,
        message,
      };
      if (existing) {
        await api.updateQuote(existing.id, body);
      } else {
        await api.submitQuote(job.id, body);
      }
      onChange();
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiError) {
        const fe: Record<string, string> = {};
        for (const [k, v] of Object.entries(err.fields)) fe[k] = v[0] ?? "";
        if (!Object.keys(fe).length) fe.detail = err.message;
        setErrors(fe);
      } else {
        setErrors({ detail: "Diçka shkoi keq." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onWithdraw() {
    if (!existing) return;
    if (!confirm("Të tërhiqni ofertën tuaj?")) return;
    setSubmitting(true);
    try {
      await api.withdrawQuote(existing.id);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  // View existing quote (not editing)
  if (existing && !editing) {
    return (
      <div className="rounded-lg border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-stone">
            Oferta juaj
          </span>
          <StatusBadge status={existing.status} />
        </div>
        <div className="mt-3 text-2xl font-medium text-ink numeric">
          {existing.price} {existing.currency}
        </div>
        <p className="mt-3 text-sm text-ink whitespace-pre-line leading-relaxed">
          {existing.message}
        </p>

        {existing.status === "pending" && (
          <div className="mt-4 pt-4 border-t border-line flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Redakto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onWithdraw}
              disabled={submitting}
              className="text-danger"
            >
              Tërhiq
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Form (new or editing)
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-forest/30 bg-surface p-5 space-y-4"
    >
      <div className="text-xs uppercase tracking-wider text-forest font-medium">
        {existing ? "Redakto ofertën" : "Dorëzoni ofertën tuaj"}
      </div>

      {errors.detail && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {errors.detail}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Field
          label="Çmimi"
          type="number"
          step="0.01"
          value={String(price)}
          onChange={(e) => setPrice(e.target.value)}
          required
          error={errors.price}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Monedha
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15"
          >
            {["ALL", "EUR", "USD", "GBP"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {showRateWarning && <RateWarningBanner />}

      <TextareaField
        label="Mesazhi"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="Pse jeni i përshtatshmi për këtë punë? Sa kohë do t'ju duhet?"
        required
        error={errors.message}
      />

      <div className="flex items-center gap-2 pt-2 border-t border-line">
        <Button type="submit" variant="primary" size="sm" disabled={submitting}>
          {submitting ? "..." : existing ? "Ruaj" : "Dorëzo ofertën"}
        </Button>
        {existing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
          >
            Anulo
          </Button>
        )}
      </div>
    </form>
  );
}
