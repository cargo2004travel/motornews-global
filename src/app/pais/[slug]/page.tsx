import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findCountryBySlug } from "@/config/taxonomy";
import { getArticlesByCountry } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const country = findCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `Notícias de ${country.name}`,
    description: `Automobilismo e motociclismo com cobertura de fontes de ${country.name}.`,
  };
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const country = findCountryBySlug(slug);
  if (!country) notFound();

  const items = await getArticlesByCountry(country.name, 24);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="font-headline text-2xl font-bold border-b border-border pb-3">{country.name}</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Nenhuma notícia importada deste país ainda.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
