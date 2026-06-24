import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma/client";

export async function getTopArticlesOfDay(limit = 10) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recent = await prisma.article.findMany({
    where: { status: ArticleStatus.PUBLISHED, publishedAt: { gte: since } },
    orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
    take: limit,
    select: { slug: true, translatedTitle: true, excerpt: true, category: true },
  });

  if (recent.length >= limit) return recent;

  const fallback = await prisma.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: { slug: true, translatedTitle: true, excerpt: true, category: true },
  });

  const seen = new Set(recent.map((a) => a.slug));
  for (const article of fallback) {
    if (recent.length >= limit) break;
    if (!seen.has(article.slug)) {
      recent.push(article);
      seen.add(article.slug);
    }
  }

  return recent;
}
