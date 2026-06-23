import * as cheerio from "cheerio";

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
    return og ?? null;
  } catch {
    return null;
  }
}
