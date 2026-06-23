import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, COUNTRIES } from "@/config/taxonomy";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, importedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 5000,
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "always", priority: 1 },
    { url: `${SITE_URL}/noticias`, changeFrequency: "always", priority: 0.9 },
    { url: `${SITE_URL}/fontes`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politica-editorial`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contato`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/categoria/${c.slug}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const countryPages: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${SITE_URL}/pais/${c.slug}`,
    changeFrequency: "hourly",
    priority: 0.6,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/noticias/${a.slug}`,
    lastModified: a.importedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...countryPages, ...articlePages];
}
