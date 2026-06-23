import Link from "next/link";
import { getMostReadArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/article-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { CATEGORIES } from "@/config/taxonomy";

export async function Sidebar() {
  const mostRead = await getMostReadArticles(6);

  return (
    <aside className="space-y-8">
      <section>
        <h2 className="font-headline text-lg font-bold border-b border-border pb-2">Mais lidas</h2>
        <div className="mt-4 space-y-4">
          {mostRead.map((article) => (
            <ArticleCard key={article.id} article={article} size="compact" />
          ))}
        </div>
      </section>

      <section className="rounded border border-border bg-muted p-5">
        <h2 className="font-headline text-lg font-bold">Newsletter</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Receba o resumo das principais notícias de automobilismo e motociclismo direto no seu e-mail.
        </p>
        <div className="mt-4">
          <NewsletterForm compact />
        </div>
      </section>

      <section>
        <h2 className="font-headline text-lg font-bold border-b border-border pb-2">Campeonatos</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <li key={cat.slug}>
              <Link href={`/categoria/${cat.slug}`} className="hover:text-accent-red">
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
