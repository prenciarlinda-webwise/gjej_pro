"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  api,
  ApiError,
  type FreelancerProfile,
  type ProfilePayload,
} from "@/lib/api";
import { Button } from "@/components/Button";
import { Field, TextareaField } from "@/components/Field";
import { ProgressBar } from "@/components/ProgressBar";
import { AvatarUploader } from "@/components/AvatarUploader";

const CURRENCIES = ["ALL", "EUR", "USD", "GBP"];

export default function FreelancerProfileEdit() {
  const router = useRouter();
  const [data, setData] = useState<ProfilePayload<FreelancerProfile> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    api.myProfile<FreelancerProfile>().then((d) => {
      setData(d);
      setForm({
        first_name: d.user.first_name,
        last_name: d.user.last_name,
        phone: d.user.phone ?? "",
        headline: d.profile.headline ?? "",
        bio: d.profile.bio ?? "",
        years_experience: d.profile.years_experience?.toString() ?? "",
        hourly_rate_min: d.profile.hourly_rate_min ?? "",
        hourly_rate_max: d.profile.hourly_rate_max ?? "",
        currency: d.profile.currency || "ALL",
        company_name: d.profile.company_name ?? "",
      });
    });
  }, []);

  if (!data) {
    return <div className="text-stone">Po ngarkohet…</div>;
  }

  function update<K extends string>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const body: Record<string, unknown> = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        headline: form.headline,
        bio: form.bio,
        currency: form.currency,
        company_name: form.company_name,
      };
      if (form.years_experience !== "") {
        body.years_experience = Number(form.years_experience);
      } else {
        body.years_experience = null;
      }
      body.hourly_rate_min = form.hourly_rate_min === "" ? null : form.hourly_rate_min;
      body.hourly_rate_max = form.hourly_rate_max === "" ? null : form.hourly_rate_max;

      const updated = await api.patchProfile<FreelancerProfile>(body);
      setData(updated);
      setSavedAt(Date.now());
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors: Record<string, string> = {};
        for (const [k, v] of Object.entries(err.fields)) {
          fieldErrors[k] = v[0] ?? "";
        }
        if (!Object.keys(fieldErrors).length) {
          fieldErrors.detail = err.message;
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ detail: "Diçka shkoi keq. Provoni përsëri." });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-stone">
          Paneli i profesionistit
        </p>
        <h1 className="font-display text-3xl mt-1.5 text-ink">Profili juaj</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Sa më i plotë profili, aq më shumë mundësi kanë klientët t&apos;ju gjejnë.
        </p>

        {errors.detail && (
          <div className="mt-6 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errors.detail}
          </div>
        )}
        {savedAt && (
          <div className="mt-6 rounded-md border border-line bg-surface-2 px-4 py-3 text-sm text-ink">
            ✓ Ndryshimet u ruajtën.
          </div>
        )}

        <div className="mt-8 rounded-lg border border-line bg-surface p-5">
          <h3 className="text-xs font-medium uppercase tracking-wider text-stone mb-4">
            Fotoja e profilit
          </h3>
          <AvatarUploader
            name={`${form.first_name || ""} ${form.last_name || ""}`.trim() || "?"}
            currentUrl={data.profile.avatar_url || null}
            onUploaded={(url) =>
              setData((d) =>
                d
                  ? {
                      ...d,
                      profile: { ...d.profile, avatar_url: url ?? "" },
                    }
                  : d,
              )
            }
          />
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-10">
          <Section title="Informacioni personal">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Emri" value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                error={errors.first_name} />
              <Field label="Mbiemri" value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                error={errors.last_name} />
            </div>
            <Field
              label="Telefoni"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+355 ..."
              hint="Klientët do t'ju kontaktojnë në këtë numër."
              error={errors.phone}
            />
          </Section>

          <Section title="Prezantimi profesional">
            <Field
              label="Titulli i shkurtër"
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              placeholder="p.sh. Elektricist me 10 vjet eksperiencë"
              error={errors.headline}
            />
            <TextareaField
              label="Biografia"
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Përshkruani eksperiencën, llojet e punëve, dhe çdo çertifikim që keni."
              error={errors.bio}
              rows={5}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Vite eksperiencë"
                type="number"
                min={0}
                max={80}
                value={form.years_experience}
                onChange={(e) => update("years_experience", e.target.value)}
                error={errors.years_experience}
              />
              <Field
                label="Kompania (opsionale)"
                name="company_name"
                autoComplete="organization"
                value={form.company_name}
                onChange={(e) => update("company_name", e.target.value)}
                placeholder="Nëse punoni si kompani"
                hint="Lëre bosh nëse punon si individ."
                error={errors.company_name}
              />
            </div>
          </Section>

          <Section title="Çmimet">
            <div className="grid grid-cols-3 gap-3">
              <Field
                label="Çmimi min / orë"
                type="number"
                step="0.01"
                value={form.hourly_rate_min}
                onChange={(e) => update("hourly_rate_min", e.target.value)}
                error={errors.hourly_rate_min}
              />
              <Field
                label="Çmimi max / orë"
                type="number"
                step="0.01"
                value={form.hourly_rate_max}
                onChange={(e) => update("hourly_rate_max", e.target.value)}
                error={errors.hourly_rate_max}
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
          </Section>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Po ruhet…" : "Ruaj ndryshimet"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard/freelancer")}
            >
              Anulo
            </Button>
          </div>
        </form>
      </div>

      <aside className="space-y-6">
        <div className="rounded-lg border border-line bg-surface p-5">
          <ProgressBar value={data.completion} label="Plotësueshmëria" />
          <p className="mt-3 text-xs text-stone leading-relaxed">
            Profilet 80%+ marrin{" "}
            <span className="text-forest font-medium">3× më shumë kontakte</span>{" "}
            sipas mesatares së platformës.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-stone">
            Hapat tjerë
          </h3>
          <NextStep done={data.completion >= 0.5} text="Plotësoni titullin dhe biografinë" />
          <NextStep done={!!data.profile.hourly_rate_min} text="Caktoni çmimet" />
          <NextStep done={false} text="Shtoni shërbimet (së shpejti)" />
          <NextStep done={false} text="Caktoni zonat (së shpejti)" />
        </div>

        <Link
          href="/dashboard/freelancer"
          className="block text-xs text-stone hover:text-ink"
        >
          ← Kthehu te paneli
        </Link>
      </aside>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-xs font-medium uppercase tracking-wider text-stone mb-3">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function NextStep({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span
        className={`mt-0.5 inline-block w-3.5 h-3.5 rounded-sm border ${
          done ? "bg-forest border-forest" : "bg-surface border-line"
        }`}
      />
      <span className={done ? "text-ink-muted line-through" : "text-ink"}>
        {text}
      </span>
    </div>
  );
}
