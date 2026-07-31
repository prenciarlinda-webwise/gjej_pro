"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-context";
import { dashboardPathFor } from "@/lib/api";

export type UiLocale = "sq" | "en";

const HEADER_STRINGS: Record<UiLocale, {
  professionals: string;
  categories: string;
  howItWorks: string;
  dashboard: string;
  login: string;
  signup: string;
}> = {
  sq: {
    professionals: "Profesionistët",
    categories: "Kategoritë",
    howItWorks: "Si funksionon",
    dashboard: "Paneli",
    login: "Hyr",
    signup: "Regjistrohu",
  },
  en: {
    professionals: "Professionals",
    categories: "Categories",
    howItWorks: "How it works",
    dashboard: "Dashboard",
    login: "Log in",
    signup: "Sign up",
  },
};

export function PublicHeader({ locale = "sq" }: { locale?: UiLocale }) {
  const { user, loading } = useAuth();
  const t = HEADER_STRINGS[locale];
  const loginHref = locale === "en" ? "/hyr?locale=en" : "/hyr";
  const signupHref = locale === "en" ? "/regjistrohu?locale=en" : "/regjistrohu";

  return (
    <header className="border-b border-line bg-bg/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-3 flex items-center justify-between gap-4">
        <Logo size={84} />
        <nav className="flex items-center gap-1.5 flex-wrap justify-end">
          <Link href="/profesionistet" className="hidden sm:inline-block">
            <Button variant="ghost" size="md">
              {t.professionals}
            </Button>
          </Link>
          <Link href="/kategorite" className="hidden md:inline-block">
            <Button variant="ghost" size="md">
              {t.categories}
            </Button>
          </Link>
          <Link href="/si-funksionon" className="hidden md:inline-block">
            <Button variant="ghost" size="md">
              {t.howItWorks}
            </Button>
          </Link>
          {!loading && user ? (
            <Link href={dashboardPathFor(user.role)}>
              <Button variant="primary" size="md">
                {t.dashboard}
              </Button>
            </Link>
          ) : (
            <>
              <Link href={loginHref}>
                <Button variant="ghost" size="md">{t.login}</Button>
              </Link>
              <Link href={signupHref}>
                <Button variant="primary" size="md">{t.signup}</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
