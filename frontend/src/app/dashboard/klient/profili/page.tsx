"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  api,
  ApiError,
  type KlientProfile,
  type ProfilePayload,
} from "@/lib/api";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { ProgressBar } from "@/components/ProgressBar";
import { AvatarUploader } from "@/components/AvatarUploader";

export default function KlientProfileEdit() {
  const router = useRouter();
  const [data, setData] = useState<ProfilePayload<KlientProfile> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    api.myProfile<KlientProfile>().then((d) => {
      setData(d);
      setForm({
        first_name: d.user.first_name,
        last_name: d.user.last_name,
        phone: d.user.phone ?? "",
        default_address: d.profile.default_address ?? "",
        city: d.profile.city ?? "",
      });
    });
  }, []);

  if (!data) return <div className="text-stone">Po ngarkohet…</div>;

  function update<K extends string>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const updated = await api.patchProfile<KlientProfile>(form);
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
          Paneli juaj
        </p>
        <h1 className="font-display text-3xl mt-1.5 text-ink">Profili juaj</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Plotësoni të dhënat tuaja që profesionistët të mund t&apos;ju kontaktojnë.
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
              error={errors.phone}
            />
          </Section>

          <Section title="Adresa kryesore">
            <Field
              label="Adresa"
              value={form.default_address}
              onChange={(e) => update("default_address", e.target.value)}
              placeholder="Rruga, numri, hyrja"
              error={errors.default_address}
            />
            <Field
              label="Qyteti"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="p.sh. Tiranë"
              error={errors.city}
            />
          </Section>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Po ruhet…" : "Ruaj ndryshimet"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard/klient")}
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
            Profili i plotë ndihmon profesionistët t&apos;ju ofrojnë çmime më të
            sakta për punët që dëshironi.
          </p>
        </div>
        <Link
          href="/dashboard/klient"
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
