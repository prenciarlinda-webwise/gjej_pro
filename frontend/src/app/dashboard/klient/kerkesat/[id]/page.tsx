"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  api,
  ApiError,
  type MyJobDetail,
  type QuoteOnJob,
} from "@/lib/api";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { StarRating, ReadOnlyStars } from "@/components/StarRating";
import { TextareaField } from "@/components/Field";

export default function KlientJobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [job, setJob] = useState<MyJobDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const j = await api.getMyJob(id);
      setJob(j);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Kërkesa nuk u gjet.";
      setError(msg);
    }
  }

  useEffect(() => {
    if (!id) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onAccept(quoteId: number) {
    if (!confirm("Të pranojmë këtë ofertë? Ofertat e tjera do të refuzohen.")) return;
    setBusy(true);
    try {
      const updated = await api.acceptQuote(id, quoteId);
      setJob(updated);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gabim.";
      alert(msg);
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    if (!confirm("Të anulojmë këtë kërkesë?")) return;
    setBusy(true);
    try {
      const updated = await api.cancelJob(id);
      setJob(updated);
    } finally {
      setBusy(false);
    }
  }

  async function onComplete() {
    if (!confirm("Ta shënoni si të përfunduar?")) return;
    setBusy(true);
    try {
      const updated = await api.completeJob(id);
      setJob(updated);
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display text-2xl text-ink">Nuk u gjet</h1>
        <p className="mt-2 text-stone">{error}</p>
        <Link href="/dashboard/klient/kerkesat" className="mt-4 inline-block">
          <Button variant="primary">← Kthehu</Button>
        </Link>
      </div>
    );
  }

  if (!job) return <div className="text-stone">Po ngarkohet…</div>;

  const sortedQuotes = [...job.quotes].sort((a, b) => {
    const order: Record<string, number> = {
      accepted: 0, pending: 1, rejected: 2, withdrawn: 3,
    };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div>
        <Link
          href="/dashboard/klient/kerkesat"
          className="text-xs text-stone hover:text-ink"
        >
          ← Të gjitha kërkesat
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-stone">
            {job.category.name}
          </span>
          <StatusBadge status={job.status} />
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
        </section>

        {(job.can_review || job.my_review) && (
          <section className="mt-8">
            <h2 className="font-display text-xl text-ink">Vlerësimi juaj</h2>
            {job.my_review ? (
              <div className="mt-4 rounded-lg border border-line bg-surface p-5">
                <div className="flex items-center gap-3">
                  <ReadOnlyStars rating={job.my_review.rating} size={18} />
                  <span className="text-sm text-stone numeric">
                    {new Date(job.my_review.created_at).toLocaleDateString("sq-AL", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                {job.my_review.comment && (
                  <p className="mt-3 text-sm text-ink whitespace-pre-line leading-relaxed">
                    {job.my_review.comment}
                  </p>
                )}
              </div>
            ) : (
              <ReviewForm
                jobId={job.id}
                onPosted={() => void refresh()}
              />
            )}
          </section>
        )}

        <section className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl text-ink">
              Ofertat ({job.quote_count})
            </h2>
          </div>

          {sortedQuotes.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
              Ende pa oferta. Profesionistët do të dorëzojnë ofertat këtu.
            </div>
          )}

          <div className="mt-4 space-y-3">
            {sortedQuotes.map((q) => (
              <QuoteCard
                key={q.id}
                quote={q}
                jobIsOpen={job.status === "open"}
                onAccept={() => onAccept(q.id)}
                disabled={busy}
              />
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-3">
        {job.status === "open" && (
          <Button
            variant="secondary"
            fullWidth
            disabled={busy}
            onClick={onCancel}
            className="text-danger"
          >
            Anulo kërkesën
          </Button>
        )}
        {job.status === "in_progress" && (
          <Button
            variant="primary"
            fullWidth
            disabled={busy}
            onClick={onComplete}
          >
            Shëno si të përfunduar
          </Button>
        )}
        <div className="rounded-lg border border-line bg-surface p-4 text-xs text-stone">
          <div className="numeric">
            Krijuar:{" "}
            {new Date(job.created_at).toLocaleDateString("sq-AL", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="numeric mt-1">
            Përditësuar:{" "}
            {new Date(job.updated_at).toLocaleDateString("sq-AL", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

function ReviewForm({
  jobId,
  onPosted,
}: {
  jobId: number;
  onPosted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Zgjidhni një vlerësim me yje.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.postReview({ job_id: jobId, rating, comment: comment.trim() });
      onPosted();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gabim.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 rounded-lg border border-forest/30 bg-surface p-5 space-y-4"
    >
      <p className="text-sm text-ink-muted">
        Sa të kënaqur ishit me punën? Vlerësimi juaj ndihmon klientët e tjerë.
      </p>

      <div className="flex items-center gap-3">
        <StarRating value={rating} onChange={setRating} size={28} />
        <span className="text-sm text-stone numeric">
          {rating > 0 ? `${rating} / 5` : "—"}
        </span>
      </div>

      <TextareaField
        label="Komenti (opsionale)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Çfarë funksionoi mirë? Çfarë mund të përmirësohet?"
      />

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" disabled={submitting || rating < 1}>
        {submitting ? "Po dërgohet…" : "Dërgo vlerësimin"}
      </Button>
    </form>
  );
}

function QuoteCard({
  quote,
  jobIsOpen,
  onAccept,
  disabled,
}: {
  quote: QuoteOnJob;
  jobIsOpen: boolean;
  onAccept: () => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-surface p-5 ${
        quote.status === "accepted" ? "border-forest/40" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/profesionist/${quote.freelancer_slug}`}
              className="font-medium text-ink hover:underline"
            >
              {quote.freelancer_name}
            </Link>
            {quote.freelancer_is_verified && (
              <span
                className="text-[10px] uppercase tracking-wider text-gold border border-gold/40 bg-gold/10 rounded px-1.5 py-0.5"
                title="I verifikuar"
              >
                ✓ Verifikuar
              </span>
            )}
            <StatusBadge status={quote.status} />
          </div>
          {quote.freelancer_headline && (
            <p className="mt-0.5 text-xs text-stone">
              {quote.freelancer_headline}
            </p>
          )}
          {quote.freelancer_review_count > 0 && (
            <p className="mt-1 text-xs text-stone numeric">
              ★ {quote.freelancer_avg_rating} · {quote.freelancer_review_count}{" "}
              vlerësime
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-medium text-ink numeric">
            {quote.price} {quote.currency}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-ink leading-relaxed whitespace-pre-line">
        {quote.message}
      </p>

      <div className="mt-4 pt-4 border-t border-line flex items-center gap-2 flex-wrap">
        {jobIsOpen && quote.status === "pending" && (
          <Button
            variant="primary"
            size="sm"
            onClick={onAccept}
            disabled={disabled}
          >
            Prano këtë ofertë
          </Button>
        )}
        <Link href={`/dashboard/klient/mesazhet?peer=${quote.freelancer_id}`}>
          <Button variant="secondary" size="sm">
            Mesazh
          </Button>
        </Link>
        <Link href={`/profesionist/${quote.freelancer_slug}`}>
          <Button variant="ghost" size="sm">Shih profilin</Button>
        </Link>
      </div>
    </div>
  );
}
