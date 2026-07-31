import type { Metadata } from "next";
import {
  CategoryCountryView,
  categoryCountryMetadata,
} from "@/components/CategoryCountryView";
import { COUNTRIES } from "@/lib/countries";

const country = COUNTRIES.us;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  return categoryCountryMetadata(country, slug);
}

export default async function UsCategoryPage({ params }: RouteParams) {
  const { slug } = await params;
  return <CategoryCountryView country={country} slug={slug} />;
}
