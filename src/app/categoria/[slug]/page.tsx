import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findCategoryBySlug } from "@/config/taxonomy";
import { getPaginatedArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `Últimas notícias de ${category.name}, traduzidas e resumidas com link para a fonte original.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, totalPages } = await getPaginatedArticles(page, 18, category.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-headline text-2xl font-bold border-b border-border pb-3">{category.name}</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Nenhuma notícia importada nesta categoria ainda.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/categoria/${slug}`} />
    </div>
  );
}
