import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { HeroDecoration, CornerLines } from "@/components/HeroDecoration";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { ReadOnlyStars } from "@/components/StarRating";
import { SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Për profesionistët — Bëhuni pjesë e Gjej Pro | ${SITE.name}`,
  description:
    "Merrni klientë të rinj çdo ditë në Gjej Pro. Pa pagesë mujore, pa komisione. Krijoni profilin tuaj në më pak se 5 minuta.",
  alternates: { canonical: `${SITE.url}/per-profesionistet` },
};

export default function ForProfessionalsPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <HeroDecoration variant="warm" />
          <CornerLines position="bottom-left" />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone">
                  Për profesionistët
                </p>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mt-3 text-ink leading-[1.02]">
                  Më shumë klientë.
                  <br />
                  <span className="italic text-forest">Më pak përpjekje.</span>
                </h1>
                <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
                  Bashkohuni me qindra mjeshtra në Shqipëri që marrin punë të
                  reja çdo ditë përmes Gjej Pro.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/regjistrohu?role=freelancer">
                    <Button variant="primary" size="lg">
                      Regjistrohu falas →
                    </Button>
                  </Link>
                  <Link href="/profesionistet">
                    <Button variant="secondary" size="lg">
                      Shihni shembujt
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-3 text-sm text-stone">
                  <ReadOnlyStars rating={5} size={14} />
                  <span>Vlerësuar 4.9/5 nga 500+ profesionistë</span>
                </div>
              </div>

              {/* Layered card composition — pricing/earnings preview */}
              <div className="hidden lg:block relative h-[440px]">
                <ProsHeroIllustration />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <BenefitCard
              icon="cake"
              title="Pa pagesë mujore"
              body="Krijo profilin, listo shërbimet, merr kontakte. Pa abonime, pa kosto fikse."
            />
            <BenefitCard
              icon="key"
              title="Pa komisione"
              body="Çmimi që ofron është çmimi që merr. Klienti dhe ti merreni vesh direkt."
            />
            <BenefitCard
              icon="monitor"
              title="Klientë seriozë"
              body="Çdo klient verifikon emailin para se të kontaktojë. Pa numra të rremë, pa kohë të humbur."
            />
          </div>
        </section>

        <section className="bg-surface border-y border-line relative overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full opacity-40"
            style={{ background: "radial-gradient(closest-side, rgba(31, 77, 58, 0.10), transparent)" }}
          />
          <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <p className="text-xs uppercase tracking-wider text-stone mb-2">
              Si funksionon
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Nga regjistrimi tek puna e parë.
            </h2>
            <ol className="mt-8 space-y-5">
              <Step
                n={1}
                title="Krijoni profilin tuaj"
                body="Përshkruani eksperiencën, shtoni shërbimet që ofroni, caktoni zonat ku punoni. 5 minuta total."
              />
              <Step
                n={2}
                title="Shihni kërkesat e hapura"
                body="Filtroni sipas kategorisë dhe qytetit. Shfaqen automatikisht kërkesat që përshtaten me profilin tuaj."
              />
              <Step
                n={3}
                title="Dorëzoni ofertën"
                body="Çmim, mesazh personal, kohë e propozuar. Klienti shikon dhe vendos."
              />
              <Step
                n={4}
                title="Punoni dhe ndërtoni reputacionin"
                body="Çdo punë e mirë sjell një vlerësim. Sa më shumë vlerësime 5★, aq më shumë punë në të ardhmen."
              />
            </ol>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
          <div className="bg-gradient-forest text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div
              className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full opacity-30"
              style={{ background: "radial-gradient(closest-side, rgba(201, 169, 97, 0.40), transparent)" }}
            />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl max-w-3xl">
                Bëhuni pjesë e komunitetit më të madh të mjeshtrave shqiptarë.
              </h2>
              <p className="mt-3 text-white/80 max-w-2xl">
                Sa më shpejt të krijoni profilin, aq më shumë klientë do
                t&apos;ju shohin. Asnjë lloj angazhimi.
              </p>
              <div className="mt-6">
                <Link href="/regjistrohu?role=freelancer">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-forest hover:bg-white/90"
                  >
                    Filloni tani — falas
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

function BenefitCard({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: string;
}) {
  return (
    <div className="card p-6">
      <div
        className="inline-flex items-center justify-center rounded-xl"
        style={{
          width: 48,
          height: 48,
          backgroundColor: "rgba(31, 77, 58, 0.08)",
          color: "var(--color-forest)",
        }}
      >
        <CategoryIcon slug={icon} size={24} />
      </div>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4 items-start">
      <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-forest text-white font-medium numeric text-sm">
        {n}
      </div>
      <div className="flex-1">
        <h3 className="font-display text-xl text-ink">{title}</h3>
        <p className="mt-1 text-base text-ink-muted leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function ProsHeroIllustration() {
  return (
    <>
      {/* Earnings card */}
      <div
        className="absolute right-0 top-4 w-[300px] rounded-2xl bg-surface shadow-xl border border-line p-5"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="text-[10px] uppercase tracking-wider text-stone">
          Të ardhurat këtë muaj
        </div>
        <div className="mt-2 font-display text-4xl text-ink numeric">
          €2,840
        </div>
        <div className="mt-1 text-xs text-emerald font-medium numeric">
          ↑ +18% nga muaji i kaluar
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 items-end h-12">
          {[40, 55, 30, 65, 80, 45, 70].map((h, i) => (
            <div
              key={i}
              className="rounded-sm bg-forest/15"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Job request card */}
      <div
        className="absolute left-0 top-44 w-[280px] rounded-2xl bg-surface shadow-lg border border-line p-5"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="text-[10px] uppercase tracking-wider text-emerald font-medium bg-emerald/10 rounded-full inline-block px-2 py-0.5">
          Kërkesë e re që përshtatet
        </div>
        <h3 className="mt-2 font-display text-lg text-ink">
          Instalim çezme + bojler
        </h3>
        <div className="mt-2 text-xs text-stone">Tiranë · Buxhet 50–120 €</div>
        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs">
          <span className="text-stone">Postuar para 12 min</span>
          <span className="text-forest font-medium">Dorëzo ofertën →</span>
        </div>
      </div>

      {/* Review card — small accent */}
      <div
        className="absolute right-12 bottom-2 w-[220px] rounded-xl bg-forest text-white shadow-lg p-4"
        style={{ transform: "rotate(4deg)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Avatar name="Erjola T." size={28} />
          <div>
            <div className="text-xs font-medium">Erjola T.</div>
            <div className="text-[10px] text-white/60">Para 2 ditësh</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gold">
          {"★★★★★".split("").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <p className="mt-1 text-xs text-white/80 leading-snug">
          &ldquo;Punë e shkëlqyer. Shumë profesional.&rdquo;
        </p>
      </div>
    </>
  );
}
