import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, incrementArticleViews } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { formatFullDate } from "@/lib/format";
import { toSlug } from "@/config/taxonomy";
import { SITE_NAME, SITE_URL } from "@/config/site";

export const revalidate = 120;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seoTitle || article.translatedTitle,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `${SITE_URL}/noticias/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.translatedTitle,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : undefined,
      publishedTime: article.publishedAt.toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  await incrementArticleViews(article.id);

  const related = await getRelatedArticles(article.category, article.id, 4);
  const categorySlug = toSlug(article.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.translatedTitle,
    description: article.excerpt,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.importedAt.toISOString(),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    isBasedOn: article.originalUrl,
    mainEntityOfPage: `${SITE_URL}/noticias/${article.slug}`,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-accent-red">Início</Link> /{" "}
        <Link href={`/categoria/${categorySlug}`} className="hover:text-accent-red">{article.category}</Link>
      </nav>

      <Link
        href={`/categoria/${categorySlug}`}
        className="mt-4 inline-block rounded bg-accent-red px-2 py-0.5 text-xs font-bold uppercase text-white"
      >
        {article.category}
      </Link>

      <h1 className="font-headline mt-3 text-3xl font-bold leading-tight md:text-4xl">
        {article.translatedTitle}
      </h1>

      <p className="mt-3 text-lg text-muted-foreground">{article.excerpt}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{formatFullDate(article.publishedAt)}</span>
        <span>·</span>
        <span>{article.country}</span>
      </div>

      {article.imageUrl && (
        <img src={article.imageUrl} alt="" loading="lazy" className="mt-6 w-full rounded object-cover" />
      )}

      <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line text-base leading-relaxed">
        {article.summary}
      </div>

      <div className="mt-8 rounded border border-border bg-muted p-4 text-sm">
        <p>
          Resumo baseado em notícia publicada originalmente por <strong>{article.source.name}</strong>.
        </p>
        <a
          href={article.originalUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-2 inline-block font-semibold text-accent-blue hover:underline"
        >
          Ler matéria original em {article.source.name} →
        </a>
      </div>

      {article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map(({ tag }) => (
            <span key={tag.id} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-headline text-xl font-bold border-b border-border pb-2">Leia também</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
