"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { COUNTRY_LOCALES } from "@/lib/server-api";

const SORTED_BY_SPECIFICITY = [...COUNTRY_LOCALES].sort(
  (a, b) => b.path.length - a.path.length,
);

/**
 * The root <html lang> is set once in the root layout (SSR can't vary it per
 * route without forcing the whole app dynamic — see layout.tsx). This patches
 * it client-side after hydration so screen readers and browser
 * translate-prompts get the right language on /uk and /us. Deliberately not
 * SSR'd: a small, real correctness gap for non-JS crawlers is a better
 * trade-off than losing static generation site-wide.
 */
export function LocaleHtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    const match = SORTED_BY_SPECIFICITY.find(
      (loc) => loc.path && (pathname === loc.path || pathname.startsWith(`${loc.path}/`)),
    );
    document.documentElement.lang = match?.locale ?? "sq-AL";
  }, [pathname]);

  return null;
}
