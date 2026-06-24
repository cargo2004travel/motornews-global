import * as cheerio from "cheerio";

const LOGO_LIKE_PATTERN = /logo|favicon|sprite|placeholder|default[-_]?(image|share|avatar)|avatar|icon[-_]?(192|512|default)/i;

/**
 * Extrai a imagem pública (og:image / twitter:image) da página original.
 * Usado apenas como fallback quando o item do RSS não traz imagem própria —
 * é metadata pública destinada a preview/hotlink, nunca o conteúdo do artigo.
 */
export async function extractOgImage(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "MotorNewsGlobalBot/1.0 (+https://motornewsglobal.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const og =
      $('meta[property="og:image"]').attr("content") ??
      $('meta[name="twitter:image"]').attr("content") ??
      null;
    if (og && LOGO_LIKE_PATTERN.test(og)) return null;
    return og ?? null;
  } catch {
    return null;
  }
}

const homepageDefaultImageCache = new Map<string, string | null>();

/**
 * Muitos veículos (ex.: Globo Esporte) retornam o mesmo og:image "padrão" (logo/marca)
 * em toda página quando a matéria não tem foto própria. Para não usar esse logo como
 * se fosse a foto da notícia, comparamos com o og:image da home do veículo — se forem
 * iguais, tratamos como "sem imagem real".
 */
export async function getHomepageDefaultImage(siteUrl: string): Promise<string | null> {
  if (homepageDefaultImageCache.has(siteUrl)) {
    return homepageDefaultImageCache.get(siteUrl)!;
  }
  const image = await extractOgImage(siteUrl);
  homepageDefaultImageCache.set(siteUrl, image);
  return image;
}
