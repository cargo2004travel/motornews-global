import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findCategoryBySlug } from "@/config/taxonomy";
import { getPaginatedByChampionship } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";

export const revalidate = 300;

type Params = { slug: string };

/**
 * O campo `championship` é texto livre gerado pela IA (ex.: "Fórmula 1", "MotoGP 2026"),
 * então usamos a mesma taxonomia de categorias como rótulo amigável e fazemos a busca
 * por correspondência parcial no campo championship.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const championship = findCategoryBySlug(slug);
  if (!championship) return {};
  return {
    title: `Campeonato — ${championship.name}`,
    description: `Cobertura do campeonato ${championship.name}: resultados, bastidores e calendário.`,
  };
}

export default async function ChampionshipPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const championship = findCategoryBySlug(slug);
  if (!championship) notFound();

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, totalPages } = await getPaginatedByChampionship(championship.name, page, 18);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-headline text-2xl font-bold border-b border-border pb-3">{championship.name}</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Nenhuma notícia importada deste campeonato ainda.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/campeonato/${slug}`} />
    </div>
  );
}
