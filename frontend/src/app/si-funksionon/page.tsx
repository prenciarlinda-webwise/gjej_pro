import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { HeroDecoration, CornerLines } from "@/components/HeroDecoration";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Si funksionon Gjej Pro | ${SITE.name}`,
  description:
    "Si të gjeni profesionistin e duhur në Shqipëri me Gjej Pro: postoni kërkesën, merrni oferta nga mjeshtra të verifikuar, zgjidhni më të mirin.",
  alternates: { canonical: `${SITE.url}/si-funksionon` },
};

export default function HowItWorksPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="relative">
          <HeroDecoration variant="warm" />
          <CornerLines position="top-right" />
          <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
            <p className="text-xs uppercase tracking-wider text-stone">
              Si funksionon
            </p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 text-ink leading-[1.05]">
              Nga kërkesa tek puna e përfunduar.
              <br />
              <span className="italic text-forest">Në 3 hapa.</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl leading-relaxed">
              Gjej Pro ndërton urën midis klientëve dhe profesionistëve të
              verifikuar në Shqipëri. Pa pagesë mujore, pa komisione të fshehura.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#per-klientet"
                className="text-sm font-medium text-forest border border-forest/30 bg-forest/5 rounded-full px-4 py-2 hover:bg-forest/10"
              >
                Jam klient
              </a>
              <a
                href="#per-profesionistet"
                className="text-sm font-medium text-forest border border-forest/30 bg-forest/5 rounded-full px-4 py-2 hover:bg-forest/10"
              >
                Jam profesionist
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
              Për klientët
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-ink leading-tight">
              Si të gjeni profesionistin e duhur, në 3 hapa.
            </h2>
          </div>
          <div className="space-y-6">
            <StepCard
              n={1}
              title="Postoni kërkesën tuaj"
              icon="bolt"
              tint="rgba(31, 77, 58, 0.08)"
              tintFg="#1F4D3A"
            >
              Përshkruani shkurt punën që dëshironi: kategoria (
              <Link href="/kategorite" className="text-forest hover:underline">
                shihni 22 kategori
              </Link>
              ), qyteti, buxheti i preferuar, dhe çdo detaj që mund të ndihmojë
              profesionistët të kuptojnë skenarin tuaj. Sa më e qartë kërkesa,
              aq më të mira ofertat.
            </StepCard>

            <StepCard
              n={2}
              title="Merrni oferta nga profesionistë"
              icon="utensils"
              tint="rgba(46, 125, 91, 0.08)"
              tintFg="#2E7D5B"
            >
              Profesionistët në kategorinë dhe zonën tuaj shohin kërkesën dhe
              dorëzojnë ofertën e tyre, me çmim dhe propozim konkret. Mund t&apos;u
              dërgoni mesazh para se të vendosni, për të sqaruar pikat e
              paqarta.
            </StepCard>

            <StepCard
              n={3}
              title="Zgjidhni dhe nisni punën"
              icon="hammer"
              tint="rgba(201, 169, 97, 0.10)"
              tintFg="#A88847"
            >
              Krahasoni çmimet, lexoni{" "}
              <span className="font-medium">vlerësimet reale</span> nga klientë
              të mëparshëm, dhe pranoni ofertën që ju përshtatet më mirë. Pasi
              puna përfundon, mund të lini një vlerësim që ndihmon komunitetin.
            </StepCard>
          </div>
        </section>

        <section
          id="per-profesionistet"
          className="max-w-5xl mx-auto px-6 sm:px-8 pt-12 pb-6 scroll-mt-24"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-stone">
              Për profesionistët
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-ink leading-tight">
              Si të merrni klientë, në 4 hapa.
            </h2>
            <p className="mt-3 text-base text-ink-muted max-w-2xl">
              Pa pagesë mujore. Pa abonime. Gjej Pro nuk merr përqindje nga
              vlera e punës.
            </p>
          </div>
          <div className="space-y-6">
            <StepCard
              n={1}
              title="Krijoni profilin tuaj"
              icon="monitor"
              tint="rgba(31, 77, 58, 0.08)"
              tintFg="#1F4D3A"
            >
              Përshkruani eksperiencën, listoni shërbimet që ofroni dhe caktoni
              zonat ku punoni. Shtoni një foto profili dhe (opsionalisht)
              kompaninë tuaj. Verifikimi i identitetit bëhet brenda pak ditëve.
            </StepCard>

            <StepCard
              n={2}
              title="Shihni kërkesat e hapura"
              icon="book"
              tint="rgba(46, 125, 91, 0.08)"
              tintFg="#2E7D5B"
            >
              Filtroni sipas kategorisë dhe qytetit. Shfaqen automatikisht
              kërkesat që përshtaten me profilin tuaj. Mund t&apos;u dërgoni
              mesazh klientëve për detaje shtesë para se të dorëzoni një
              ofertë.
            </StepCard>

            <StepCard
              n={3}
              title="Dorëzoni ofertën tuaj"
              icon="cake"
              tint="rgba(201, 169, 97, 0.10)"
              tintFg="#A88847"
            >
              Çmim, mesazh personal, kohë e propozuar. Klienti shikon dhe
              vendos. Çmimi që ofroni është çmimi që merrni:{" "}
              <span className="font-medium">100% e tij është e juaja.</span>
            </StepCard>

            <StepCard
              n={4}
              title="Punoni dhe ndërtoni reputacionin"
              icon="hammer"
              tint="rgba(31, 77, 58, 0.08)"
              tintFg="#1F4D3A"
            >
              Çdo punë e mirë sjell një vlerësim të vërtetë (vetëm klientët që
              kanë përfunduar një punë mund të vlerësojnë). Sa më shumë
              vlerësime pozitive, aq më shumë vizibilitet dhe punë në të
              ardhmen.
            </StepCard>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-6 pb-12">
          <div className="rounded-2xl border border-forest/20 bg-forest/5 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-wider text-forest font-semibold">
              S&apos;ka rëndësi cili vjen i pari
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-ink mt-2 leading-tight">
              Të dyja anët mund të kërkojnë njëra-tjetrën.
            </h3>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-ink-muted leading-relaxed">
              <div>
                <p className="font-medium text-ink mb-1">
                  Klient pa pritur ofertat?
                </p>
                <p>
                  Mund të{" "}
                  <Link
                    href="/profesionistet"
                    className="text-forest font-medium hover:underline"
                  >
                    shfletoni profesionistët
                  </Link>{" "}
                  direkt, t&apos;i filtroni sipas kategorisë, qytetit ose
                  vendndodhjes suaj, dhe t&apos;i kontaktoni një nga një pa
                  postuar fare një kërkesë.
                </p>
              </div>
              <div>
                <p className="font-medium text-ink mb-1">
                  Profesionist pa kërkesa ende?
                </p>
                <p>
                  Profili juaj është i dukshëm publikisht në Gjej Pro që në
                  ditën e parë. Klientët mund t&apos;ju gjejnë drejtpërdrejt
                  përmes kategorive dhe qyteteve dhe t&apos;ju kontaktojnë
                  pa postuar kërkesë.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface border-y border-line relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full opacity-50"
               style={{ background: "radial-gradient(closest-side, rgba(46, 125, 91, 0.10), transparent)" }} />
          <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <p className="text-xs uppercase tracking-wider text-stone mb-2">
              Avantazhet
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Pse të zgjidhni Gjej Pro?
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <BenefitCard
                title="Profesionistë të verifikuar"
                body="Identiteti dhe kompania e tyre kontrollohen para se të lejohen të dorëzojnë oferta."
                icon="key"
              />
              <BenefitCard
                title="Vlerësime reale"
                body="Vetëm klientët që kanë përfunduar një punë mund të lënë vlerësim. Pa false reviews."
                icon="book"
              />
              <BenefitCard
                title="Pa pagesa të fshehura"
                body="Klientët nuk paguajnë asnjë komision Gjej Pro. Çmimi që ofron profesionisti është çmimi që paguani."
                icon="cake"
              />
              <BenefitCard
                title="Komunikim direkt"
                body="Mesazhe brenda platformës. Sqaroni detajet para se të pranoni një ofertë."
                icon="monitor"
              />
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
          <div className="bg-gradient-forest text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-30"
                 style={{ background: "radial-gradient(closest-side, rgba(201, 169, 97, 0.30), transparent)" }} />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl">Gati për të nisur?</h2>
              <p className="mt-3 text-white/80 max-w-2xl">
                Krijoni një llogari falas, si klient ose si profesionist.
                Asnjë kosto, asnjë angazhim.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/regjistrohu?role=klient">
                  <Button
                    variant="primary"
                    size="lg"
                    className="!bg-white !text-forest hover:!bg-white/90"
                  >
                    Regjistrohu si klient
                  </Button>
                </Link>
                <Link href="/regjistrohu?role=freelancer">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="!bg-transparent !text-white !border-white/40 hover:!bg-white/10"
                  >
                    Regjistrohu si profesionist
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
