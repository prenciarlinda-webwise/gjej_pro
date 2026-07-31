import type { Metadata } from "next";
import {
  CityCountryIndexView,
  cityCountryIndexMetadata,
} from "@/components/CityCountryView";
import { COUNTRIES } from "@/lib/countries";

const country = COUNTRIES.us;

export const metadata: Metadata = cityCountryIndexMetadata(country);

export default function UsCitiesIndexPage() {
  return <CityCountryIndexView country={country} />;
}
