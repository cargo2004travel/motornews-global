import type { Metadata } from "next";
import { getPaginatedArticles, searchArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Todas as notícias de automobilismo e motociclismo, atualizadas a cada 30 minutos.",
};

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  if (q) {
    const results = await searchArticles(q, 30);
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="font-headline text-2xl font-bold">Resultados para “{q}”</h1>
        <p className="mt-1 text-sm text-muted-foreground">{results.length} notícia(s) encontrada(s)</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  }

  const { items, totalPages } = await getPaginatedArticles(page, 18);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-headline text-2xl font-bold border-b border-border pb-3">Todas as notícias</h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/noticias" />
    </div>
  );
}
