import Link from "next/link";
import { formatRelative } from "@/lib/format";
import { toSlug } from "@/config/taxonomy";
import type { ArticleCard as ArticleCardData } from "@/lib/articles";

/**
 * Imagens vêm de dezenas de domínios de fontes externas (hotlink/og:image público),
 * impossível de pré-cadastrar em next.config images.remotePatterns. Por isso usamos
 * <img> nativo com lazy loading em vez de next/image, que exige allowlist de domínio.
 */
export function ArticleCard({
  article,
  size = "default",
}: {
  article: ArticleCardData;
  size?: "default" | "large" | "compact";
}) {
  const categorySlug = toSlug(article.category);

  if (size === "compact") {
    return (
      <Link href={`/noticias/${article.slug}`} className="flex gap-3 group">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            className="h-16 w-24 flex-shrink-0 rounded object-cover"
          />
        )}
        <div>
          <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent-red">
            {article.translatedTitle}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{formatRelative(article.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  if (size === "large") {
    return (
      <Link href={`/noticias/${article.slug}`} className="group block">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full rounded object-cover"
          />
        )}
        <span className="mt-3 inline-block rounded bg-accent-red px-2 py-0.5 text-xs font-bold uppercase text-white">
          {article.category}
        </span>
        <h2 className="font-headline mt-2 text-2xl font-bold leading-tight group-hover:text-accent-red md:text-3xl">
          {article.translatedTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {article.source.name} · {formatRelative(article.publishedAt)}
        </p>
      </Link>
    );
  }

  return (
    <div className="group">
      <Link href={`/noticias/${article.slug}`}>
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-[16/10] w-full rounded object-cover"
          />
        )}
      </Link>
      <Link
        href={`/categoria/${categorySlug}`}
        className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-accent-red hover:underline"
      >
        {article.category}
      </Link>
      <Link href={`/noticias/${article.slug}`}>
        <h3 className="font-headline mt-1 text-lg font-bold leading-snug line-clamp-2 group-hover:text-accent-red">
          {article.translatedTitle}
        </h3>
      </Link>
      <p className="mt-2 text-xs text-muted-foreground">
        {article.source.name} · {formatRelative(article.publishedAt)}
      </p>
    </div>
  );
}
