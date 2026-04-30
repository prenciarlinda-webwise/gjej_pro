import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactProfessionalButton } from "@/components/ContactProfessionalButton";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { ReadOnlyStars } from "@/components/StarRating";
import { serverApi, SITE } from "@/lib/server-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const profile = await serverApi.freelancer(Number(id));
  if (!profile) {
    return { title: `Profesionisti nuk u gjet | ${SITE.name}` };
  }
  const cats = profile.categories.map((c) => c.name).join(", ");
  const title = `${profile.full_name}${profile.headline ? " | " + profile.headline : ""} | ${SITE.name}`;
  const description =
    (profile.bio || profile.headline || `Profesionist i listuar në ${SITE.name}.`)
      .replace(/\s+/g, " ")
      .slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/profesionist/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/profesionist/${id}`,
      siteName: SITE.name,
      locale: "sq_AL",
      type: "profile",
    },
    keywords: [profile.full_name, ...profile.categories.map((c) => c.name), cats],
  };
}

export default async function FreelancerDetailPage({ params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);
  const [profile, reviews] = await Promise.all([
    serverApi.freelancer(userId),
    serverApi.freelancerReviews(userId),
  ]);

  if (!profile) {
    notFound();
  }

  const rate =
    profile.hourly_rate_min || profile.hourly_rate_max
      ? `${profile.hourly_rate_min ?? "?"} – ${profile.hourly_rate_max ?? "?"} ${profile.currency}/orë`
      : "Çmim me ofertë";

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="border-b border-line bg-surface">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
            <Link
              href="/profesionistet"
              className="text-xs text-stone hover:text-ink"
            >
              ← Të gjithë profesionistët
            </Link>

            <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-4xl text-ink">
                  {profile.full_name}
                </h1>
                {profile.headline && (
                  <p className="mt-2 text-lg text-ink-muted">{profile.headline}</p>
                )}
                {profile.company_name && (
                  <p className="mt-1 text-sm text-stone">{profile.company_name}</p>
                )}
              </div>
              {profile.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-gold border border-gold/40 bg-gold/10 rounded px-2.5 py-1">
                  ✓ Profesionist i verifikuar
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-lg overflow-hidden">
              <Stat label="Tarifa" value={rate} />
              <Stat
                label="Eksperiencë"
                value={
                  profile.years_experience !== null && profile.years_experience !== undefined
                    ? `${profile.years_experience} vjet`
                    : "—"
                }
              />
              <Stat
                label="Vlerësimi"
                value={
                  profile.review_count > 0
                    ? `★ ${profile.avg_rating} (${profile.review_count})`
                    : "Pa vlerësime"
                }
              />
              <Stat
                label="Anëtar që"
                value={new Date(profile.member_since).toLocaleDateString("sq-AL", {
                  year: "numeric",
                  month: "short",
                })}
              />
            </div>

            <div className="mt-6">
              <ContactProfessionalButton freelancerUserId={userId} />
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {profile.bio && (
              <Block title="Rreth">
                <p className="text-sm text-ink leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              </Block>
            )}

            <Block title={`Vlerësimet (${profile.review_count})`}>
              {profile.review_count === 0 ? (
                <p className="text-sm text-stone">Ende pa vlerësime.</p>
              ) : (
                <>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-display text-3xl text-ink numeric">
                      {profile.avg_rating}
                    </span>
                    <ReadOnlyStars
                      rating={Math.round(Number(profile.avg_rating))}
                      size={18}
                    />
                    <span className="text-sm text-stone numeric">
                      · {profile.review_count}{" "}
                      {profile.review_count === 1 ? "vlerësim" : "vlerësime"}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {(reviews?.results ?? []).map((r) => (
                      <li
                        key={r.id}
                        className="rounded-md border border-line bg-surface p-4"
                      >
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <ReadOnlyStars rating={r.rating} size={14} />
                            <span className="text-sm font-medium text-ink">
                              {r.reviewer_first_name}
                            </span>
                          </div>
                          <span className="text-xs text-stone numeric">
                            {new Date(r.created_at).toLocaleDateString("sq-AL", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-stone">
                          {r.job_category} · {r.job_title}
                        </div>
                        {r.comment && (
                          <p className="mt-2 text-sm text-ink leading-relaxed whitespace-pre-line">
                            {r.comment}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Block>

            <Block title={`Shërbimet (${profile.services.length})`}>
              {profile.services.length === 0 ? (
                <p className="text-sm text-stone">Ende nuk janë listuar shërbime.</p>
              ) : (
                <ul className="space-y-3">
                  {profile.services.filter((s) => s.is_active).map((s) => {
                    const sPrice =
                      s.pricing_model === "quote"
                        ? "Me ofertë"
                        : s.price_min || s.price_max
                        ? `${s.price_min ?? "?"} – ${s.price_max ?? "?"} ${s.currency}`
                        : "—";
                    return (
                      <li
                        key={s.id}
                        className="rounded-md border border-line bg-surface p-4"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-wider text-stone">
                              <Link
                                href={`/${s.category.slug}`}
                                className="hover:text-ink"
                              >
                                {s.category.name}
                              </Link>
                            </div>
                            <h4 className="mt-0.5 font-medium text-ink">
                              {s.title}
                            </h4>
                          </div>
                          <div className="text-xs text-ink whitespace-nowrap numeric">
                            {sPrice}
                          </div>
                        </div>
                        {s.description && (
                          <p className="mt-2 text-sm text-ink-muted">
                            {s.description}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Block>
          </div>

          <aside className="space-y-6">
            <Block title="Zonat e punës">
              {profile.service_areas.length === 0 ? (
                <p className="text-sm text-stone">Pa specifikuar.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {profile.service_areas.map((a) => (
                    <li
                      key={a.id}
                      className="text-xs rounded-md border border-line bg-surface-2 px-2 py-1"
                    >
                      {a.city}
                    </li>
                  ))}
                </ul>
              )}
            </Block>
          </aside>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-stone mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-stone">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-ink numeric truncate" title={value}>
        {value}
      </div>
    </div>
  );
}
