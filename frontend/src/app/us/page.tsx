import type { Metadata } from "next";
import { CountryHubPage } from "@/components/CountryHubPage";
import { COUNTRIES } from "@/lib/countries";
import { SITE, hreflangAlternates } from "@/lib/server-api";

const country = COUNTRIES.us;

export const metadata: Metadata = {
  title: `${SITE.name} në ${country.label}`,
  description: `${country.heroBody} Kërkoni profesionistë shqiptarë të verifikuar në ${country.label}: elektricistë, hidraulikë, pastrues e shumë të tjerë.`,
  alternates: {
    canonical: `${SITE.url}${country.pathPrefix}`,
    // "" = the hub page itself (AL's equivalent is the homepage "/").
    languages: hreflangAlternates(""),
  },
  openGraph: {
    title: `${SITE.name} në ${country.label}`,
    description: country.heroBody,
    url: `${SITE.url}${country.pathPrefix}`,
    siteName: SITE.name,
    locale: country.locale.replace("-", "_"),
    type: "website",
  },
};

export default function UsPage() {
  return <CountryHubPage country={country} />;
}
