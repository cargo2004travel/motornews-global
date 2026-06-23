import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma/client";

const PUBLISHED = ArticleStatus.PUBLISHED;

const cardSelect = {
  id: true,
  slug: true,
  translatedTitle: true,
  excerpt: true,
  imageUrl: true,
  category: true,
  championship: true,
  country: true,
  publishedAt: true,
  views: true,
  featured: true,
  source: { select: { name: true, url: true } },
} as const;

export async function getFeaturedArticle() {
  const featured = await prisma.article.findFirst({
    where: { status: PUBLISHED, featured: true },
    orderBy: { publishedAt: "desc" },
    select: cardSelect,
  });
  if (featured) return featured;
  return prisma.article.findFirst({
    where: { status: PUBLISHED },
    orderBy: { publishedAt: "desc" },
    select: cardSelect,
  });
}

export async function getLatestArticles(limit = 12, excludeId?: string) {
  return prisma.article.findMany({
    where: { status: PUBLISHED, ...(excludeId ? { id: { not: excludeId } } : {}) },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function getMostReadArticles(limit = 6) {
  return prisma.article.findMany({
    where: { status: PUBLISHED },
    orderBy: { views: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function getArticlesByCategory(category: string, limit = 8) {
  return prisma.article.findMany({
    where: { status: PUBLISHED, category },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function getPaginatedByChampionship(championshipQuery: string, page = 1, pageSize = 18) {
  const where = {
    status: PUBLISHED,
    championship: { contains: championshipQuery, mode: "insensitive" as const },
  };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: cardSelect,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getArticlesByCountry(country: string, limit = 20, page = 1) {
  const pageSize = limit;
  return prisma.article.findMany({
    where: { status: PUBLISHED, country },
    orderBy: { publishedAt: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
    select: cardSelect,
  });
}

export async function getPaginatedArticles(page = 1, pageSize = 18, category?: string) {
  const where = { status: PUBLISHED, ...(category ? { category } : {}) };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      select: cardSelect,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function searchArticles(query: string, limit = 20) {
  return prisma.article.findMany({
    where: {
      status: PUBLISHED,
      OR: [
        { translatedTitle: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      source: { select: { name: true, url: true, country: true } },
      tags: { include: { tag: true } },
    },
  });
  if (!article || article.status !== PUBLISHED) return null;
  return article;
}

export async function incrementArticleViews(id: string) {
  await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});
}

export async function getRelatedArticles(category: string, excludeId: string, limit = 4) {
  return prisma.article.findMany({
    where: { status: PUBLISHED, category, id: { not: excludeId } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: cardSelect,
  });
}

export type ArticleCard = Awaited<ReturnType<typeof getLatestArticles>>[number];
