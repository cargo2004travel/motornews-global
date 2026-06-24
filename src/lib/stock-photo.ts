/**
 * Busca uma foto de uso livre (royalty-free / licença Creative Commons para uso
 * comercial) relacionada à categoria da notícia. Usado apenas quando a fonte não
 * trouxe imagem própria — nunca substituímos uma foto real do veículo de imprensa.
 *
 * Por que banco de imagens livres e não "buscar na internet" de forma genérica:
 * fotos de piloto/carro/equipe encontradas em busca de imagens comum quase sempre
 * pertencem a agências (Getty, Reuters etc.) e usá-las sem licença é risco de
 * direitos autorais — ainda mais em site com anúncios. Wikimedia Commons e Pexels
 * garantem licença para uso comercial. Mantemos um pool de fotos por categoria e
 * sorteamos uma a cada notícia, para não repetir sempre a mesma imagem.
 */

const CATEGORY_QUERY: Record<string, string> = {
  "Fórmula 1": "Formula One car racing",
  "Fórmula 2": "Formula racing car track",
  "Fórmula 3": "Formula racing car track",
  "Fórmula 4": "Formula racing car track",
  IndyCar: "IndyCar racing",
  Nascar: "NASCAR stock car racing",
  WEC: "endurance racing Le Mans car",
  IMSA: "sports car racing track",
  WRC: "World Rally Championship car",
  "Rally Dakar": "Dakar Rally desert",
  "Rally regional": "rally car racing",
  "Stock Car": "stock car racing Brazil",
  Turismo: "touring car racing",
  GT3: "GT3 race car",
  "Porsche Cup": "Porsche race car",
  Kart: "kart racing",
  Motociclismo: "motorcycle racing",
  MotoGP: "MotoGP motorcycle racing",
  Moto2: "motorcycle Grand Prix racing",
  Moto3: "motorcycle Grand Prix racing",
  Superbike: "Superbike racing motorcycle",
  Motocross: "motocross racing",
  Enduro: "enduro motorcycle racing",
  Arrancada: "drag racing car",
  Dragster: "dragster racing",
  "Fórmula E": "Formula E electric race car",
  "Automobilismo histórico": "classic race car vintage motorsport",
  "Mercado e bastidores": "racing team pit stop garage",
  "Tecnologia de competição": "race car engineering pit",
};

const USER_AGENT = "MotorNewsGlobalBot/1.0 (+https://motornewsglobal.com; contato@motornewsglobal.com)";

const poolCache = new Map<string, string[]>();

async function fetchPexelsPool(query: string): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
      { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.photos ?? [])
      .map((p: { src?: { large?: string } }) => p.src?.large)
      .filter((url: string | undefined): url is string => Boolean(url));
  } catch {
    return [];
  }
}

interface WikimediaImageInfo {
  url?: string;
  width?: number;
  height?: number;
}

async function fetchWikimediaPool(query: string): Promise<string[]> {
  try {
    const searchRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=15&format=json`,
      { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(8000) },
    );
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const titles: string[] = (searchData?.query?.search ?? []).map((r: { title: string }) => r.title);
    if (titles.length === 0) return [];

    const infoRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join("|"))}&prop=imageinfo&iiprop=url|size&iiurlwidth=1280&format=json`,
      { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(8000) },
    );
    if (!infoRes.ok) return [];
    const infoData = await infoRes.json();
    const pages = Object.values(infoData?.query?.pages ?? {}) as { imageinfo?: WikimediaImageInfo[] }[];

    return pages
      .map((p) => p.imageinfo?.[0])
      .filter((info): info is WikimediaImageInfo => Boolean(info?.url))
      .filter((info) => (info.width ?? 0) >= 500)
      .map((info) => info.url!);
  } catch {
    return [];
  }
}

async function getCategoryPool(category: string): Promise<string[]> {
  if (poolCache.has(category)) return poolCache.get(category)!;

  const query = CATEGORY_QUERY[category] ?? "motorsport racing";
  const [pexels, wikimedia] = await Promise.all([fetchPexelsPool(query), fetchWikimediaPool(query)]);
  const pool = [...pexels, ...wikimedia];

  poolCache.set(category, pool);
  return pool;
}

export async function getCategoryStockPhoto(category: string): Promise<string | null> {
  const pool = await getCategoryPool(category);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
