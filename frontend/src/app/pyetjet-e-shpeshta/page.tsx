import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/structured-data";
import { SITE } from "@/lib/server-api";

const STRINGS = {
  sq: {
    metaTitle: `Pyetjet e shpeshta | ${SITE.name}`,
    metaDescription:
      "Përgjigje për pyetjet më të shpeshta rreth Gjej Pro: si funksionon, si paguani, si verifikohen profesionistët, dhe më shumë.",
    kicker: "Pyetjet e shpeshta",
    title: "Përgjigje për pyetjet më të zakonshme.",
    subtitle:
      "Gjithçka që duhet të dini për Gjej Pro: si funksionon, si regjistroheni, si paguhen profesionistët, dhe çfarë po vjen më pas.",
    calloutKicker: "E rëndësishme",
    calloutTitle: "0% komision platforme.",
    calloutBody: (
      <>
        Gjej Pro nuk merr asnjë përqindje nga vlera e punës apo nga
        pagesa e klientëve. Pa abonime, pa tarifa, pa &ldquo;premium
        plan&rdquo;. Çmimi i ofertës është çmimi që merr profesionisti.
        Kur vjen aplikacioni, do të mund të paguani online direkt
        brenda platformës: vetëm tarifa standarde e procesorit të
        kartës, asgjë për Gjej Pro.
      </>
    ),
    ctaTitle: "Gati për të filluar?",
    ctaBody: "Krijoni llogarinë tuaj falas dhe shihni Gjej Pro nga brenda.",
    ctaButton: "Filloni tani",
  },
  en: {
    metaTitle: `FAQ | ${SITE.name}`,
    metaDescription:
      "Answers to the most common questions about Gjej Pro: how it works, how payment works, how professionals are verified, and more.",
    kicker: "FAQ",
    title: "Answers to the most common questions.",
    subtitle:
      "Everything you need to know about Gjej Pro: how it works, how to sign up, how professionals get paid, and what's coming next.",
    calloutKicker: "Important",
    calloutTitle: "0% platform commission.",
    calloutBody: (
      <>
        Gjej Pro doesn&apos;t take any percentage from the value of the
        job or from client payments. No subscriptions, no fees, no
        &ldquo;premium plan.&rdquo; The price of the quote is the price
        the professional receives. When the app arrives, you&apos;ll be
        able to pay online directly within the platform: just the
        standard card processor fee, nothing for Gjej Pro.
      </>
    ),
    ctaTitle: "Ready to get started?",
    ctaBody: "Create your free account and see Gjej Pro from the inside.",
    ctaButton: "Get started",
  },
};

const SECTIONS: Record<
  "sq" | "en",
  Array<{
    heading: string;
    qa: Array<{ q: string; a: string }>;
  }>
> = {
  sq: [
    {
      heading: "Për klientët",
      qa: [
        {
          q: "A duhet të paguaj diçka për të përdorur Gjej Pro?",
          a: "Jo. Postimi i kërkesave dhe kontaktimi i profesionistëve është krejt falas. Nuk ka komisione apo abonime për klientët.",
        },
        {
          q: "Si i marr ofertat?",
          a: "Pasi postoni kërkesën, profesionistët në kategorinë dhe qytetin tuaj do ta shohin atë dhe mund të dorëzojnë çmim e propozim. Zakonisht oferta e parë vjen brenda orëve.",
        },
        {
          q: "A mund t'u dërgoj mesazhe profesionistëve para se të vendos?",
          a: "Po. Çdo profesionist mund të kontaktohet përmes mesazheve brenda platformës. Sqaroni detajet pa lënë Gjej Pro.",
        },
        {
          q: "Si paguaj profesionistin?",
          a: "Sot pagesa bëhet direkt me profesionistin (cash, transfertë, sipas marrëveshjes). Gjej Pro nuk ndërhyn dhe nuk mban asnjë përqindje. Së shpejti, me aplikacionin për iOS dhe Android, do të mund të paguani online direkt brenda platformës: klient → profesionist, pa komision, pa ndërmjetës.",
        },
      ],
    },
    {
      heading: "Për profesionistët",
      qa: [
        {
          q: "Sa kushton të jem pjesë e Gjej Pro?",
          a: "Asgjë. Krijimi i profilit, listimi i shërbimeve dhe dorëzimi i ofertave janë krejt falas. Pa pagesë mujore, pa angazhim. Dhe ndryshe nga platformat e tjera që marrin deri në 20% komision, Gjej Pro nuk mban asnjë përqindje nga puna juaj. 100% e çmimit shkon te ju.",
        },
        {
          q: "Si më gjejnë klientët?",
          a: "Klientët mund t'ju gjejnë në dy mënyra: (1) duke shfletuar listën e profesionistëve dhe duke ju kontaktuar direkt, ose (2) duke postuar kërkesa publike që ju mund t'i shihni dhe t'i ofertoni.",
        },
        {
          q: "Si verifikohem?",
          a: "Pasi krijoni profilin, ekipi ynë verifikon identitetin tuaj dhe (nëse keni një kompani) dokumentet e regjistrimit. Profilet e verifikuara marrin një shenjë të dukshme që rrit besimin e klientëve.",
        },
        {
          q: "A mund të refuzoj një kërkesë?",
          a: "Po, gjithmonë. Ju vendosni kë të ofertoni dhe asnjëherë nuk jeni i detyruar të pranoni një punë.",
        },
      ],
    },
    {
      heading: "Sigurinë & privatësinë",
      qa: [
        {
          q: "A i ndan Gjej Pro të dhënat e mia me palë të treta?",
          a: "Jo. Adresa juaj e emailit, numri i telefonit dhe adresa fizike nuk u shfaqen përdoruesve të tjerë publikisht. Profesionistët shohin emrin tuaj vetëm pasi ju i kontaktoni ata.",
        },
        {
          q: "Si janë mbrojtur vlerësimet nga abuzimi?",
          a: "Vetëm klientët që kanë përfunduar një punë mund të lënë vlerësim. Kjo eliminon vlerësimet false dhe siguron që çdo yll ka peshë reale.",
        },
        {
          q: "Çfarë ndodh nëse kam një problem me një profesionist?",
          a: "Mund të kontaktoni ekipin tonë të suportit. Ne hetojmë çdo raportim dhe mund të suspendojmë profilet që shkelin rregullat e platformës.",
        },
      ],
    },
  ],
  en: [
    {
      heading: "For clients",
      qa: [
        {
          q: "Do I have to pay anything to use Gjej Pro?",
          a: "No. Posting requests and contacting professionals is completely free. There are no commissions or subscriptions for clients.",
        },
        {
          q: "How do I get quotes?",
          a: "Once you post your request, professionals in your category and city will see it and can submit a price and proposal. The first quote usually arrives within hours.",
        },
        {
          q: "Can I message professionals before deciding?",
          a: "Yes. Every professional can be contacted through in-platform messaging. Clarify the details without ever leaving Gjej Pro.",
        },
        {
          q: "How do I pay the professional?",
          a: "Today, payment is made directly to the professional (cash, bank transfer, or however you agree). Gjej Pro doesn't get involved and doesn't take a cut. Soon, with the iOS and Android app, you'll be able to pay online directly within the platform: client to professional, no commission, no middleman.",
        },
      ],
    },
    {
      heading: "For professionals",
      qa: [
        {
          q: "How much does it cost to be on Gjej Pro?",
          a: "Nothing. Creating a profile, listing your services, and submitting quotes are all completely free. No monthly fee, no commitment. And unlike other platforms that take up to 20% commission, Gjej Pro doesn't keep any percentage of your work. 100% of the price goes to you.",
        },
        {
          q: "How do clients find me?",
          a: "Clients can find you in two ways: (1) by browsing the list of professionals and contacting you directly, or (2) by posting public requests that you can view and submit a quote for.",
        },
        {
          q: "How do I get verified?",
          a: "Once you create your profile, our team verifies your identity and (if you have a company) its registration documents. Verified profiles get a visible badge that increases client trust.",
        },
        {
          q: "Can I turn down a request?",
          a: "Yes, always. You decide who to send a quote to, and you're never obligated to accept a job.",
        },
      ],
    },
    {
      heading: "Security & privacy",
      qa: [
        {
          q: "Does Gjej Pro share my data with third parties?",
          a: "No. Your email address, phone number, and physical address are never shown publicly to other users. Professionals see your name only after you contact them.",
        },
        {
          q: "How are reviews protected from abuse?",
          a: "Only clients who've completed a job can leave a review. This eliminates fake reviews and ensures every star rating carries real weight.",
        },
        {
          q: "What happens if I have a problem with a professional?",
          a: "You can contact our support team. We investigate every report and may suspend profiles that violate the platform's rules.",
        },
      ],
    },
  ],
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
    alternates: { canonical: `${SITE.url}/pyetjet-e-shpeshta` },
  };
}

export default async function FaqPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const q = locale === "en" ? "?locale=en" : "";
  const sections = SECTIONS[locale];
  const allQa = sections.flatMap((s) => s.qa);

  return (
    <>
      <JsonLd data={faqPageSchema(allQa)} />
      <PublicHeader locale={locale} />
      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-xs uppercase tracking-wider text-stone">{t.kicker}</p>
        <h1 className="font-display text-5xl mt-3 text-ink leading-[1.05]">
          {t.title}
        </h1>
        <p className="mt-4 text-base text-ink-muted max-w-2xl">
          {t.subtitle}
        </p>

        <div className="mt-10 rounded-2xl bg-forest text-white p-6 sm:p-7 shadow-md">
          <div className="text-xs uppercase tracking-wider text-white/70">
            {t.calloutKicker}
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">
            {t.calloutTitle}
          </h2>
          <p className="mt-3 text-sm text-white/85 leading-relaxed max-w-2xl">
            {t.calloutBody}
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="font-display text-2xl text-ink mb-5">
                {sec.heading}
              </h2>
              <div className="space-y-3">
                {sec.qa.map((item, i) => (
                  <details
                    key={i}
                    className="card p-5 group"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                      <span className="font-medium text-ink">{item.q}</span>
                      <span className="shrink-0 text-stone group-open:rotate-180 transition-transform">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 card p-8 text-center">
          <h2 className="font-display text-2xl text-ink">
            {t.ctaTitle}
          </h2>
          <p className="mt-2 text-ink-muted">
            {t.ctaBody}
          </p>
          <div className="mt-5">
            <Link href={`/regjistrohu${q}`}>
              <Button variant="primary" size="lg">
                {t.ctaButton}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter locale={locale} />
    </>
  );
}
