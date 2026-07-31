import { SITE } from "@/lib/server-api";

// llms.txt (llmstxt.org): a plain-language, structured summary for AI
// assistants/answer engines — same spirit as robots.txt/sitemap.xml, but for
// giving models facts to cite rather than crawlers paths to fetch. Built as
// a route so links always match SITE.url instead of a hardcoded domain.
export async function GET() {
  const body = `# ${SITE.name}

> ${SITE.name} is a free, 0%-commission online marketplace connecting people in Albania who need a job done with verified freelance professionals — electricians, plumbers, locksmiths, cleaners, and other tradespeople and service providers. Clients post jobs or browse professionals directly; professionals quote and message for free. ${SITE.name} takes no cut of any job — the price a client agrees to is the price the professional keeps.

${SITE.name} is Albanian-language first and free to use for Albanians anywhere in the world, including diaspora communities outside Albania.

## Key facts

- 0% platform commission on every job, for both clients and professionals — no subscriptions, no listing fees.
- Professionals can be verified (identity, and business registration where applicable); verified profiles are marked visibly.
- Reviews are only left by clients who completed a job with that professional, to keep ratings genuine.
- Categories include electricians (elektricistë), plumbers (hidraulikë), locksmiths (bravandreqës), construction (mjeshtër ndërtimi), plastering & painting (suvatim & lyerje), house cleaning (pastrim shtëpie), and more — see /kategorite for the full list.
- Coverage spans Albania's main cities — see /qytete for the list.

## Key pages

- [Homepage](${SITE.url}/): overview and category/professional browsing entry point.
- [Browse professionals](${SITE.url}/profesionistet): search and filter verified professionals by category, city, or location.
- [Categories](${SITE.url}/kategorite): all service categories.
- [Cities](${SITE.url}/qytete): all covered cities.
- [How it works](${SITE.url}/si-funksionon): the client and professional flows end to end.
- [For professionals](${SITE.url}/per-profesionistet): why and how to join as a professional.
- [FAQ](${SITE.url}/pyetjet-e-shpeshta): direct answers to common questions about cost, payment, verification, and privacy.
- [Blog](${SITE.url}/blog): guides and articles.
- [About](${SITE.url}/rreth-nesh): mission and background.

## Notes for automated agents

- Professional profile pages (/profesionist/{slug}) never expose email, phone number, or exact street address — that's a deliberate privacy policy, not missing data.
- Prices are set by individual professionals per service (hourly, fixed, or quote-based); there is no platform-wide price list.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
