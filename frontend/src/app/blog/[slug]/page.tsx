import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { serverApi, SITE } from "@/lib/server-api";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await serverApi.blogPost(slug);
  if (!post) return { title: `Postimi nuk u gjet | ${SITE.name}` };
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

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await serverApi.blogPost(slug);
  if (!post) notFound();

  return (
    <>
      <PublicHeader />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-6 sm:px-8 py-12">
          <Link href="/blog" className="text-xs text-stone hover:text-ink">
            ← Të gjitha postimet
          </Link>

          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-wider text-stone numeric">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("sq-AL", {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : "I publikuar"}{" "}
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
            {post.body.split(/\n\n+/).map((para, i) => (
              <p key={i} className="mb-5 whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </article>
      </main>
      <PublicFooter />
    </>
  );
}
