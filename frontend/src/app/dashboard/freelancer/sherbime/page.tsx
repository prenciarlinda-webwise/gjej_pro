"use client";

import { useEffect, useState } from "react";
import {
  api,
  ApiError,
  type Category,
  type PricingModel,
  type Service,
} from "@/lib/api";
import { Button } from "@/components/Button";
import { Field, TextareaField } from "@/components/Field";

const CURRENCIES = ["ALL", "EUR", "USD", "GBP"];
const PRICING: Array<{ value: PricingModel; label: string }> = [
  { value: "hourly", label: "Me orë" },
  { value: "fixed", label: "Çmim fiks" },
  { value: "quote", label: "Me ofertë" },
];

export default function FreelancerServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const [s, c] = await Promise.all([api.myServices(), api.categories()]);
    setServices(s);
    setCategories(c);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  if (loading) return <div className="text-stone">Po ngarkohet…</div>;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone">
            Paneli i profesionistit
          </p>
          <h1 className="font-display text-3xl mt-1.5 text-ink">
            Shërbimet tuaja
          </h1>
        </div>
        {editingId === null && (
          <Button variant="primary" onClick={() => setEditingId("new")}>
            + Shto shërbim
          </Button>
        )}
      </div>

      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Listoni shërbimet që ofroni. Sa më të qarta, aq më shumë klientë do
        t&apos;ju kontaktojnë.
      </p>

      <div className="mt-8 space-y-3">
        {editingId === "new" && (
          <ServiceForm
            categories={categories}
            onCancel={() => setEditingId(null)}
            onSaved={() => {
              setEditingId(null);
              void refresh();
            }}
          />
        )}

        {services.length === 0 && editingId === null && (
          <div className="rounded-lg border border-dashed border-line bg-surface p-8 text-center">
            <p className="text-sm text-ink-muted">
              Ende nuk keni shtuar asnjë shërbim.
            </p>
            <div className="mt-4">
              <Button variant="primary" onClick={() => setEditingId("new")}>
                Shtoni shërbimin e parë
              </Button>
            </div>
          </div>
        )}

        {services.map((s) =>
          editingId === s.id ? (
            <ServiceForm
              key={s.id}
              service={s}
              categories={categories}
              onCancel={() => setEditingId(null)}
              onSaved={() => {
                setEditingId(null);
                void refresh();
              }}
            />
          ) : (
            <ServiceCard
              key={s.id}
              service={s}
              onEdit={() => setEditingId(s.id)}
              onDeleted={refresh}
            />
          ),
        )}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDeleted,
}: {
  service: Service;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!confirm(`Të fshijmë "${service.title}"?`)) return;
    setDeleting(true);
    try {
      await api.deleteService(service.id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  const price =
    service.pricing_model === "quote"
      ? "Me ofertë"
      : service.price_min || service.price_max
      ? `${service.price_min ?? "?"} – ${service.price_max ?? "?"} ${service.currency}`
      : "—";

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-stone">
              {service.category.name}
            </span>
            {!service.is_active && (
              <span className="text-[10px] uppercase tracking-wider text-danger">
                Pasiv
              </span>
            )}
          </div>
          <h3 className="mt-1 font-medium text-ink">{service.title}</h3>
          {service.description && (
            <p className="mt-1.5 text-sm text-ink-muted line-clamp-2">
              {service.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-stone">
            <span className="numeric">{price}</span>
            <span className="text-line">·</span>
            <span>{service.pricing_model_label}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <Button variant="ghost" size="sm" onClick={onEdit}>Redakto</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={deleting}
            className="text-danger"
          >
            {deleting ? "..." : "Fshi"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ServiceForm({
  service,
  categories,
  onCancel,
  onSaved,
}: {
  service?: Service;
  categories: Category[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: service?.title ?? "",
    description: service?.description ?? "",
    category_id: service?.category.id ?? categories[0]?.id ?? 0,
    pricing_model: (service?.pricing_model ?? "hourly") as PricingModel,
    price_min: service?.price_min ?? "",
    price_max: service?.price_max ?? "",
    currency: service?.currency ?? "ALL",
    is_active: service?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const body = {
        title: form.title.trim(),
        description: form.description,
        category_id: Number(form.category_id),
        pricing_model: form.pricing_model,
        price_min: form.pricing_model === "quote" ? null : (form.price_min || null),
        price_max: form.pricing_model === "quote" ? null : (form.price_max || null),
        currency: form.currency,
        is_active: form.is_active,
      };
      if (service) {
        await api.updateService(service.id, body);
      } else {
        await api.createService(body);
      }
      onSaved();
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
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-forest/30 bg-surface p-5 space-y-4"
    >
      <div className="text-xs uppercase tracking-wider text-forest font-medium">
        {service ? "Redakto shërbimin" : "Shërbim i ri"}
      </div>

      {errors.detail && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {errors.detail}
        </div>
      )}

      <Field
        label="Titulli"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        placeholder="p.sh. Riparime urgjente hidraulike"
        error={errors.title}
        required
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
        label="Përshkrimi"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="Detajet e shërbimit, çfarë përfshin, koha mesatare, etj."
        rows={4}
        error={errors.description}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Modeli i çmimit
          </label>
          <select
            value={form.pricing_model}
            onChange={(e) => update("pricing_model", e.target.value as PricingModel)}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15 focus:border-forest"
          >
            {PRICING.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-muted">
            Monedha
          </label>
          <select
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/15 focus:border-forest"
            disabled={form.pricing_model === "quote"}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {form.pricing_model !== "quote" && (
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={form.pricing_model === "hourly" ? "Çmimi min / orë" : "Çmimi min"}
            type="number"
            step="0.01"
            value={form.price_min}
            onChange={(e) => update("price_min", e.target.value)}
            error={errors.price_min}
          />
          <Field
            label={form.pricing_model === "hourly" ? "Çmimi max / orë" : "Çmimi max"}
            type="number"
            step="0.01"
            value={form.price_max}
            onChange={(e) => update("price_max", e.target.value)}
            error={errors.price_max}
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => update("is_active", e.target.checked)}
          className="rounded border-line"
        />
        Aktiv (i dukshëm për klientët)
      </label>

      <div className="flex items-center gap-3 pt-2 border-t border-line">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Po ruhet…" : service ? "Ruaj" : "Shto shërbimin"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Anulo
        </Button>
      </div>
    </form>
  );
}
