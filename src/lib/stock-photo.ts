/**
 * Busca uma foto de uso livre (royalty-free, licenciada para uso comercial) relacionada
 * à categoria da notícia via Pexels. Usado apenas quando a fonte não trouxe imagem
 * própria — nunca substituímos uma foto real do veículo de imprensa.
 *
 * Por que Pexels e não "buscar na internet": fotos de piloto/carro/equipe encontradas
 * em busca genérica de imagens quase sempre pertencem a agências (Getty, Reuters etc.)
 * e usá-las sem licença é risco de direitos autorais — ainda mais em site com anúncios.
 * O Pexels garante licença gratuita para uso comercial, com atribuição opcional.
 */

const CATEGORY_QUERY: Record<string, string> = {
  "Fórmula 1": "formula 1 race car",
  "Fórmula 2": "formula racing car track",
  "Fórmula 3": "formula racing car track",
  "Fórmula 4": "formula racing car track",
  IndyCar: "indycar race",
  Nascar: "nascar stock car race",
  WEC: "endurance race car le mans",
  IMSA: "sports car racing track",
  WRC: "rally car dirt road",
  "Rally Dakar": "rally desert dakar",
  "Rally regional": "rally car",
  "Stock Car": "stock car racing brazil",
  Turismo: "touring car racing",
  GT3: "gt3 race car",
  "Porsche Cup": "porsche race car",
  Kart: "karting race",
  Motociclismo: "motorcycle racing",
  MotoGP: "motogp motorcycle race",
  Moto2: "motorcycle racing track",
  Moto3: "motorcycle racing track",
  Superbike: "superbike racing",
  Motocross: "motocross race",
  Enduro: "enduro motorcycle",
  Arrancada: "drag racing car",
  Dragster: "dragster race",
  "Fórmula E": "formula e electric race car",
  "Automobilismo histórico": "classic race car vintage",
  "Mercado e bastidores": "racing team pit stop",
  "Tecnologia de competição": "race car engineering",
};

const cache = new Map<string, string | null>();

export async function getCategoryStockPhoto(category: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  if (cache.has(category)) return cache.get(category)!;

  const query = CATEGORY_QUERY[category] ?? "motorsport racing";

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) {
      cache.set(category, null);
      return null;
    }
    const data = await res.json();
    const url: string | undefined = data?.photos?.[0]?.src?.large;
    cache.set(category, url ?? null);
    return url ?? null;
  } catch {
    cache.set(category, null);
    return null;
  }
}
