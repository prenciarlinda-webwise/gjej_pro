/**
 * Country expansion config. Same Albanian-language product as the default
 * (Albania) site — these sections target Albanian-diaspora audiences who
 * live in the US/UK, not the general local population. See COUNTRY_LOCALES
 * in server-api.ts for the hreflang-facing summary of this same list.
 */
import { SITE } from "./server-api";

export type CountryCode = "us" | "uk";

export interface CountryCityDef {
  slug: string;
  name: string;
}

export interface CountryConfig {
  code: CountryCode;
  /** ISO 3166-1 alpha-2, matches ServiceArea.country / User.country on the backend. */
  apiCountry: string;
  pathPrefix: string;
  locale: string;
  label: string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  cities: CountryCityDef[];
}

// Metro areas with an established Albanian-American community. Kept at
// city level (not neighborhood level) — broad enough to be safely accurate,
// specific enough to be useful as a search/browse filter.
export const US_CITIES: CountryCityDef[] = [
  { slug: "new-york", name: "New York" },
  { slug: "new-jersey", name: "New Jersey" },
  { slug: "boston", name: "Boston" },
  { slug: "detroit", name: "Detroit" },
  { slug: "chicago", name: "Chicago" },
  { slug: "philadelphia", name: "Philadelphia" },
  { slug: "washington-dc", name: "Washington D.C." },
  { slug: "atlanta", name: "Atlanta" },
];

// Metro areas with an established Albanian-British community.
export const UK_CITIES: CountryCityDef[] = [
  { slug: "london", name: "London" },
  { slug: "birmingham", name: "Birmingham" },
  { slug: "manchester", name: "Manchester" },
  { slug: "leeds", name: "Leeds" },
  { slug: "liverpool", name: "Liverpool" },
  { slug: "glasgow", name: "Glasgow" },
];

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  uk: {
    code: "uk",
    apiCountry: "GB",
    pathPrefix: "/uk",
    locale: "sq-GB",
    label: "Mbretëria e Bashkuar",
    heroKicker: "Gjej Pro në Mbretërinë e Bashkuar",
    heroTitle: "Profesionistë shqiptarë, pranë jush në MB.",
    heroBody:
      `${SITE.name} po vjen për komunitetin shqiptar në Mbretërinë e Bashkuar: i njëjti platformë falas, 0% komision, tani edhe këtu.`,
    cities: UK_CITIES,
  },
  us: {
    code: "us",
    apiCountry: "US",
    pathPrefix: "/us",
    locale: "sq-US",
    label: "Shtetet e Bashkuara",
    heroKicker: "Gjej Pro në Shtetet e Bashkuara",
    heroTitle: "Profesionistë shqiptarë, pranë jush në SHBA.",
    heroBody:
      `${SITE.name} po vjen për komunitetin shqiptar në Shtetet e Bashkuara: i njëjti platformë falas, 0% komision, tani edhe këtu.`,
    cities: US_CITIES,
  },
};

export function getCountryConfig(code: string): CountryConfig | undefined {
  return COUNTRIES[code as CountryCode];
}

export function findCountryCityBySlug(country: CountryConfig, slug: string) {
  return country.cities.find((c) => c.slug === slug.toLowerCase());
}
