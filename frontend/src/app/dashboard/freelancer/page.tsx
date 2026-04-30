"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  api,
  type FreelancerProfile,
  type ProfilePayload,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfilePayload<FreelancerProfile> | null>(null);

  useEffect(() => {
    api.myProfile<FreelancerProfile>().then(setData).catch(() => {});
  }, []);

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-stone">
        Paneli i profesionistit
      </p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">
        Mirë se erdhët, {user?.first_name}.
      </h1>
      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Llogaria juaj është krijuar. Hapi tjetër është të plotësoni profilin
        tuaj — shërbimet që ofroni, kategoritë dhe zonat ku punoni.
      </p>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-lg border border-line bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl text-ink">Profili juaj</h2>
            <Link
              href="/dashboard/freelancer/profili"
              className="text-xs font-medium text-forest hover:underline"
            >
              Redakto →
            </Link>
          </div>

          {data ? (
            <>
              <div className="mt-4">
                <ProgressBar value={data.completion} label="Plotësueshmëria" />
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <Item label="Titulli" value={data.profile.headline || "—"} />
                <Item
                  label="Kompania"
                  value={data.profile.company_name || "Solo / freelance"}
                />
                <Item
                  label="Vite eksperiencë"
                  value={
                    data.profile.years_experience !== null
                      ? String(data.profile.years_experience)
                      : "—"
                  }
                />
                <Item
                  label="Çmimi / orë"
                  value={
                    data.profile.hourly_rate_min || data.profile.hourly_rate_max
                      ? `${data.profile.hourly_rate_min ?? "?"} – ${data.profile.hourly_rate_max ?? "?"} ${data.profile.currency}`
                      : "—"
                  }
                />
              </dl>

              {data.completion < 0.8 && (
                <div className="mt-6">
                  <Link href="/dashboard/freelancer/profili">
                    <Button variant="primary" size="md">
                      Plotëso profilin
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 text-sm text-stone">Po ngarkohet…</div>
          )}
        </div>

        <div className="rounded-lg border border-line bg-surface p-6">
          <h2 className="font-display text-xl text-ink">Hapat tjerë</h2>
          <ol className="mt-4 space-y-3">
            <Step n={1} title="Plotësoni profilin" href="/dashboard/freelancer/profili" />
            <Step n={2} title="Shtoni shërbimet" href="/dashboard/freelancer/sherbime" />
            <Step n={3} title="Caktoni zonat e punës" href="/dashboard/freelancer/zonat" />
            <Step n={4} title="Shfletoni punët e hapura" href="/dashboard/freelancer/punet" />
          </ol>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl text-ink">Detajet e llogarisë</h2>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
          <Item label="Emri i plotë" value={user?.full_name} />
          <Item label="Email" value={user?.email} />
          <Item label="Telefon" value={user?.phone || "Pa caktuar"} />
          <Item
            label="Email i verifikuar"
            value={user?.is_email_verified ? "Po" : "Jo"}
          />
        </dl>
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-stone">{label}</dt>
      <dd className="text-ink mt-0.5">{value ?? "—"}</dd>
    </div>
  );
}

function Step({
  n,
  title,
  href,
  disabled,
}: {
  n: number;
  title: string;
  href?: string;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className={[
        "flex items-center gap-3 px-3 py-2 -mx-3 rounded-md transition",
        disabled ? "opacity-60" : "hover:bg-surface-2 cursor-pointer",
      ].join(" ")}
    >
      <div
        className={[
          "inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-medium numeric",
          disabled ? "bg-surface-2 text-stone border border-line" : "bg-forest text-white",
        ].join(" ")}
      >
        0{n}
      </div>
      <span className="text-sm text-ink">{title}</span>
      {disabled && (
        <span className="ml-auto text-[10px] uppercase tracking-wider text-stone">
          Së shpejti
        </span>
      )}
    </div>
  );

  return href && !disabled ? <Link href={href}>{inner}</Link> : inner;
}
