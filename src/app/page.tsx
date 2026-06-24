import Link from "next/link";
import { Fragment } from "react";
import type { Metadata } from "next";
import { getFeaturedArticle, getLatestArticles, getArticlesByCategory } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { HOME_CHAMPIONSHIP_BLOCKS, toSlug } from "@/config/taxonomy";
import { SITE_DESCRIPTION } from "@/config/site";
import { AdSlot } from "@/components/ad-slot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MotorNews Global — Automobilismo e Motociclismo",
  description: SITE_DESCRIPTION,
};

export default async function HomePage() {
  const featured = await getFeaturedArticle();
  const latest = await getLatestArticles(21, featured?.id);

  const championshipBlocks = await Promise.all(
    HOME_CHAMPIONSHIP_BLOCKS.map(async (champ) => ({
      ...champ,
      articles: await getArticlesByCategory(champ.name, 6),
    })),
  );

  if (!featured) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-headline text-3xl font-bold">Ainda não há notícias importadas</h1>
        <p className="mt-3 text-muted-foreground">
          Execute a rota <code className="rounded bg-muted px-1.5 py-0.5">/api/cron/fetch-news</code> para
          popular o banco com as primeiras notícias.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Hero editorial */}
      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ArticleCard article={featured} size="large" />
        </div>
        <div className="space-y-6">
          {latest.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} size="compact" />
          ))}
        </div>
      </section>

      <div className="mt-8">
        <AdSlot slotId="1111111111" className="min-h-[90px]" />
      </div>

      {/* Últimas notícias */}
      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="font-headline text-xl font-bold">Últimas notícias</h2>
          <Link href="/noticias" className="text-sm font-semibold text-accent-blue hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.slice(3, 21).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          {championshipBlocks.map((block, index) =>
            block.articles.length > 0 ? (
              <Fragment key={block.slug}>
                <section>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h2 className="font-headline text-xl font-bold">{block.name}</h2>
                    <Link
                      href={`/categoria/${toSlug(block.name)}`}
                      className="text-sm font-semibold text-accent-blue hover:underline"
                    >
                      Ver todas →
                    </Link>
                  </div>
                  <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {block.articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
                {index === 1 && <AdSlot slotId="2222222222" className="min-h-[200px]" />}
              </Fragment>
            ) : null,
          )}
        </div>

        <div className="space-y-8">
          <AdSlot slotId="3333333333" className="min-h-[250px]" />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
