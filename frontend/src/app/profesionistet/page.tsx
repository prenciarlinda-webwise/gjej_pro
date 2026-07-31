import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { itemListSchema } from "@/lib/structured-data";
import { serverApi, SITE } from "@/lib/server-api";
import FreelancerBrowseClient from "./FreelancerBrowseClient";

export const metadata: Metadata = {
  title: "Profesionistë në Shqipëri",
  description:
    "Shfletoni mijëra profesionistë të verifikuar në Shqipëri: elektricistë, hidraulikë, bravandreqës, pastrues e shumë të tjerë. Filtroni sipas kategorisë, qytetit ose vendndodhjes suaj.",
  alternates: { canonical: `${SITE.url}/profesionistet` },
  openGraph: {
    title: `Profesionistë në Shqipëri | ${SITE.name}`,
    description:
      "Shfletoni mijëra profesionistë të verifikuar në Shqipëri, sipas kategorisë, qytetit ose vendndodhjes suaj.",
    url: `${SITE.url}/profesionistet`,
    siteName: SITE.name,
    locale: "sq_AL",
    type: "website",
  },
};

// The interactive filter/search UI is entirely client-rendered (geolocation,
// live query params), so this server wrapper exists only to give the page
// metadata and a crawlable ItemList — both invisible to non-JS crawlers
// (including most AI/answer-engine bots) if left inside the "use client" tree.
export default async function FreelancerBrowsePage() {
  const list = await serverApi.searchFreelancers({ page: 1 });
  const freelancers = list?.results ?? [];

  return (
    <>
      {freelancers.length > 0 && (
        <JsonLd
          data={itemListSchema(
            freelancers.map((f) => ({
              name: f.full_name,
              url: `${SITE.url}/profesionist/${f.slug}`,
            })),
          )}
        />
      )}
      <FreelancerBrowseClient />
    </>
  );
}
