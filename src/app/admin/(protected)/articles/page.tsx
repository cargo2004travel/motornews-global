import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleActions } from "@/components/admin/article-actions";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 30;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      orderBy: { importedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: { source: { select: { name: true } } },
    }),
    prisma.article.count(),
  ]);

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold">Notícias importadas ({total})</h1>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2">Título</th>
              <th className="py-2">Fonte</th>
              <th className="py-2">Categoria</th>
              <th className="py-2">Status</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-border">
                <td className="max-w-xs py-2">
                  <Link href={`/noticias/${a.slug}`} target="_blank" className="hover:text-accent-red line-clamp-1">
                    {a.translatedTitle}
                  </Link>
                </td>
                <td className="py-2">{a.source.name}</td>
                <td className="py-2">{a.category}</td>
                <td className="py-2">{a.status}</td>
                <td className="py-2">
                  <ArticleActions id={a.id} status={a.status} featured={a.featured} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
