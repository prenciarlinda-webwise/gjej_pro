import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { HeroDecoration, CornerLines } from "@/components/HeroDecoration";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { SITE } from "@/lib/server-api";

const STRINGS = {
  sq: {
    metaTitle: `Si funksionon Gjej Pro | ${SITE.name}`,
    metaDescription:
      "Si të gjeni profesionistin e duhur në Shqipëri me Gjej Pro: postoni kërkesën, merrni oferta nga mjeshtra të verifikuar, zgjidhni më të mirin.",
    heroKicker: "Si funksionon",
    heroTitleLine1: "Nga kërkesa tek puna e përfunduar.",
    heroTitleLine2: "Në 3 hapa.",
    heroBody:
      "Gjej Pro ndërton urën midis klientëve dhe profesionistëve të verifikuar në Shqipëri. Pa pagesë mujore, pa komisione të fshehura.",
    imClient: "Jam klient",
    imProfessional: "Jam profesionist",
    forClientsKicker: "Për klientët",
    forClientsHeading: "Si të gjeni profesionistin e duhur, në 3 hapa.",
    clientStep1Title: "Postoni kërkesën tuaj",
    clientStep1PreLink: "Përshkruani shkurt punën që dëshironi: kategoria (",
    clientStep1LinkText: "shihni 22 kategori",
    clientStep1PostLink:
      "), qyteti, buxheti i preferuar, dhe çdo detaj që mund të ndihmojë profesionistët të kuptojnë skenarin tuaj. Sa më e qartë kërkesa, aq më të mira ofertat.",
    clientStep2Title: "Merrni oferta nga profesionistë",
    clientStep2Body:
      "Profesionistët në kategorinë dhe zonën tuaj shohin kërkesën dhe dorëzojnë ofertën e tyre, me çmim dhe propozim konkret. Mund t'u dërgoni mesazh para se të vendosni, për të sqaruar pikat e paqarta.",
    clientStep3Title: "Zgjidhni dhe nisni punën",
    clientStep3PreEm: "Krahasoni çmimet, lexoni ",
    clientStep3Em: "vlerësimet reale",
    clientStep3PostEm:
      " nga klientë të mëparshëm, dhe pranoni ofertën që ju përshtatet më mirë. Pasi puna përfundon, mund të lini një vlerësim që ndihmon komunitetin.",
    forProsKicker: "Për profesionistët",
    forProsHeading: "Si të merrni klientë, në 4 hapa.",
    forProsSubheading:
      "Pa pagesë mujore. Pa abonime. Gjej Pro nuk merr përqindje nga vlera e punës.",
    proStep1Title: "Krijoni profilin tuaj",
    proStep1Body:
      "Përshkruani eksperiencën, listoni shërbimet që ofroni dhe caktoni zonat ku punoni. Shtoni një foto profili dhe (opsionalisht) kompaninë tuaj. Verifikimi i identitetit bëhet brenda pak ditëve.",
    proStep2Title: "Shihni kërkesat e hapura",
    proStep2Body:
      "Filtroni sipas kategorisë dhe qytetit. Shfaqen automatikisht kërkesat që përshtaten me profilin tuaj. Mund t'u dërgoni mesazh klientëve për detaje shtesë para se të dorëzoni një ofertë.",
    proStep3Title: "Dorëzoni ofertën tuaj",
    proStep3PreEm: "Çmim, mesazh personal, kohë e propozuar. Klienti shikon dhe vendos. Çmimi që ofroni është çmimi që merrni: ",
    proStep3Em: "100% e tij është e juaja.",
    proStep3PostEm: "",
    proStep4Title: "Punoni dhe ndërtoni reputacionin",
    proStep4Body:
      "Çdo punë e mirë sjell një vlerësim të vërtetë (vetëm klientët që kanë përfunduar një punë mund të vlerësojnë). Sa më shumë vlerësime pozitive, aq më shumë vizibilitet dhe punë në të ardhmen.",
    eitherFirstKicker: "S'ka rëndësi cili vjen i pari",
    eitherFirstHeading: "Të dyja anët mund të kërkojnë njëra-tjetrën.",
    clientNoQuotesTitle: "Klient pa pritur ofertat?",
    clientNoQuotesPreLink: "Mund të ",
    clientNoQuotesLinkText: "shfletoni profesionistët",
    clientNoQuotesPostLink:
      " direkt, t'i filtroni sipas kategorisë, qytetit ose vendndodhjes suaj, dhe t'i kontaktoni një nga një pa postuar fare një kërkesë.",
    proNoRequestsTitle: "Profesionist pa kërkesa ende?",
    proNoRequestsBody:
      "Profili juaj është i dukshëm publikisht në Gjej Pro që në ditën e parë. Klientët mund t'ju gjejnë drejtpërdrejt përmes kategorive dhe qyteteve dhe t'ju kontaktojnë pa postuar kërkesë.",
    benefitsKicker: "Avantazhet",
    benefitsHeading: "Pse të zgjidhni Gjej Pro?",
    benefit1Title: "Profesionistë të verifikuar",
    benefit1Body: "Identiteti dhe kompania e tyre kontrollohen para se të lejohen të dorëzojnë oferta.",
    benefit2Title: "Vlerësime reale",
    benefit2Body: "Vetëm klientët që kanë përfunduar një punë mund të lënë vlerësim. Pa false reviews.",
    benefit3Title: "Pa pagesa të fshehura",
    benefit3Body: "Klientët nuk paguajnë asnjë komision Gjej Pro. Çmimi që ofron profesionisti është çmimi që paguani.",
    benefit4Title: "Komunikim direkt",
    benefit4Body: "Mesazhe brenda platformës. Sqaroni detajet para se të pranoni një ofertë.",
    ctaTitle: "Gati për të nisur?",
    ctaBody: "Krijoni një llogari falas, si klient ose si profesionist. Asnjë kosto, asnjë angazhim.",
    ctaClient: "Regjistrohu si klient",
    ctaFreelancer: "Regjistrohu si profesionist",
  },
  en: {
    metaTitle: `How Gjej Pro works | ${SITE.name}`,
    metaDescription:
      "How to find the right Albanian professional with Gjej Pro: post your request, get quotes from verified pros, choose the best one.",
    heroKicker: "How it works",
    heroTitleLine1: "From request to finished job.",
    heroTitleLine2: "In 3 steps.",
    heroBody:
      "Gjej Pro bridges clients and verified Albanian professionals. No monthly fees, no hidden commissions.",
    imClient: "I'm a client",
    imProfessional: "I'm a professional",
    forClientsKicker: "For clients",
    forClientsHeading: "How to find the right professional, in 3 steps.",
    clientStep1Title: "Post your request",
    clientStep1PreLink: "Briefly describe the job you need: the category (",
    clientStep1LinkText: "see 22 categories",
    clientStep1PostLink:
      "), the city, your preferred budget, and any detail that helps professionals understand your situation. The clearer the request, the better the quotes.",
    clientStep2Title: "Get quotes from professionals",
    clientStep2Body:
      "Professionals in your category and area see the request and submit their quote, with a price and a concrete proposal. You can message them before deciding, to clarify anything unclear.",
    clientStep3Title: "Choose and start the job",
    clientStep3PreEm: "Compare prices, read ",
    clientStep3Em: "real reviews",
    clientStep3PostEm:
      " from past clients, and accept the quote that suits you best. Once the job is done, you can leave a review that helps the community.",
    forProsKicker: "For professionals",
    forProsHeading: "How to get clients, in 4 steps.",
    forProsSubheading:
      "No monthly fee. No subscriptions. Gjej Pro doesn't take a cut of the job's value.",
    proStep1Title: "Create your profile",
    proStep1Body:
      "Describe your experience, list the services you offer, and set the areas you work in. Add a profile photo and (optionally) your company. Identity verification is done within a few days.",
    proStep2Title: "See open requests",
    proStep2Body:
      "Filter by category and city. Requests that match your profile show up automatically. You can message clients for extra details before submitting a quote.",
    proStep3Title: "Submit your quote",
    proStep3PreEm:
      "Price, personal message, proposed timing. The client sees it and decides. The price you offer is the price you get: ",
    proStep3Em: "100% of it is yours.",
    proStep3PostEm: "",
    proStep4Title: "Work and build your reputation",
    proStep4Body:
      "Every good job brings a genuine review (only clients who've completed a job can leave one). The more positive reviews, the more visibility and future work.",
    eitherFirstKicker: "It doesn't matter who goes first",
    eitherFirstHeading: "Either side can search for the other.",
    clientNoQuotesTitle: "Client who doesn't want to wait for quotes?",
    clientNoQuotesPreLink: "You can ",
    clientNoQuotesLinkText: "browse professionals",
    clientNoQuotesPostLink:
      " directly, filter by category, city, or your location, and contact them one by one without posting a request at all.",
    proNoRequestsTitle: "Professional with no requests yet?",
    proNoRequestsBody:
      "Your profile is publicly visible on Gjej Pro from day one. Clients can find you directly through categories and cities and contact you without posting a request.",
    benefitsKicker: "Benefits",
    benefitsHeading: "Why choose Gjej Pro?",
    benefit1Title: "Verified professionals",
    benefit1Body: "Their identity and company are checked before they're allowed to submit quotes.",
    benefit2Title: "Real reviews",
    benefit2Body: "Only clients who've completed a job can leave a review. No fake reviews.",
    benefit3Title: "No hidden fees",
    benefit3Body: "Clients don't pay any Gjej Pro commission. The price the professional offers is the price you pay.",
    benefit4Title: "Direct communication",
    benefit4Body: "In-platform messaging. Clarify details before accepting a quote.",
    ctaTitle: "Ready to get started?",
    ctaBody: "Create a free account, as a client or as a professional. No cost, no commitment.",
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
    alternates: { canonical: `${SITE.url}/si-funksionon` },
  };
}

export default async function HowItWorksPage({
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
        <section className="relative">
          <HeroDecoration variant="warm" />
          <CornerLines position="top-right" />
          <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
            <p className="text-xs uppercase tracking-wider text-stone">
              {t.heroKicker}
            </p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 text-ink leading-[1.05]">
              {t.heroTitleLine1}
              <br />
              <span className="italic text-forest">{t.heroTitleLine2}</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl leading-relaxed">
              {t.heroBody}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#per-klientet"
                className="text-sm font-medium text-forest border border-forest/30 bg-forest/5 rounded-full px-4 py-2 hover:bg-forest/10"
              >
                {t.imClient}
              </a>
              <a
                href="#per-profesionistet"
                className="text-sm font-medium text-forest border border-forest/30 bg-forest/5 rounded-full px-4 py-2 hover:bg-forest/10"
              >
                {t.imProfessional}
              </a>
            </div>
          </div>
        </section>

        <section
          id="per-klientet"
          className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 pb-6 scroll-mt-24"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-stone">
              {t.forClientsKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-ink leading-tight">
              {t.forClientsHeading}
            </h2>
          </div>
          <div className="space-y-6">
            <StepCard
              n={1}
              title={t.clientStep1Title}
              icon="bolt"
              tint="rgba(31, 77, 58, 0.08)"
              tintFg="#1F4D3A"
            >
              {t.clientStep1PreLink}
              <Link href={`/kategorite${q}`} className="text-forest hover:underline">
                {t.clientStep1LinkText}
              </Link>
              {t.clientStep1PostLink}
            </StepCard>

            <StepCard
              n={2}
              title={t.clientStep2Title}
              icon="utensils"
              tint="rgba(46, 125, 91, 0.08)"
              tintFg="#2E7D5B"
            >
              {t.clientStep2Body}
            </StepCard>

            <StepCard
              n={3}
              title={t.clientStep3Title}
              icon="hammer"
              tint="rgba(201, 169, 97, 0.10)"
              tintFg="#A88847"
            >
              {t.clientStep3PreEm}
              <span className="font-medium">{t.clientStep3Em}</span>
              {t.clientStep3PostEm}
            </StepCard>
          </div>
        </section>

        <section
          id="per-profesionistet"
          className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 pb-6 scroll-mt-24"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-stone">
              {t.forProsKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-ink leading-tight">
              {t.forProsHeading}
            </h2>
            <p className="mt-3 text-base text-ink-muted max-w-2xl">
              {t.forProsSubheading}
            </p>
          </div>
          <div className="space-y-6">
            <StepCard
              n={1}
              title={t.proStep1Title}
              icon="monitor"
              tint="rgba(31, 77, 58, 0.08)"
              tintFg="#1F4D3A"
            >
              {t.proStep1Body}
            </StepCard>

            <StepCard
              n={2}
              title={t.proStep2Title}
              icon="book"
              tint="rgba(46, 125, 91, 0.08)"
              tintFg="#2E7D5B"
            >
              {t.proStep2Body}
            </StepCard>

            <StepCard
              n={3}
              title={t.proStep3Title}
              icon="cake"
              tint="rgba(201, 169, 97, 0.10)"
              tintFg="#A88847"
            >
              {t.proStep3PreEm}
              <span className="font-medium">{t.proStep3Em}</span>
              {t.proStep3PostEm}
            </StepCard>

            <StepCard
              n={4}
              title={t.proStep4Title}
              icon="hammer"
              tint="rgba(31, 77, 58, 0.08)"
              tintFg="#1F4D3A"
            >
              {t.proStep4Body}
            </StepCard>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-6 pb-12">
          <div className="rounded-2xl border border-forest/20 bg-forest/5 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-wider text-forest font-semibold">
              {t.eitherFirstKicker}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-ink mt-2 leading-tight">
              {t.eitherFirstHeading}
            </h3>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-ink-muted leading-relaxed">
              <div>
                <p className="font-medium text-ink mb-1">
                  {t.clientNoQuotesTitle}
                </p>
                <p>
                  {t.clientNoQuotesPreLink}
                  <Link
                    href={`/profesionistet${q}`}
                    className="text-forest font-medium hover:underline"
                  >
                    {t.clientNoQuotesLinkText}
                  </Link>
                  {t.clientNoQuotesPostLink}
                </p>
              </div>
              <div>
                <p className="font-medium text-ink mb-1">
                  {t.proNoRequestsTitle}
                </p>
                <p>{t.proNoRequestsBody}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface border-y border-line relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full opacity-50"
               style={{ background: "radial-gradient(closest-side, rgba(46, 125, 91, 0.10), transparent)" }} />
          <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <p className="text-xs uppercase tracking-wider text-stone mb-2">
              {t.benefitsKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              {t.benefitsHeading}
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <BenefitCard title={t.benefit1Title} body={t.benefit1Body} icon="key" />
              <BenefitCard title={t.benefit2Title} body={t.benefit2Body} icon="book" />
              <BenefitCard title={t.benefit3Title} body={t.benefit3Body} icon="cake" />
              <BenefitCard title={t.benefit4Title} body={t.benefit4Body} icon="monitor" />
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
          <div className="bg-gradient-forest text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-30"
                 style={{ background: "radial-gradient(closest-side, rgba(201, 169, 97, 0.30), transparent)" }} />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl">{t.ctaTitle}</h2>
              <p className="mt-3 text-white/80 max-w-2xl">{t.ctaBody}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={`/regjistrohu?role=klient${qAmp}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="!bg-white !text-forest hover:!bg-white/90"
                  >
                    {t.ctaClient}
                  </Button>
                </Link>
                <Link href={`/regjistrohu?role=freelancer${qAmp}`}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="!bg-transparent !text-white !border-white/40 hover:!bg-white/10"
                  >
                    {t.ctaFreelancer}
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

function StepCard({
  n,
  title,
  icon,
  tint,
  tintFg,
  children,
}: {
  n: number;
  title: string;
  icon: string;
  tint: string;
  tintFg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-7 sm:p-8 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6 items-start">
      <div
        className="font-display text-5xl numeric leading-none"
        style={{ color: "rgba(11,16,20,0.10)" }}
      >
        0{n}
      </div>
      <div>
        <h3 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-base text-ink-muted leading-relaxed">
          {children}
        </p>
      </div>
      <div
        className="hidden sm:inline-flex items-center justify-center rounded-2xl"
        style={{
          width: 80,
          height: 80,
          backgroundColor: tint,
          color: tintFg,
        }}
      >
        <CategoryIcon slug={icon} size={36} />
      </div>
    </div>
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
          width: 44,
          height: 44,
          backgroundColor: "rgba(31, 77, 58, 0.08)",
          color: "var(--color-forest)",
        }}
      >
        <CategoryIcon slug={icon} size={22} />
      </div>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}
