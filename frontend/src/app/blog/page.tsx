import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { serverApi, SITE } from "@/lib/server-api";

export const metadata: Metadata = {
  title: `Blog | ${SITE.name}`,
  description:
    "Këshilla, udhëzues dhe histori nga komuniteti i Gjej Pro, për klientët dhe profesionistët.",
  alternates: { canonical: `${SITE.url}/blog` },
};

export default async function BlogIndexPage() {
  const data = await serverApi.blogPosts();
  const posts = data?.results ?? [];

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <section className="bg-gradient-warm">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
            <p className="text-xs uppercase tracking-wider text-stone">Blog</p>
            <h1 className="font-display text-5xl mt-3 text-ink leading-[1.05]">
              Histori, këshilla dhe udhëzues.
            </h1>
            <p className="mt-4 text-base text-ink-muted max-w-2xl">
              Çfarë po ndodh në komunitetin e Gjej Pro, si të zgjidhni
              profesionistët e duhur, dhe si të rriteni si freelancer në
              Shqipëri.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
          {posts.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-base text-ink-muted">
                Postimet e blogut janë në punim e sipër. Kthehuni së shpejti.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="card card-link block overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-0">
                    {p.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gradient-forest h-48 sm:h-full" />
                    )}
                    <div className="p-6">
                      <div className="text-[10px] uppercase tracking-wider text-stone numeric">
                        {p.published_at
                          ? new Date(p.published_at).toLocaleDateString(
                              "sq-AL",
                              { day: "2-digit", month: "long", year: "numeric" },
                            )
                          : "I publikuar"}{" "}
                        · {p.author_name}
                      </div>
                      <h2 className="mt-2 font-display text-2xl text-ink leading-tight">
                        {p.title}
                      </h2>
                      {p.excerpt && (
                        <p className="mt-3 text-sm text-ink-muted leading-relaxed line-clamp-3">
                          {p.excerpt}
                        </p>
                      )}
                      <p className="mt-4 text-sm text-forest font-medium">
                        Lexo më shumë →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
