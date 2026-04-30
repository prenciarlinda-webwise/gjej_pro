"use client";

import { useEffect, useState } from "react";
import { api, type NotificationPreferences } from "@/lib/api";

type PrefKey = keyof Omit<NotificationPreferences, "updated_at">;

const TOGGLES: Array<{ key: PrefKey; label: string; description: string }> = [
  {
    key: "email_quote_received",
    label: "Ofertë e re për kërkesat tuaja",
    description: "Email kur një profesionist dorëzon një ofertë në kërkesat tuaja.",
  },
  {
    key: "email_quote_accepted",
    label: "Oferta juaj u pranua",
    description: "Email kur një klient pranon ofertën tuaj.",
  },
  {
    key: "email_quote_rejected",
    label: "Oferta juaj nuk u zgjodh",
    description: "Email kur një klient zgjedh një ofertë tjetër në vend të suaj.",
  },
  {
    key: "email_message_received",
    label: "Mesazh i ri",
    description: "Email kur dikush ju dërgon një mesazh në Gjej Pro.",
  },
  {
    key: "email_review_received",
    label: "Vlerësim i ri",
    description: "Email kur një klient ju lë një vlerësim.",
  },
  {
    key: "email_job_completed",
    label: "Punë e shënuar si e përfunduar",
    description: "Email kur klienti shënon si të përfunduar një punë në të cilën ju keni punuar.",
  },
  {
    key: "email_job_cancelled",
    label: "Kërkesë e anuluar",
    description: "Email kur një klient anulon një kërkesë në të cilën keni dorëzuar ofertë.",
  },
];

export function SettingsPanel() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [error, setError] = useState("");
  const [savedKey, setSavedKey] = useState<PrefKey | null>(null);
  const [savingKey, setSavingKey] = useState<PrefKey | null>(null);

  useEffect(() => {
    api.notificationPreferences()
      .then(setPrefs)
      .catch((e) => setError(e?.message ?? "Gabim gjatë ngarkimit."));
  }, []);

  async function toggle(key: PrefKey) {
    if (!prefs) return;
    const next = !prefs[key];
    // Optimistic update
    setPrefs((p) => (p ? { ...p, [key]: next } : p));
    setSavingKey(key);
    setError("");
    try {
      const updated = await api.updateNotificationPreferences({ [key]: next });
      setPrefs(updated);
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 1500);
    } catch (e) {
      // Roll back on failure
      setPrefs((p) => (p ? { ...p, [key]: !next } : p));
      setError((e as Error)?.message ?? "Gabim gjatë ruajtjes.");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-stone">Cilësimet</p>
      <h1 className="font-display text-3xl mt-1.5 text-ink">
        Njoftimet me email
      </h1>
      <p className="mt-2 text-sm text-ink-muted max-w-2xl">
        Zgjidhni cilat email-e dëshironi të merrni nga Gjej Pro. Njoftimet
        brenda platformës do të vazhdojnë t&apos;ju shfaqen pavarësisht
        zgjedhjes tuaj këtu.
      </p>

      {error && (
        <div className="mt-6 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <section className="mt-8 card overflow-hidden">
        {!prefs ? (
          <div className="px-5 py-6 text-sm text-stone">Po ngarkohet…</div>
        ) : (
          <ul>
            {TOGGLES.map((t, i) => (
              <li
                key={t.key}
                className={[
                  "px-5 py-4 flex items-start justify-between gap-5",
                  i < TOGGLES.length - 1 ? "border-b border-line/70" : "",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">{t.label}</div>
                  <div className="mt-0.5 text-xs text-stone leading-relaxed">
                    {t.description}
                  </div>
                  {savedKey === t.key && (
                    <div className="mt-1 text-xs text-success">U ruajt ✓</div>
                  )}
                </div>
                <Toggle
                  on={prefs[t.key]}
                  loading={savingKey === t.key}
                  onClick={() => toggle(t.key)}
                  ariaLabel={t.label}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-8 text-xs text-stone leading-relaxed max-w-2xl">
        Verifikimi me telefon dhe njoftimet me SMS nuk janë aktive për momentin.
        Të gjitha njoftimet kryesore vijnë me email në adresën e regjistruar.
      </p>
    </div>
  );
}

function Toggle({
  on,
  loading,
  onClick,
  ariaLabel,
}: {
  on: boolean;
  loading: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={[
        "shrink-0 relative inline-flex w-11 h-6 rounded-full transition-colors",
        on ? "bg-forest" : "bg-line-strong",
        loading ? "opacity-60 cursor-wait" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
