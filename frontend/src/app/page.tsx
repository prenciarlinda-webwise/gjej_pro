import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { FreelancerCard } from "@/components/FreelancerCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { ReadOnlyStars } from "@/components/StarRating";
import { serverApi, SITE, hreflangAlternates } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `${SITE.name} | Profesionistë të verifikuar në Shqipëri`,
  description: SITE.description,
  alternates: { canonical: SITE.url, languages: hreflangAlternates("") },
  openGraph: {
    title: `${SITE.name} | Profesionistë për ju`,
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
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink leading-[1.02]">
                  Gjej mjeshtrin{" "}
                  <span className="italic text-forest">e duhur.</span>
                  <br />
                  Sot.
                </h1>
                <p className="mt-6 text-lg text-ink-muted max-w-xl leading-relaxed">
                  Mijëra profesionistë të verifikuar: elektricistë, hidraulikë,
                  bravandreqës, pastrues, gati t&apos;ju ndihmojnë në çdo punë
                  në shtëpi apo biznes.
                </p>
                <p className="mt-3 text-sm font-medium text-forest max-w-xl">
                  Falas për të gjithë shqiptarët, kudo që janë, në gjithë globin.
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
              Si klient apo si profesionist, gjeni njëri-tjetrin lehtë.
            </h2>
            <p className="mt-3 text-ink-muted max-w-2xl">
              S&apos;ka rëndësi cili regjistrohet i pari: të dyja anët mund të
              kërkojnë dhe kontaktojnë drejtpërdrejt njëra-tjetrën.
            </p>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-3">
                  Për klientët
                </p>
                <div className="space-y-4">
                  <Step
                    n={1}
                    title="Postoni kërkesën ose shfletoni"
                    body="Përshkruani punën që ju duhet, ose shfletoni listën e profesionistëve dhe kontaktoni direkt."
                  />
                  <Step
                    n={2}
                    title="Merrni oferta"
                    body="Profesionistët dorëzojnë çmim dhe propozim. Krahasoni dhe komunikoni në platformë."
                  />
                  <Step
                    n={3}
                    title="Zgjidhni dhe nisni"
                    body="Shihni profilet, lexoni vlerësimet, pranoni më të mirën dhe lëreni një vlerësim pas punës."
                  />
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-stone mb-3">
                  Për profesionistët
                </p>
                <div className="space-y-4">
                  <Step
                    n={1}
                    title="Krijoni profilin"
                    body="Listoni shërbimet, kategoritë, zonat ku punoni. Profili juaj është i dukshëm publikisht."
                  />
                  <Step
                    n={2}
                    title="Shfletoni kërkesat"
                    body="Filtroni sipas kategorisë dhe qytetit. Dorëzoni ofertën tuaj me çmim e mesazh."
                  />
                  <Step
                    n={3}
                    title="Punoni dhe ndërtoni reputacionin"
                    body="Vlerësimet reale nga klientët ju sjellin më shumë punë. 0% komision Gjej Pro."
                  />
                </div>
              </div>
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

        <NoCommissionSection />

        <section className="bg-gradient-forest text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
              <BigStat value="0%" label="Komision platforme" />
              <BigStat value="Falas" label="Për të gjithë shqiptarët" />
              <BigStat value="22" label="Kategori shërbimesh" />
              <BigStat value="Kudo" label="Në botë, kudo që janë" />
            </div>
          </div>
        </section>

        <AppComingSection />

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
                quote="Mora 4 oferta brenda 2 orësh. Krahasova çmimet dhe zgjodha më të mirën, pa stres."
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
                  Krijoni profilin tuaj. Filloni të merrni punë.
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
        <div className="text-[10px] uppercase tracking-wider text-stone">
          Profesionist
        </div>
        <h3 className="mt-1 font-display text-lg text-ink">
          I verifikuar pranë jush
        </h3>
        <p className="mt-2 text-xs text-stone">
          Shihni profilin, vlerësimet dhe çmimet para se të kontaktoni.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Elektricist", "Hidraulik", "Pastrim"].map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider text-forest bg-forest/10 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
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

function NoCommissionSection() {
  return (
    <section className="border-y border-line bg-bg">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone mb-3">
              Pa komisione
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink leading-[1.05]">
              0% komision{" "}
              <span className="italic text-forest">platforme.</span>
            </h2>
            <p className="mt-5 text-base text-ink-muted leading-relaxed max-w-xl">
              Platformat e tjera marrin deri në <strong>20%</strong> nga çdo
              punë që mjeshtri kryen. Gjej Pro merr <strong>zero</strong>.
              Çmimi që pranon klienti është çmimi që merr profesionisti.
            </p>
            <p className="mt-3 text-base text-ink-muted leading-relaxed max-w-xl">
              Po punojmë në pagesa online direkt klient → profesionist, brenda
              aplikacionit. Pa komision Gjej Pro, vetëm tarifa standarde e
              procesorit të kartës.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li className="flex items-start gap-2">
                <span className="text-forest font-semibold">✓</span>
                <span>0% nga vlera e punës.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest font-semibold">✓</span>
                <span>Pa abonime, pa tarifa mujore, pa kosto të fshehura.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest font-semibold">✓</span>
                <span>Pagesat online vijnë me aplikacionin (së shpejti).</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-surface p-6 text-center shadow-md">
              <div className="text-xs uppercase tracking-wider text-stone">
                Platformat e tjera
              </div>
              <div className="mt-3 font-display text-5xl numeric text-ink-muted line-through decoration-danger decoration-4">
                20%
              </div>
              <p className="mt-3 text-xs text-ink-muted">
                Komision nga çdo punë
              </p>
            </div>
            <div className="rounded-2xl border border-forest bg-forest text-white p-6 text-center shadow-md">
              <div className="text-xs uppercase tracking-wider text-white/70">
                Gjej Pro
              </div>
              <div className="mt-3 font-display text-5xl numeric">0%</div>
              <p className="mt-3 text-xs text-white/80">
                Komision platforme
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppComingSection() {
  return (
    <section className="relative overflow-hidden bg-surface border-y border-line">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
        style={{ background: "radial-gradient(closest-side, rgba(31,77,58,0.15), transparent)" }}
      />
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone mb-3">
              Së shpejti
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink leading-[1.05]">
              Gjej Pro <span className="italic text-forest">në xhepin tuaj.</span>
            </h2>
            <p className="mt-5 text-base text-ink-muted leading-relaxed max-w-xl">
              Aplikacioni Gjej Pro është në zhvillim e sipër për{" "}
              <strong>iOS</strong> dhe <strong>Android</strong>. Gjithçka që
              ofron platforma e web, drejt e në telefonin tuaj, me njoftime
              të menjëhershme dhe pagesa online direkt brenda aplikacionit.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink">
              <AppFeature
                title="Njoftime në kohë reale"
                body="Mos humbisni asnjë ofertë apo mesazh."
              />
              <AppFeature
                title="Postoni në sekonda"
                body="Foto, vendndodhje, kategori — gati."
              />
              <AppFeature
                title="Pagesa në aplikacion"
                body="Klient ↔ profesionist, pa komision."
              />
              <AppFeature
                title="Ofline për mjeshtra"
                body="Lista e punëve të hapura, edhe kur lidhja është e dobët."
              />
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <StoreBadge store="ios" />
              <StoreBadge store="android" />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function AppFeature({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 inline-flex w-7 h-7 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: "rgba(31,77,58,0.10)",
          color: "var(--color-forest)",
        }}
      >
        ✓
      </span>
      <div>
        <div className="font-medium text-ink">{title}</div>
        <div className="text-xs text-ink-muted">{body}</div>
      </div>
    </li>
  );
}

function StoreBadge({ store }: { store: "ios" | "android" }) {
  const label = store === "ios" ? "App Store" : "Google Play";
  const sub = store === "ios" ? "Së shpejti në" : "Së shpejti në";
  const Icon = store === "ios" ? AppleGlyph : AndroidGlyph;
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-line bg-bg px-4 py-2.5 opacity-90">
      <Icon />
      <div className="leading-tight">
        <div className="text-[10px] uppercase tracking-wider text-stone">
          {sub}
        </div>
        <div className="font-medium text-ink">{label}</div>
      </div>
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.49 2.27-1.27 3.07-.85.87-2.07 1.5-3.27 1.41-.13-1.1.42-2.27 1.21-3.05.86-.86 2.21-1.51 3.33-1.43zM20.05 17.4c-.55 1.27-.81 1.84-1.52 2.97-.99 1.59-2.39 3.57-4.13 3.59-1.55.02-1.95-1.01-4.05-1-2.1.01-2.55 1.02-4.1 1-1.74-.02-3.07-1.81-4.06-3.4-2.78-4.46-3.07-9.71-1.36-12.51 1.21-1.99 3.13-3.16 4.93-3.16 1.84 0 3 1.01 4.51 1.01 1.47 0 2.36-1.02 4.49-1.02 1.62 0 3.34.88 4.56 2.41-4.01 2.2-3.36 7.93.73 10.11z"/>
    </svg>
  );
}

function AndroidGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 20l9-9 9 9H3zm9-12l-9-7v14l9-7zm0 0l9 7V1l-9 7z"/>
    </svg>
  );
}

function PhoneMockup() {
  return (
    <div className="relative" style={{ width: 280, height: 580 }}>
      {/* shell */}
      <div className="absolute inset-0 rounded-[48px] bg-ink shadow-2xl" />
      <div className="absolute inset-[5px] rounded-[44px] bg-ink/95" />
      {/* screen */}
      <div className="absolute inset-[8px] rounded-[40px] bg-bg overflow-hidden flex flex-col">
        {/* notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-ink rounded-b-3xl z-10" />

        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-3.5 pb-1 text-[10px] font-semibold text-ink">
          <span className="numeric">9:41</span>
          <div className="flex items-center gap-1">
            <PhoneSignalGlyph />
            <PhoneWifiGlyph />
            <PhoneBatteryGlyph />
          </div>
        </div>

        {/* app header with logo */}
        <div className="px-4 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-forest flex items-center justify-center text-white font-display text-[11px] leading-none">
              G
            </div>
            <span className="font-display text-base text-ink leading-none">
              Gjej Pro
            </span>
          </div>
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center">
              <PhoneBellGlyph />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-danger border-2 border-bg" />
          </div>
        </div>

        {/* greeting */}
        <div className="px-4 pt-1 pb-2">
          <div className="text-[10px] uppercase tracking-wider text-stone">
            Mirëmëngjes
          </div>
          <h4 className="font-display text-[19px] text-ink leading-tight">
            Çfarë po kërkon sot?
          </h4>
        </div>

        {/* search */}
        <div className="px-4">
          <div className="flex items-center gap-2 rounded-xl bg-surface border border-line px-3 py-2">
            <PhoneSearchGlyph />
            <span className="text-[11px] text-stone">
              Kërko shërbim, kategori…
            </span>
          </div>
        </div>

        {/* category tiles */}
        <div className="px-4 pt-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Elektrik", color: "rgba(31,77,58,0.10)" },
              { label: "Hidraulik", color: "rgba(46,125,91,0.12)" },
              { label: "Pastrim", color: "rgba(201,169,97,0.18)" },
              { label: "Bravë", color: "rgba(31,77,58,0.10)" },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-1">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: c.color }}
                >
                  <PhoneToolGlyph />
                </div>
                <span className="text-[9px] text-ink-muted">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* featured pro card */}
        <div className="px-4 pt-4">
          <div className="text-[9px] uppercase tracking-wider text-stone mb-1.5">
            I rekomanduar pranë jush
          </div>
          <div className="rounded-2xl border border-line bg-surface p-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-forest text-white font-medium text-[11px] flex items-center justify-center shrink-0">
                AH
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink text-[12px] leading-tight truncate">
                  Profesionist i verifikuar
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <PhoneStarGlyph />
                  <span className="text-[10px] text-stone numeric">4.9</span>
                  <span className="text-[10px] text-stone">·</span>
                  <span className="text-[10px] text-stone">Tiranë</span>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-gold-deep border border-gold/40 bg-gold/10 rounded-full px-1.5 py-0.5">
                ✓
              </span>
            </div>
          </div>
        </div>

        {/* notification — payment without commission */}
        <div className="px-4 pt-2.5">
          <div className="rounded-2xl bg-forest text-white p-3">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <PhoneCardGlyph />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-medium leading-tight">
                  Pagesa u krye
                </div>
                <div className="text-[9px] text-white/80 mt-0.5">
                  85,00 € · 0% komision
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom tab bar */}
        <div className="mt-auto pt-2 pb-5 px-4 border-t border-line bg-surface/80 backdrop-blur">
          <div className="flex items-center justify-around">
            <PhoneTab label="Kreu" active />
            <PhoneTab label="Kërko" />
            <PhoneTab label="Mesazhe" />
            <PhoneTab label="Profili" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`w-5 h-5 rounded-md ${active ? "bg-forest" : "bg-line"}`}
      />
      <span
        className={`text-[8px] ${active ? "text-forest font-semibold" : "text-stone"}`}
      >
        {label}
      </span>
    </div>
  );
}

function PhoneSignalGlyph() {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="currentColor" aria-hidden>
      <rect x="0" y="6" width="2" height="3" rx="0.5" />
      <rect x="3" y="4" width="2" height="5" rx="0.5" />
      <rect x="6" y="2" width="2" height="7" rx="0.5" />
      <rect x="9" y="0" width="2" height="9" rx="0.5" />
    </svg>
  );
}

function PhoneWifiGlyph() {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M0.7 3.2 A 7 7 0 0 1 10.3 3.2" />
      <path d="M2.3 5 A 4.5 4.5 0 0 1 8.7 5" />
      <circle cx="5.5" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PhoneBatteryGlyph() {
  return (
    <svg width="18" height="9" viewBox="0 0 18 9" aria-hidden>
      <rect x="0.5" y="0.5" width="14" height="8" rx="1.5" stroke="currentColor" fill="none" />
      <rect x="2" y="2" width="10" height="5" rx="0.5" fill="currentColor" />
      <rect x="15.5" y="3" width="1.5" height="3" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function PhoneBellGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function PhoneSearchGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="text-stone">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PhoneToolGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="text-forest">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function PhoneStarGlyph() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-gold">
      <polygon points="12,2 15,9 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,9" />
    </svg>
  );
}

function PhoneCardGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
