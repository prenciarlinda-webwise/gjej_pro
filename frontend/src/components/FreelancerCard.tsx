import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import type { FreelancerListItem } from "@/lib/api";
import type { UiLocale } from "@/components/PublicHeader";

const STRINGS: Record<UiLocale, {
  quoteBased: string;
  perHour: string;
  verified: string;
  review: string;
  reviews: string;
  new: string;
}> = {
  sq: {
    quoteBased: "Me ofertë",
    perHour: " / orë",
    verified: "Verifikuar",
    review: "vlerësim",
    reviews: "vlerësime",
    new: "I ri",
  },
  en: {
    quoteBased: "Quote-based",
    perHour: " / hr",
    verified: "Verified",
    review: "review",
    reviews: "reviews",
    new: "New",
  },
};

export function FreelancerCard({
  f,
  locale = "sq",
}: {
  f: FreelancerListItem;
  locale?: UiLocale;
}) {
  const t = STRINGS[locale];
  const rate =
    f.hourly_rate_min || f.hourly_rate_max
      ? `${f.hourly_rate_min ?? "?"}–${f.hourly_rate_max ?? "?"} ${f.currency}`
      : t.quoteBased;
  const ratePer = f.hourly_rate_min || f.hourly_rate_max ? t.perHour : "";

  return (
    <Link
      href={`/profesionist/${f.slug}`}
      className="card card-link block p-5"
    >
      <div className="flex items-start gap-3">
        <Avatar name={f.full_name} src={f.avatar_url || null} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg text-ink truncate">
              {f.full_name}
            </h3>
            {f.is_verified && (
              <span
                className="text-[10px] uppercase tracking-wider text-gold-deep border border-gold/40 bg-gold/10 rounded-full px-2 py-0.5"
                title={t.verified}
              >
                ✓ {t.verified}
              </span>
            )}
          </div>
          {f.headline && (
            <p className="mt-0.5 text-sm text-ink-muted line-clamp-1">
              {f.headline}
            </p>
          )}
        </div>
      </div>

      {f.categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {f.categories.slice(0, 3).map((c) => (
            <span
              key={c.id}
              className="text-[11px] text-ink-muted bg-surface-2 border border-line rounded-full px-2.5 py-0.5"
            >
              {locale === "en" ? c.name_en || c.name : c.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-line/70 flex items-end justify-between gap-3">
        <div>
          <div className="text-base font-medium text-ink numeric">
            {rate}
            <span className="text-stone text-xs font-normal">{ratePer}</span>
          </div>
          {f.cities.length > 0 && (
            <div className="mt-0.5 text-xs text-stone truncate max-w-[160px]">
              {f.cities.slice(0, 2).join(" · ")}
              {f.cities.length > 2 && ` +${f.cities.length - 2}`}
            </div>
          )}
        </div>

        {Number(f.review_count) > 0 ? (
          <div className="text-right">
            <div className="text-sm font-medium text-ink numeric">
              ★ {f.avg_rating}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-stone numeric">
              {f.review_count} {f.review_count === 1 ? t.review : t.reviews}
            </div>
          </div>
        ) : (
          <div className="text-[10px] uppercase tracking-wider text-stone">
            {t.new}
          </div>
        )}
      </div>
    </Link>
  );
}
