import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { FreelancerCard } from "@/components/FreelancerCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { ReadOnlyStars } from "@/components/StarRating";
import { serverApi, SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `${SITE.name} — Profesionistë të verifikuar në Shqipëri`,
  description: SITE.description,
  alternates: { canonical: SITE.url },
  openGraph: {
    title: `${SITE.name} — Profesionistë për ju`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "sq_AL",
    type: "website",
  },
};

export default async function Home() {
  const [categories, featured] = await Promise.all([
    serverApi.categories(),
    serverApi.searchFreelancers({ page: 1 }),
  ]);
  const cats = categories ?? [];
  const featuredList = (featured?.results ?? []).slice(0, 6);

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="bg-gradient-warm">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-muted mb-6 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                  <span className="font-medium tracking-tight">
                    Platforma nr. 1 në Shqipëri
                  </span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink leading-[1.02]">
                  Gjej mjeshtrin{" "}
                  <span className="italic text-forest">e duhur.</span>
                  <br />
                  Sot.
                </h1>
                <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
                  Mijëra profesionistë të verifikuar — elektricistë, hidraulikë,
                  bravandreqës, pastrues — gati t&apos;ju ndihmojnë në çdo punë
                  në shtëpi apo biznes.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/profesionistet">
                    <Button variant="primary" size="lg">
                      Kërko një profesionist →
                    </Button>
                  </Link>
                  <Link href="/regjistrohu?role=freelancer">
                    <Button variant="secondary" size="lg">
                      Bëhu profesionist
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-3 text-sm text-stone">
                  <div className="flex -space-x-2">
                    {["AH", "GK", "EB", "AT"].map((seed) => (
                      <Avatar key={seed} name={seed} size={28} ring />
                    ))}
                  </div>
                  <span>Bashkohuni me 1,000+ klientë të kënaqur</span>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <HeroIllustration />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-1">
                  Kategoritë
                </p>
                <h2 className="font-display text-3xl text-ink">
                  Çfarë po kërkoni sot?
                </h2>
              </div>
              <Link
                href="/kategorite"
                className="text-sm font-medium text-forest hover:underline shrink-0"
              >
                Të gjitha →
              </Link>
            </div>
            <div className="scroll-rail flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
              {cats.slice(0, 12).map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.slug}`}
                  className="card card-link shrink-0 w-[200px] p-5 group"
                >
                  <div
                    className="inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "rgba(31, 77, 58, 0.08)",
                      color: "var(--color-forest)",
                    }}
                  >
                    <CategoryIcon slug={c.icon || "monitor"} size={22} />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink leading-tight">
                    {c.name}
                  </h3>
                  {c.name_en && (
                    <p className="mt-1 text-xs text-stone italic">
                      {c.name_en}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {featuredList.length > 0 && (
          <section>
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone mb-1">
                    Profesionistë
                  </p>
                  <h2 className="font-display text-3xl text-ink">
                    Të zgjedhur këtë javë
                  </h2>
                </div>
                <Link
                  href="/profesionistet"
                  className="text-sm font-medium text-forest hover:underline"
                >
                  Shfleto të gjithë →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredList.map((f) => (
                  <FreelancerCard key={f.id} f={f} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-line bg-surface">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
            <p className="text-xs uppercase tracking-wider text-stone mb-2">
              Si funksionon
            </p>
            <h2 className="font-display text-3xl text-ink max-w-xl">
              Nga kërkesa tek puna e përfunduar — në 3 hapa.
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Step n={1} title="Postoni kërkesën" body="Përshkruani shkurt punën që ju duhet — kategoria, qyteti, buxheti." />
              <Step n={2} title="Merrni oferta" body="Profesionistë të verifikuar dorëzojnë çmim dhe propozim brenda orëve." />
              <Step n={3} title="Zgjidhni dhe nisni" body="Shihni profilet, krahasoni vlerësimet, pranoni më të mirën." />
            </div>
            <div className="mt-8">
              <Link href="/si-funksionon">
                <Button variant="secondary" size="md">
                  Më shumë rreth procesit →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-forest text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              <BigStat value="1,000+" label="Klientë të kënaqur" />
              <BigStat value="500+" label="Profesionistë të verifikuar" />
              <BigStat value="36" label="Bashki të mbuluara" />
              <BigStat value="< 2 orë" label="Përgjigje mesatare" />
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
            <p className="text-xs uppercase tracking-wider text-stone mb-2">
              Vlerësimet
            </p>
            <h2 className="font-display text-3xl text-ink">
              Çfarë thonë klientët
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              <Testimonial
                name="Erjola T."
                city="Tiranë"
                rating={5}
                quote="Mjeshtri erdhi në kohë dhe e zgjidhi rrjedhjen për 30 minuta. Shumë profesional."
              />
              <Testimonial
                name="Ardit S."
                city="Durrës"
                rating={5}
                quote="Mora 4 oferta brenda 2 orësh. Krahasova çmimet dhe zgjodha më të mirën — pa stres."
              />
              <Testimonial
                name="Klea B."
                city="Vlorë"
                rating={5}
                quote="Vlerësimet reale më ndihmuan të zgjedh një pastrues që rezultoi i mrekullueshëm."
              />
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-20">
            <div className="card relative overflow-hidden p-8 sm:p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-forest mb-2">
                  Për profesionistët
                </p>
                <h2 className="font-display text-3xl text-ink max-w-xl">
                  Bashkohuni me qindra mjeshtra që marrin punë çdo ditë.
                </h2>
                <p className="mt-3 text-ink-muted max-w-xl">
                  Pa pagesë mujore, pa komisione. Krijoni profilin në më pak se
                  5 minuta.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/per-profesionistet">
                  <Button variant="secondary" size="lg">
                    Mëso më shumë
                  </Button>
                </Link>
                <Link href="/regjistrohu?role=freelancer">
                  <Button variant="primary" size="lg">
                    Regjistrohu falas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="numeric">
      <div className="font-display text-4xl sm:text-5xl">{value}</div>
      <div className="mt-2 text-sm text-white/70 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div>
      <div
        className="inline-flex items-center justify-center w-10 h-10 rounded-full font-medium numeric"
        style={{
          backgroundColor: "rgba(31, 77, 58, 0.08)",
          color: "var(--color-forest)",
        }}
      >
        {n}
      </div>
      <h3 className="mt-4 font-display text-2xl text-ink">{title}</h3>
      <p className="mt-2 text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Testimonial({
  name,
  city,
  rating,
  quote,
}: {
  name: string;
  city: string;
  rating: number;
  quote: string;
}) {
  return (
    <figure className="card p-6">
      <ReadOnlyStars rating={rating} size={14} />
      <blockquote className="mt-4 text-ink leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 pt-4 border-t border-line/70 flex items-center gap-3">
        <Avatar name={name} size={36} />
        <div>
          <div className="text-sm font-medium text-ink">{name}</div>
          <div className="text-xs text-stone">{city}</div>
        </div>
      </figcaption>
    </figure>
  );
}

function HeroIllustration() {
  return (
    <div className="relative h-[420px]">
      <div
        className="absolute right-0 top-8 w-[280px] rounded-2xl bg-surface shadow-lg border border-line p-5"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="flex items-center gap-3">
          <Avatar name="Genti Krasniqi" size={44} />
          <div>
            <div className="font-display text-base text-ink">Genti Krasniqi</div>
            <div className="text-xs text-stone">Hidraulik · Tiranë</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <ReadOnlyStars rating={5} size={12} />
          <span className="text-stone numeric">5.0 · 24 vlerësime</span>
        </div>
        <div className="mt-3 inline-block text-[10px] uppercase tracking-wider text-gold-deep border border-gold/40 bg-gold/10 rounded-full px-2 py-0.5">
          ✓ Verifikuar
        </div>
      </div>

      <div
        className="absolute left-0 top-32 w-[280px] rounded-2xl bg-surface shadow-xl border border-line p-5"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="text-[10px] uppercase tracking-wider text-stone">
          Kërkesë e re
        </div>
        <h3 className="mt-1 font-display text-lg text-ink">
          Rrjedhje uji në kuzhinë
        </h3>
        <div className="mt-3 text-xs text-stone">Tiranë · Buxhet 20–80 €</div>
        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-emerald font-medium bg-emerald/10 rounded-full px-2 py-0.5">
            E hapur
          </span>
          <span className="text-xs text-ink-muted numeric">3 oferta</span>
        </div>
      </div>

      <div
        className="absolute right-12 bottom-4 rounded-xl bg-forest text-white shadow-lg p-4"
        style={{ transform: "rotate(4deg)" }}
      >
        <div className="text-xs">Përgjigje brenda</div>
        <div className="font-display text-2xl">2 orëve</div>
      </div>
    </div>
  );
}
