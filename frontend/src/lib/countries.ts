/**
 * Country expansion config. Unlike the default (Albania) site — which is
 * Albanian-language, for an Albanian audience — these sections are in
 * English: they target both the Albanian diaspora AND local clients in the
 * US/UK who want to hire Albanian professionals, so the content needs to be
 * readable by non-Albanian speakers. See COUNTRY_LOCALES in server-api.ts
 * for the hreflang-facing summary of this same list.
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
  /** Bare form — use standalone (breadcrumbs, back-links, "X — by city" headings). */
  label: string;
  /** Grammatical form for use after a preposition, e.g. "in {inLabel}" ->
   * "in the United Kingdom". Both current countries take "the"; a future
   * country that doesn't (e.g. "Italy") would just set this equal to `label`. */
  inLabel: string;
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
    locale: "en-GB",
    label: "United Kingdom",
    inLabel: "the United Kingdom",
    heroKicker: "Gjej Pro in the United Kingdom",
    heroTitle: "Albanian professionals, near you in the UK.",
    heroBody:
      `${SITE.name} is coming to the Albanian community in the United Kingdom: the same free platform, 0% commission, now here too.`,
    cities: UK_CITIES,
  },
  us: {
    code: "us",
    apiCountry: "US",
    pathPrefix: "/us",
    locale: "en-US",
    label: "United States",
    inLabel: "the United States",
    heroKicker: "Gjej Pro in the United States",
    heroTitle: "Albanian professionals, near you in the US.",
    heroBody:
      `${SITE.name} is coming to the Albanian community in the United States: the same free platform, 0% commission, now here too.`,
    cities: US_CITIES,
  },
};

export function getCountryConfig(code: string): CountryConfig | undefined {
  return COUNTRIES[code as CountryCode];
}

export function findCountryCityBySlug(country: CountryConfig, slug: string) {
  return country.cities.find((c) => c.slug === slug.toLowerCase());
}
