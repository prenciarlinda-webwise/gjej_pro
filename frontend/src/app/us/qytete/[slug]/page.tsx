import type { Metadata } from "next";
import {
  CityCountryDetailView,
  cityCountryDetailMetadata,
} from "@/components/CityCountryView";
import { COUNTRIES } from "@/lib/countries";

const country = COUNTRIES.us;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  return cityCountryDetailMetadata(country, slug);
}

export default async function UsCityDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  return <CityCountryDetailView country={country} slug={slug} />;
}
