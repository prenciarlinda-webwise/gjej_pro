import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { SITE } from "@/lib/server-api";

const STRINGS = {
  sq: {
    metaTitle: `Rreth nesh | ${SITE.name}`,
    metaDescription:
      "Misioni i Gjej Pro: të lidhë çdo familje shqiptare me profesionistët e duhur, me transparencë dhe besim. Mësoni më shumë rreth ekipit dhe vlerave tona.",
    heroKicker: "Rreth nesh",
    heroTitlePre: "Profesionistë ",
    heroTitleEm: "për ju.",
    heroTitleLine2: "Që në vitin 2021.",
    heroBody:
      "Gjej Pro lindi nga një ide e thjeshtë: të gjithë meritojnë qasje të lehtë te mjeshtra të besueshëm. Po ndërtojmë një platformë që lidh familjet shqiptare me profesionistët e duhur, pa stres dhe pa angazhime të fshehura. Falas për të gjithë shqiptarët, kudo që janë, në gjithë globin.",
    missionTitle: "Misioni ynë",
    missionBody:
      "Të bëjmë gjetjen e një profesionisti të mirë po aq të thjeshtë sa porositja e një kafe. Çdo klient meriton transparencë në çmime, vlerësime reale, dhe mundësi për të krahasuar para se të vendosë.",
    visionTitle: "Vizioni ynë",
    visionBody:
      "Të jemi platforma më e besueshme në Shqipëri për shërbimet në shtëpi e biznes, dhe pastaj ta zgjerojmë këtë model në të gjithë rajonin, duke filluar nga Mbretëria e Bashkuar.",
    valuesTitle: "Vlerat tona",
    value1Title: "Transparencë",
    value1Body:
      "Pa komisione të fshehura. Çmimi që paguani është çmimi që ofron profesionisti.",
    value2Title: "Besueshmëri",
    value2Body:
      "Çdo profesionist verifikohet para se të lejohet të dorëzojë oferta. Identitet, kompani, dokumente: gjithçka kontrollohet.",
    value3Title: "Cilësi",
    value3Body:
      "Vlerësimet e vërteta nga klientët e mëparshëm janë guri themeltar i platformës. Pa fake reviews.",
    value4Title: "Komuniteti",
    value4Body:
      "Ne nuk jemi thjesht një teknologji. Jemi pjesë e komunitetit shqiptar dhe punojmë çdo ditë për ta bërë atë më të mirë.",
    joinTitle: "Bëhuni pjesë e Gjej Pro",
    joinBody:
      "Si klient apo si profesionist, krijoni llogarinë tuaj në pak minuta dhe filloni.",
    ctaClient: "Regjistrohu si klient",
    ctaFreelancer: "Regjistrohu si profesionist",
  },
  en: {
    metaTitle: `About us | ${SITE.name}`,
    metaDescription:
      "Gjej Pro's mission: connecting every Albanian family with the right professionals, with transparency and trust. Learn more about our team and values.",
    heroKicker: "About us",
    heroTitlePre: "Professionals ",
    heroTitleEm: "for you.",
    heroTitleLine2: "Since 2021.",
    heroBody:
      "Gjej Pro was born from a simple idea: everyone deserves easy access to professionals they can trust. We're building a platform that connects Albanian families with the right professionals, without stress or hidden commitments. Free for all Albanians, wherever they are around the globe.",
    missionTitle: "Our mission",
    missionBody:
      "To make finding a good professional as easy as ordering a coffee. Every client deserves transparent pricing, real reviews, and the ability to compare before deciding.",
    visionTitle: "Our vision",
    visionBody:
      "To be the most trusted platform in Albania for home and business services, then expand this model across the region, starting with the United Kingdom.",
    valuesTitle: "Our values",
    value1Title: "Transparency",
    value1Body:
      "No hidden commissions. The price you pay is the price the professional offers.",
    value2Title: "Trust",
    value2Body:
      "Every professional is verified before they're allowed to submit quotes. Identity, company, documents: everything is checked.",
    value3Title: "Quality",
    value3Body:
      "Genuine reviews from past clients are the cornerstone of the platform. No fake reviews.",
    value4Title: "Community",
    value4Body:
      "We're not just a piece of technology. We're part of the Albanian community, and we work every day to make it better.",
    joinTitle: "Join Gjej Pro",
    joinBody:
      "As a client or as a professional, create your account in minutes and get started.",
    ctaClient: "Sign up as a client",
    ctaFreelancer: "Sign up as a professional",
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
    alternates: { canonical: `${SITE.url}/rreth-nesh` },
  };
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const qAmp = locale === "en" ? "&locale=en" : "";

  return (
    <>
      <PublicHeader locale={locale} />
      <main className="flex-1">
        <section className="bg-gradient-warm">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
            <p className="text-xs uppercase tracking-wider text-stone">{t.heroKicker}</p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 text-ink leading-[1.05]">
              {t.heroTitlePre}
              <span className="italic text-forest">{t.heroTitleEm}</span>
              <br />
              {t.heroTitleLine2}
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-2xl leading-relaxed">
              {t.heroBody}
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl text-ink">{t.missionTitle}</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              {t.missionBody}
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink">{t.visionTitle}</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              {t.visionBody}
            </p>
          </div>
        </section>

        <section className="bg-surface border-y border-line">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
            <h2 className="font-display text-3xl text-ink">{t.valuesTitle}</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Value title={t.value1Title} body={t.value1Body} />
              <Value title={t.value2Title} body={t.value2Body} />
              <Value title={t.value3Title} body={t.value3Body} />
              <Value title={t.value4Title} body={t.value4Body} />
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 pb-20 pt-16">
          <div className="card p-8 sm:p-10 text-center">
            <h2 className="font-display text-3xl text-ink">
              {t.joinTitle}
            </h2>
            <p className="mt-3 text-ink-muted max-w-xl mx-auto">
              {t.joinBody}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href={`/regjistrohu?role=klient${qAmp}`}>
                <Button variant="primary" size="lg">
                  {t.ctaClient}
                </Button>
              </Link>
              <Link href={`/regjistrohu?role=freelancer${qAmp}`}>
                <Button variant="secondary" size="lg">
                  {t.ctaFreelancer}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter locale={locale} />
    </>
  );
}

function Value({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}
