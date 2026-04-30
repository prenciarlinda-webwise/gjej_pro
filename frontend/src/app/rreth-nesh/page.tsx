import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Rreth nesh | ${SITE.name}`,
  description:
    "Misioni i Gjej Pro: të lidhë çdo familje shqiptare me profesionistët e duhur, me transparencë dhe besim. Mësoni më shumë rreth ekipit dhe vlerave tona.",
  alternates: { canonical: `${SITE.url}/rreth-nesh` },
};

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="bg-gradient-warm">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
            <p className="text-xs uppercase tracking-wider text-stone">Rreth nesh</p>
            <h1 className="font-display text-5xl sm:text-6xl mt-3 text-ink leading-[1.05]">
              Profesionistë <span className="italic text-forest">për ju.</span>
              <br />
              Që në vitin 2021.
            </h1>
            <p className="mt-6 text-lg text-ink-muted max-w-2xl leading-relaxed">
              Gjej Pro lindi nga një ide e thjeshtë: të gjithë meritojnë qasje
              të lehtë te mjeshtra të besueshëm. Sot lidhim mijëra familje
              shqiptare me profesionistët e duhur — pa stres, pa angazhime të
              fshehura.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl text-ink">Misioni ynë</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Të bëjmë gjetjen e një profesionisti të mirë po aq të thjeshtë sa
              porositja e një kafe. Çdo klient meriton transparencë në çmime,
              vlerësime reale, dhe mundësi për të krahasuar para se të vendosë.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink">Vizioni ynë</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Të jemi platforma më e besueshme në Shqipëri për shërbimet në
              shtëpi e biznes — dhe pastaj ta zgjerojmë këtë model në të gjithë
              rajonin, duke filluar nga Mbretëria e Bashkuar.
            </p>
          </div>
        </section>

        <section className="bg-surface border-y border-line">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
            <h2 className="font-display text-3xl text-ink">Vlerat tona</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Value
                title="Transparencë"
                body="Pa komisione të fshehura. Çmimi që paguani është çmimi që ofron profesionisti — pikë."
              />
              <Value
                title="Besueshmëri"
                body="Çdo profesionist verifikohet para se të lejohet të dorëzojë oferta. Identitet, kompani, dokumente — gjithçka kontrollohet."
              />
              <Value
                title="Cilësi"
                body="Vlerësimet e vërteta nga klientët e mëparshëm janë guri themeltar i platformës. Pa fake reviews."
              />
              <Value
                title="Komuniteti"
                body="Ne nuk jemi thjesht një teknologji — jemi pjesë e komunitetit shqiptar dhe punojmë çdo ditë për ta bërë atë më të mirë."
              />
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
          <h2 className="font-display text-3xl text-ink">Ekipi</h2>
          <p className="mt-3 text-ink-muted max-w-2xl">
            Një ekip i vogël me një ambicie të madhe — të ndërtojmë infrastrukturën
            e shërbimeve për rajonin.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TeamCard name="Arlinda Prenci" role="Founder & CEO" />
            <TeamCard name="Ekipi i Inxhinierisë" role="Engineering" />
            <TeamCard name="Ekipi i Operacionit" role="Operations" />
            <TeamCard name="Ekipi i Suportit" role="Customer Success" />
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 pb-20">
          <div className="card p-8 sm:p-10 text-center">
            <h2 className="font-display text-3xl text-ink">
              Bëhuni pjesë e Gjej Pro
            </h2>
            <p className="mt-3 text-ink-muted max-w-xl mx-auto">
              Si klient apo si profesionist — krijoni llogarinë tuaj në pak
              minuta dhe filloni.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href="/regjistrohu?role=klient">
                <Button variant="primary" size="lg">
                  Regjistrohu si klient
                </Button>
              </Link>
              <Link href="/regjistrohu?role=freelancer">
                <Button variant="secondary" size="lg">
                  Regjistrohu si profesionist
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
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

function TeamCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="card p-5 text-center">
      <Avatar name={name} size={56} className="mx-auto" />
      <div className="mt-3 font-medium text-ink">{name}</div>
      <div className="text-xs text-stone uppercase tracking-wider mt-1">
        {role}
      </div>
    </div>
  );
}
