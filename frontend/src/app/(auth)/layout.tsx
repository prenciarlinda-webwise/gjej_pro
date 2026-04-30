import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden lg:flex flex-col justify-center bg-forest-deep text-white p-12">
        <Link href="/" className="inline-flex w-fit mb-10">
          <Logo size={120} variant="light" asLink={false} />
        </Link>
        <h2 className="font-display text-3xl leading-tight max-w-md">
          Krijoni llogarinë tuaj në Gjej Pro.
        </h2>
        <p className="mt-5 text-white/70 max-w-md leading-relaxed text-sm">
          Falas për të gjithë shqiptarët, kudo që janë, në gjithë globin.
          Ne ndërtojmë urën, ju ndërtoni reputacionin.
        </p>
        <p className="mt-12 text-white/50 text-xs uppercase tracking-wider">
          © {new Date().getFullYear()} Gjej Pro · Profesionistë për ju
        </p>
      </aside>

      <main className="flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
