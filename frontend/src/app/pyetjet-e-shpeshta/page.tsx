import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Pyetjet e shpeshta | ${SITE.name}`,
  description:
    "Përgjigje për pyetjet më të shpeshta rreth Gjej Pro — si funksionon, si paguani, si verifikohen profesionistët, dhe më shumë.",
  alternates: { canonical: `${SITE.url}/pyetjet-e-shpeshta` },
};

const SECTIONS: Array<{
  heading: string;
  qa: Array<{ q: string; a: string }>;
}> = [
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
        a: "Pagesa bëhet direkt me profesionistin (cash, transfertë, sipas marrëveshjes). Gjej Pro nuk ndërhyn në pagesa — kjo e mban procesin transparent dhe pa komisione.",
      },
    ],
  },
  {
    heading: "Për profesionistët",
    qa: [
      {
        q: "Sa kushton të jem pjesë e Gjej Pro?",
        a: "Asgjë. Krijimi i profilit, listimi i shërbimeve dhe dorëzimi i ofertave janë krejt falas. Pa pagesë mujore, pa angazhim.",
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
];

export default function FaqPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-xs uppercase tracking-wider text-stone">Pyetjet e shpeshta</p>
        <h1 className="font-display text-5xl mt-3 text-ink leading-[1.05]">
          Përgjigje për pyetjet më të zakonshme.
        </h1>
        <p className="mt-4 text-base text-ink-muted max-w-2xl">
          Nuk gjeni atë që po kërkoni? Na shkruani — ekipi ynë i suportit
          përgjigjet brenda 24 orëve.
        </p>

        <div className="mt-12 space-y-12">
          {SECTIONS.map((sec) => (
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
            Keni pyetje tjera?
          </h2>
          <p className="mt-2 text-ink-muted">
            Kontaktoni ekipin tonë në{" "}
            <a
              href="mailto:info@gjejpro.al"
              className="text-forest font-medium hover:underline"
            >
              info@gjejpro.al
            </a>
            .
          </p>
          <div className="mt-5">
            <Link href="/regjistrohu">
              <Button variant="primary" size="lg">
                Filloni tani
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
