import Parser from "rss-parser";
import slugify from "slugify";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { sources, type SourceConfig } from "@/config/sources";
import { processArticleWithAi } from "@/lib/ai";
import { extractOgImage, getHomepageDefaultImage } from "@/lib/extract-image";
import { getCategoryStockPhoto } from "@/lib/stock-photo";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "MotorNewsGlobalBot/1.0 (+https://motornewsglobal.com)" },
});

function hashTitle(title: string): string {
  return createHash("sha256").update(title.trim().toLowerCase()).digest("hex");
}

function uniqueSlug(title: string, fallbackId: string): string {
  const base = slugify(title, { lower: true, strict: true, locale: "pt" }).slice(0, 80);
  return base ? `${base}-${fallbackId.slice(-6)}` : fallbackId;
}

/** Roda `fn` sobre `items` com no máximo `concurrency` execuções simultâneas. */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

interface ImportSummary {
  source: string;
  imported: number;
  skipped: number;
  errors: number;
  errorDetail?: string;
}

async function ensureSourceRow(config: SourceConfig) {
  return prisma.source.upsert({
    where: { url: config.url },
    create: {
      name: config.name,
      url: config.url,
      rssUrl: config.rssUrl,
      country: config.country,
      language: config.language,
      category: config.category,
      active: config.active,
    },
    update: {
      rssUrl: config.rssUrl,
      active: config.active,
    },
  });
}

async function importFromSource(config: SourceConfig): Promise<ImportSummary> {
  const summary: ImportSummary = { source: config.name, imported: 0, skipped: 0, errors: 0 };

  if (!config.active) {
    return summary;
  }

  const sourceRow = await ensureSourceRow(config);

  let feed: Parser.Output<Record<string, unknown>>;
  try {
    feed = await parser.parseURL(config.rssUrl);
  } catch (err) {
    summary.errors += 1;
    summary.errorDetail = err instanceof Error ? err.message : String(err);
    return summary;
  }

  const items = (feed.items ?? []).slice(0, 15);

  await mapWithConcurrency(items, 5, async (item) => {
    const originalTitle = item.title?.trim();
    const originalUrl = item.link?.trim();
    if (!originalTitle || !originalUrl) {
      summary.skipped += 1;
      return;
    }

    const hash = hashTitle(originalTitle);

    const existing = await prisma.article.findFirst({
      where: { OR: [{ originalUrl }, { hash }] },
      select: { id: true },
    });
    if (existing) {
      summary.skipped += 1;
      return;
    }

    const excerptSource =
      (item.contentSnippet as string | undefined) ??
      (item.summary as string | undefined) ??
      (item.content as string | undefined) ??
      "";
    const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();

    try {
      const ai = await processArticleWithAi({
        title: originalTitle,
        sourceName: config.name,
        sourceCountry: config.country,
        language: config.language,
        excerpt: excerptSource.slice(0, 2500),
        url: originalUrl,
      });

      if (!ai.isRelevant) {
        summary.skipped += 1;
        return;
      }

      let imageUrl: string | null =
        (item.enclosure?.url as string | undefined) ??
        ((item as Record<string, unknown>)["media:content"] as { $: { url?: string } } | undefined)?.$?.url ??
        null;
      if (!imageUrl) {
        const ogImage = await extractOgImage(originalUrl);
        const homepageDefault = await getHomepageDefaultImage(config.url);
        imageUrl = ogImage && ogImage !== homepageDefault ? ogImage : null;
      }
      if (!imageUrl) {
        imageUrl = await getCategoryStockPhoto(ai.category);
      }

      const created = await prisma.article.create({
        data: {
          sourceId: sourceRow.id,
          originalTitle,
          translatedTitle: ai.translatedTitle,
          slug: "",
          summary: ai.summary,
          excerpt: ai.excerpt,
          originalUrl,
          imageUrl,
          category: ai.category,
          championship: ai.championship,
          country: ai.country,
          language: config.language,
          publishedAt,
          hash,
          seoTitle: ai.seoTitle,
          seoDescription: ai.seoDescription,
        },
      });

      const slug = uniqueSlug(ai.translatedTitle, created.id);
      await prisma.article.update({ where: { id: created.id }, data: { slug } });

      if (ai.tags.length > 0) {
        for (const tagName of ai.tags) {
          const tagSlug = slugify(tagName, { lower: true, strict: true, locale: "pt" });
          if (!tagSlug) continue;
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            create: { name: tagName, slug: tagSlug },
            update: {},
          });
          await prisma.articleTag.upsert({
            where: { articleId_tagId: { articleId: created.id, tagId: tag.id } },
            create: { articleId: created.id, tagId: tag.id },
            update: {},
          });
        }
      }

      summary.imported += 1;
    } catch (err) {
      summary.errors += 1;
      summary.errorDetail = err instanceof Error ? err.message : String(err);
    }
  });

  return summary;
}

export interface RunNewsImportOptions {
  /** Limita a quantidade de fontes processadas nesta execução (útil para testes manuais). */
  sourceLimit?: number;
  /** Processa apenas fontes cujo nome contém este texto (case-insensitive). */
  sourceNameFilter?: string;
}

export async function runNewsImport(
  options: RunNewsImportOptions = {},
): Promise<{ summaries: ImportSummary[]; totalImported: number }> {
  const summaries: ImportSummary[] = [];

  let targets = sources;
  if (options.sourceNameFilter) {
    const needle = options.sourceNameFilter.toLowerCase();
    targets = targets.filter((s) => s.name.toLowerCase().includes(needle));
  }
  if (options.sourceLimit) {
    targets = targets.slice(0, options.sourceLimit);
  }

  const results = await mapWithConcurrency(targets, 6, async (config) => {
    const summary = await importFromSource(config);

    await prisma.importLog.create({
      data: {
        sourceName: config.name,
        imported: summary.imported,
        skipped: summary.skipped,
        errors: summary.errors,
        errorDetail: summary.errorDetail,
        finishedAt: new Date(),
      },
    });

    return summary;
  });
  summaries.push(...results);

  const totalImported = summaries.reduce((acc, s) => acc + s.imported, 0);

  await randomizeFeaturedArticle();

  return { summaries, totalImported };
}

/**
 * Sorteia uma notícia recente para ser a manchete da home a cada execução do
 * cron (a cada 15 minutos), para a capa não ficar sempre com a mesma notícia.
 */
async function randomizeFeaturedArticle(): Promise<void> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const count = await prisma.article.count({ where: { status: "PUBLISHED", publishedAt: { gte: since } } });
  if (count === 0) return;

  const skip = Math.floor(Math.random() * count);
  const [randomArticle] = await prisma.article.findMany({
    where: { status: "PUBLISHED", publishedAt: { gte: since } },
    select: { id: true },
    skip,
    take: 1,
  });
  if (!randomArticle) return;

  await prisma.article.updateMany({ where: { featured: true }, data: { featured: false } });
  await prisma.article.update({ where: { id: randomArticle.id }, data: { featured: true } });
}
