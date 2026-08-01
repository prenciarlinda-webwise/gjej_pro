import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { HeroDecoration, CornerLines } from "@/components/HeroDecoration";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { SITE } from "@/lib/server-api";

const STRINGS = {
  sq: {
    metaTitle: `Për profesionistët | Bëhuni pjesë e Gjej Pro | ${SITE.name}`,
    metaDescription:
      "Merrni klientë të rinj çdo ditë në Gjej Pro. Pa pagesë mujore, pa komisione. Krijoni profilin tuaj në më pak se 5 minuta.",
    heroKicker: "Për profesionistët",
    heroTitleLine1: "Më shumë klientë.",
    heroTitleLine2: "Më pak përpjekje.",
    heroBody:
      "Listoni shërbimet tuaja, merrni kërkesa nga klientë të verifikuar dhe ndërtoni reputacionin tuaj në platformën më të re shqiptare.",
    ctaSignup: "Regjistrohu falas →",
    ctaSeeExamples: "Shihni shembujt",
    benefit1Title: "Pa pagesë mujore",
    benefit1Body:
      "Krijo profilin, listo shërbimet, merr kontakte. Pa abonime, pa kosto fikse.",
    benefit2Title: "0% komision platforme",
    benefit2Body:
      "Çmimi që ofron është çmimi që merr. Gjej Pro nuk mban përqindje nga puna juaj.",
    benefit3Title: "Klientë seriozë",
    benefit3Body:
      "Çdo klient verifikon emailin para se të kontaktojë. Pa numra të rremë, pa kohë të humbur.",
    commissionKicker: "E vërteta për komisionet",
    commissionHeadingPre: "Mbani 100% të",
    commissionHeadingEm: "çdo pune.",
    commissionPara1Pre: "Platformat e tjera marrin deri në ",
    commissionPara1Strong1: "20%",
    commissionPara1Mid:
      " nga çmimi i çdo pune. Në një muaj me 2,000 € të ardhura, kjo do të thotë ",
    commissionPara1Strong2: "400 € të humbura",
    commissionPara1Post: ". Në një vit: 4,800 €.",
    commissionPara2Pre: "Gjej Pro merr ",
    commissionPara2Strong: "0%",
    commissionPara2Post:
      " nga vlera e punës. Pa pagesa mujore. Pa tarifa të fshehura. Pa “premium plan” që dyfishon shikueshmërinë tuaj.",
    commissionPara3:
      "Kur vjen aplikacioni, pagesat online do të bëhen drejt klient → profesionist, brenda platformës. Pa komision Gjej Pro, vetëm tarifa standarde e procesorit të kartës.",
    otherPlatforms: "Platformat e tjera",
    otherPlatformsPct: "20%",
    otherPlatformsCaption: "Komision nga çdo punë",
    gjejProLabel: "Gjej Pro",
    gjejProPct: "0%",
    gjejProCaption: "Komision platforme",
    howKicker: "Si funksionon",
    howHeading: "Nga regjistrimi tek puna e parë.",
    step1Title: "Krijoni profilin tuaj",
    step1Body:
      "Përshkruani eksperiencën, shtoni shërbimet që ofroni, caktoni zonat ku punoni. 5 minuta total.",
    step2Title: "Shihni kërkesat e hapura",
    step2Body:
      "Filtroni sipas kategorisë dhe qytetit. Shfaqen automatikisht kërkesat që përshtaten me profilin tuaj.",
    step3Title: "Dorëzoni ofertën",
    step3Body: "Çmim, mesazh personal, kohë e propozuar. Klienti shikon dhe vendos.",
    step4Title: "Punoni dhe ndërtoni reputacionin",
    step4Body:
      "Çdo punë e mirë sjell një vlerësim. Sa më shumë vlerësime 5★, aq më shumë punë në të ardhmen.",
    ctaTitle: "Listoni shërbimet tuaja në Gjej Pro.",
    ctaBody:
      "Sa më shpejt të krijoni profilin, aq më shumë klientë do t'ju shohin. Asnjë lloj angazhimi.",
    ctaButton: "Filloni tani, falas",
    earningsLabel: "Të ardhurat këtë muaj",
    earningsAmount: "€2,840",
    earningsChange: "↑ +18% nga muaji i kaluar",
    newRequestBadge: "Kërkesë e re që përshtatet",
    jobTitle: "Instalim çezme + bojler",
    jobLocation: "Tiranë · Buxhet 50–120 €",
    jobPosted: "Postuar para 12 min",
    jobSubmit: "Dorëzo ofertën →",
    reviewerName: "Erjola T.",
    reviewTime: "Para 2 ditësh",
    reviewText: "“Punë e shkëlqyer. Shumë profesional.”",
  },
  en: {
    metaTitle: `For professionals | Join Gjej Pro | ${SITE.name}`,
    metaDescription:
      "Get new clients every day on Gjej Pro. No monthly fee, no commissions. Create your profile in under 5 minutes.",
    heroKicker: "For professionals",
    heroTitleLine1: "More clients.",
    heroTitleLine2: "Less effort.",
    heroBody:
      "List your services, receive requests from verified clients, and build your reputation on Albania's newest platform.",
    ctaSignup: "Sign up for free →",
    ctaSeeExamples: "See examples",
    benefit1Title: "No monthly fee",
    benefit1Body:
      "Create your profile, list your services, get contacted. No subscriptions, no fixed costs.",
    benefit2Title: "0% platform commission",
    benefit2Body:
      "The price you offer is the price you get. Gjej Pro doesn't take a cut of your work.",
    benefit3Title: "Serious clients",
    benefit3Body:
      "Every client verifies their email before reaching out. No fake numbers, no wasted time.",
    commissionKicker: "The truth about commissions",
    commissionHeadingPre: "Keep 100% of",
    commissionHeadingEm: "every job.",
    commissionPara1Pre: "Other platforms take up to ",
    commissionPara1Strong1: "20%",
    commissionPara1Mid:
      " of the price of every job. On a month with €2,000 in earnings, that means ",
    commissionPara1Strong2: "€400 lost",
    commissionPara1Post: ". Over a year: €4,800.",
    commissionPara2Pre: "Gjej Pro takes ",
    commissionPara2Strong: "0%",
    commissionPara2Post:
      " of the job's value. No monthly fees. No hidden charges. No “premium plan” that doubles your visibility.",
    commissionPara3:
      "When the app launches, online payments will go directly from client to professional, within the platform. No Gjej Pro commission, just the card processor's standard fee.",
    otherPlatforms: "Other platforms",
    otherPlatformsPct: "20%",
    otherPlatformsCaption: "Commission on every job",
    gjejProLabel: "Gjej Pro",
    gjejProPct: "0%",
    gjejProCaption: "Platform commission",
    howKicker: "How it works",
    howHeading: "From sign-up to your first job.",
    step1Title: "Create your profile",
    step1Body:
      "Describe your experience, add the services you offer, set the areas you work in. 5 minutes total.",
    step2Title: "See open requests",
    step2Body:
      "Filter by category and city. Requests that match your profile show up automatically.",
    step3Title: "Submit your quote",
    step3Body: "Price, personal message, proposed timing. The client sees it and decides.",
    step4Title: "Work and build your reputation",
    step4Body:
      "Every good job brings a review. The more 5-star reviews, the more work in the future.",
    ctaTitle: "List your services on Gjej Pro.",
    ctaBody:
      "The sooner you create your profile, the more clients will see you. No commitment of any kind.",
    ctaButton: "Get started now, for free",
    earningsLabel: "This month's earnings",
    earningsAmount: "€2,840",
    earningsChange: "↑ +18% from last month",
    newRequestBadge: "New request that matches",
    jobTitle: "Faucet and water heater installation",
    jobLocation: "Tirana · Budget €50–120",
    jobPosted: "Posted 12 min ago",
    jobSubmit: "Submit your quote →",
    reviewerName: "Erjola T.",
    reviewTime: "2 days ago",
    reviewText: "“Excellent work. Very professional.”",
  },
};

type SearchParams = Promise<{ locale?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `${SITE.url}/per-profesionistet` },
  };
}

export default async function ForProfessionalsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const q = locale === "en" ? "?locale=en" : "";
  const qAmp = locale === "en" ? "&locale=en" : "";

  return (
    <>
      <PublicHeader locale={locale} />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <HeroDecoration variant="warm" />
          <CornerLines position="bottom-left" />
          <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone">
                  {t.heroKicker}
                </p>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mt-3 text-ink leading-[1.02]">
                  {t.heroTitleLine1}
                  <br />
                  <span className="italic text-forest">{t.heroTitleLine2}</span>
                </h1>
                <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
                  {t.heroBody}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/regjistrohu?role=freelancer${qAmp}`}>
                    <Button variant="primary" size="lg">
                      {t.ctaSignup}
                    </Button>
                  </Link>
                  <Link href={`/profesionistet${q}`}>
                    <Button variant="secondary" size="lg">
                      {t.ctaSeeExamples}
                    </Button>
                  </Link>
                </div>

              </div>

              {/* Layered card composition — pricing/earnings preview */}
              <div className="hidden lg:block relative h-[440px]">
                <ProsHeroIllustration t={t} />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <BenefitCard
              icon="cake"
              title={t.benefit1Title}
              body={t.benefit1Body}
            />
            <BenefitCard
              icon="key"
              title={t.benefit2Title}
              body={t.benefit2Body}
            />
            <BenefitCard
              icon="monitor"
              title={t.benefit3Title}
              body={t.benefit3Body}
            />
          </div>
        </section>

        <section className="border-t border-line bg-bg">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-3">
                  {t.commissionKicker}
                </p>
                <h2 className="font-display text-4xl sm:text-5xl text-ink leading-[1.05]">
                  {t.commissionHeadingPre}{" "}
                  <span className="italic text-forest">{t.commissionHeadingEm}</span>
                </h2>
                <p className="mt-5 text-base text-ink-muted leading-relaxed max-w-xl">
                  {t.commissionPara1Pre}
                  <strong>{t.commissionPara1Strong1}</strong>
                  {t.commissionPara1Mid}
                  <strong>{t.commissionPara1Strong2}</strong>
                  {t.commissionPara1Post}
                </p>
                <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-xl">
                  {t.commissionPara2Pre}
                  <strong>{t.commissionPara2Strong}</strong>
                  {t.commissionPara2Post}
                </p>
                <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-xl">
                  {t.commissionPara3}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-line bg-surface p-6 text-center shadow-md">
                  <div className="text-xs uppercase tracking-wider text-stone">
                    {t.otherPlatforms}
                  </div>
                  <div className="mt-3 font-display text-5xl numeric text-ink-muted line-through decoration-danger decoration-4">
                    {t.otherPlatformsPct}
                  </div>
                  <p className="mt-3 text-xs text-ink-muted">
                    {t.otherPlatformsCaption}
                  </p>
                </div>
                <div className="rounded-2xl border border-forest bg-forest text-white p-6 text-center shadow-md">
                  <div className="text-xs uppercase tracking-wider text-white/70">
                    {t.gjejProLabel}
                  </div>
                  <div className="mt-3 font-display text-5xl numeric">{t.gjejProPct}</div>
                  <p className="mt-3 text-xs text-white/80">
                    {t.gjejProCaption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface border-y border-line relative overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-[320px] h-[320px] rounded-full opacity-40"
            style={{ background: "radial-gradient(closest-side, rgba(31, 77, 58, 0.10), transparent)" }}
          />
          <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <p className="text-xs uppercase tracking-wider text-stone mb-2">
              {t.howKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              {t.howHeading}
            </h2>
            <ol className="mt-8 space-y-5">
              <Step n={1} title={t.step1Title} body={t.step1Body} />
              <Step n={2} title={t.step2Title} body={t.step2Body} />
              <Step n={3} title={t.step3Title} body={t.step3Body} />
              <Step n={4} title={t.step4Title} body={t.step4Body} />
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
                {t.ctaTitle}
              </h2>
              <p className="mt-3 text-white/80 max-w-2xl">
                {t.ctaBody}
              </p>
              <div className="mt-6">
                <Link href={`/regjistrohu?role=freelancer${qAmp}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="!bg-white !text-forest hover:!bg-white/90"
                  >
                    {t.ctaButton}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter locale={locale} />
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

function ProsHeroIllustration({ t }: { t: (typeof STRINGS)["sq"] }) {
  return (
    <>
      {/* Earnings card */}
      <div
        className="absolute right-0 top-4 w-[300px] rounded-2xl bg-surface shadow-xl border border-line p-5"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="text-[10px] uppercase tracking-wider text-stone">
          {t.earningsLabel}
        </div>
        <div className="mt-2 font-display text-4xl text-ink numeric">
          {t.earningsAmount}
        </div>
        <div className="mt-1 text-xs text-emerald font-medium numeric">
          {t.earningsChange}
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
          {t.newRequestBadge}
        </div>
        <h3 className="mt-2 font-display text-lg text-ink">
          {t.jobTitle}
        </h3>
        <div className="mt-2 text-xs text-stone">{t.jobLocation}</div>
        <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs">
          <span className="text-stone">{t.jobPosted}</span>
          <span className="text-forest font-medium">{t.jobSubmit}</span>
        </div>
      </div>

      {/* Review card — small accent */}
      <div
        className="absolute right-12 bottom-2 w-[220px] rounded-xl bg-forest text-white shadow-lg p-4"
        style={{ transform: "rotate(4deg)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Avatar name={t.reviewerName} size={28} />
          <div>
            <div className="text-xs font-medium">{t.reviewerName}</div>
            <div className="text-[10px] text-white/60">{t.reviewTime}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gold">
          {"★★★★★".split("").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <p className="mt-1 text-xs text-white/80 leading-snug">
          {t.reviewText}
        </p>
      </div>
    </>
  );
}
