import type { Metadata } from "next";
import { CountryHubPage } from "@/components/CountryHubPage";
import { COUNTRIES } from "@/lib/countries";
import { SITE, hreflangAlternates } from "@/lib/server-api";

const country = COUNTRIES.uk;

export const metadata: Metadata = {
  title: `${SITE.name} in ${country.inLabel}`,
  description: `${country.heroBody} Search for verified Albanian professionals in ${country.inLabel}: electricians, plumbers, cleaners, and many more.`,
  alternates: {
    canonical: `${SITE.url}${country.pathPrefix}`,
    // "" = the hub page itself (AL's equivalent is the homepage "/").
    languages: hreflangAlternates(""),
  },
  openGraph: {
    title: `${SITE.name} in ${country.inLabel}`,
    description: country.heroBody,
    url: `${SITE.url}${country.pathPrefix}`,
    siteName: SITE.name,
    locale: country.locale.replace("-", "_"),
    type: "website",
  },
};

export default function UkPage() {
  return <CountryHubPage country={country} />;
}
