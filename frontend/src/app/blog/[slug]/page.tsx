import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { JsonLd } from "@/components/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/structured-data";
import { MarkdownContent } from "@/components/MarkdownContent";
import { serverApi, SITE } from "@/lib/server-api";

const STRINGS = {
  sq: {
    notFoundTitle: `Postimi nuk u gjet | ${SITE.name}`,
    backToBlog: "← Të gjitha postimet",
    publishedFallback: "I publikuar",
    dateLocale: "sq-AL",
  },
  en: {
    notFoundTitle: `Post not found | ${SITE.name}`,
    backToBlog: "← All posts",
    publishedFallback: "Published",
    dateLocale: "en-GB",
  },
};

interface RouteParams {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params, searchParams }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const post = await serverApi.blogPost(slug, { strict: true });
  if (!post) return { title: t.notFoundTitle };
  return {
    title: `${post.title} | ${SITE.name} Blog`,
    description: (post.excerpt || post.body).slice(0, 160),
    alternates: { canonical: `${SITE.url}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${slug}`,
      siteName: SITE.name,
      locale: "sq_AL",
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: RouteParams) {
  const { slug } = await params;
  const { locale: localeParam } = await searchParams;
  const locale = localeParam === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const q = locale === "en" ? "?locale=en" : "";
  const post = await serverApi.blogPost(slug, { strict: true });
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: "Kreu", url: SITE.url },
            { name: "Blog", url: `${SITE.url}/blog` },
            { name: post.title, url: `${SITE.url}/blog/${post.slug}` },
          ]),
        ]}
      />
      <PublicHeader locale={locale} />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-6 sm:px-8 py-12">
          <Link href={`/blog${q}`} className="text-xs text-stone hover:text-ink">
            {t.backToBlog}
          </Link>

          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-wider text-stone numeric">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString(t.dateLocale, {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : t.publishedFallback}{" "}
              · {post.author_name}
            </div>
            <h1 className="mt-3 font-display text-5xl text-ink leading-[1.05]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg text-ink-muted leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="mt-10 w-full rounded-2xl shadow-lg"
            />
          )}

          <div className="mt-10 prose-content text-ink leading-relaxed">
            <MarkdownContent body={post.body} />
          </div>
        </article>
      </main>
      <PublicFooter locale={locale} />
    </>
  );
}
