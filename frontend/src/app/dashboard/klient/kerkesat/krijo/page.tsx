"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError, type Category } from "@/lib/api";
import { Button } from "@/components/Button";
import { Field, TextareaField } from "@/components/Field";
import { RateWarningBanner } from "@/components/RateWarningBanner";
import { isBelowMarket, useRateBenchmark } from "@/lib/use-rate-benchmark";

const CURRENCIES = ["ALL", "EUR", "USD", "GBP"];

export default function CreateJobPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: 0,
    city: "",
    address: "",
    budget_min: "",
    budget_max: "",
    currency: "ALL",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.categories().then((cs) => {
      setCategories(cs);
      if (cs.length && !form.category_id) {
        setForm((f) => ({ ...f, category_id: cs[0].id }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefill city from klient profile if available
  useEffect(() => {
    api.myProfile<{ city?: string }>()
      .then((p) => {
        if (p.profile?.city && !form.city) {
          setForm((f) => ({ ...f, city: p.profile.city! }));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const selectedCategory = categories.find((c) => c.id === form.category_id);
  const { benchmark } = useRateBenchmark({
    category: selectedCategory?.slug,
    city: form.city.trim() || undefined,
    currency: form.currency,
  });
  const showRateWarning = isBelowMarket(
    form.budget_max || form.budget_min,
    benchmark,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const body = {
        title: form.title.trim(),
        description: form.description,
        category_id: Number(form.category_id),
        city: form.city.trim(),
        address: form.address,
        currency: form.currency,
        budget_min: form.budget_min || null,
        budget_max: form.budget_max || null,
      };
      const job = await api.createJob(body);
      router.push(`/dashboard/klient/kerkesat/${job.id}`);
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

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/klient/kerkesat"
        className="text-xs text-stone hover:text-ink"
      >
        ← Të gjitha kërkesat
      </Link>
      <p className="mt-3 text-xs uppercase tracking-wider text-stone">
        Paneli juaj
      </p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">Postoni një kërkesë</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Sa më të qartë detajet, aq më të mira ofertat që merrni.
      </p>

      {errors.detail && (
        <div className="mt-6 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {errors.detail}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Field
          label="Titulli i shkurtër"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="p.sh. Rrjedhje uji në kuzhinë"
          required
          error={errors.title}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Kategoria
          </label>
          <select
            value={form.category_id}
            onChange={(e) => update("category_id", Number(e.target.value))}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15 focus:border-forest"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <TextareaField
          label="Përshkrimi i punës"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Përshkruani çfarë nevojitet, kur, dhe çdo detaj që mund të ndihmojë profesionistët të ofertojnë saktë."
          rows={6}
          required
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Qyteti"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="p.sh. Tiranë"
            required
            error={errors.city}
          />
          <Field
            label="Adresa (opsionale)"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Rruga, numri"
            error={errors.address}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Field
            label="Buxheti min"
            type="number"
            step="0.01"
            value={form.budget_min}
            onChange={(e) => update("budget_min", e.target.value)}
            error={errors.budget_min}
          />
          <Field
            label="Buxheti max"
            type="number"
            step="0.01"
            value={form.budget_max}
            onChange={(e) => update("budget_max", e.target.value)}
            error={errors.budget_max}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Monedha
            </label>
            <select
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15 focus:border-forest"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {showRateWarning && <RateWarningBanner />}

        <div className="flex items-center gap-3 pt-3 border-t border-line">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Po postohet…" : "Posto kërkesën"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard/klient/kerkesat")}
          >
            Anulo
          </Button>
        </div>
      </form>
    </div>
  );
}
