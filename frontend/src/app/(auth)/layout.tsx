import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden lg:flex flex-col justify-between bg-forest-deep text-white p-12">
        <Link href="/">
          <span className="inline-block bg-white px-3 py-1.5 rounded-md">
            <Logo size={28} />
          </span>
        </Link>
        <div>
          <h2 className="font-display text-3xl leading-tight max-w-md">
            Bëhuni pjesë e komunitetit më të madh të profesionistëve në Shqipëri.
          </h2>
          <p className="mt-5 text-white/70 max-w-md leading-relaxed text-sm">
            Mijëra klientë presin për shërbimet tuaja. Ne ndërtojmë urën — ju
            ndërtoni reputacionin.
          </p>
        </div>
        <p className="text-white/50 text-xs uppercase tracking-wider">
          © {new Date().getFullYear()} Gjej Pro · Profesionistë për ju
        </p>
      </aside>

      <main className="flex flex-col">
        <div className="lg:hidden p-6 border-b border-line">
          <Logo size={28} />
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
