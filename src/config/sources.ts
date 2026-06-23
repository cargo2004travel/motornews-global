/**
 * Catálogo de fontes de notícias do MotorNews Global.
 *
 * Estratégia de cobertura:
 * 1) Feeds RSS oficiais/diretos de veículos especializados, verificados manualmente
 *    (kind: "direct"). Estes são priorizados sempre que existirem (regra do projeto).
 * 2} Feeds do Google News por categoria e por país (kind: "google-news"), usados para
 *    cobrir campeonatos e regiões sem RSS direto estável. Google News RSS sempre linka
 *    para a matéria original na fonte — compatível com a regra de nunca publicar
 *    conteúdo integral e sempre citar a fonte.
 *
 * Novas fontes diretas devem ser adicionadas com kind: "direct" e rssUrl confirmado.
 * Ver /admin/sources para ativar/desativar fontes sem precisar editar este arquivo.
 */

export type SourceKind = "direct" | "google-news";

export interface SourceConfig {
  name: string;
  url: string;
  rssUrl: string;
  country: string;
  language: string;
  category: string;
  kind: SourceKind;
  active: boolean;
}

function googleNewsFeed(query: string, hl: string, gl: string, ceid: string): string {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

/** Fontes diretas verificadas (RSS oficial do próprio veículo). */
const directSources: SourceConfig[] = [
  { name: "Motorsport.com", url: "https://www.motorsport.com", rssUrl: "https://www.motorsport.com/rss/all/news/", country: "Internacional", language: "en", category: "Automobilismo histórico", kind: "direct", active: true },
  { name: "Motorsport.com F1", url: "https://www.motorsport.com/f1/", rssUrl: "https://www.motorsport.com/rss/f1/news/", country: "Internacional", language: "en", category: "Fórmula 1", kind: "direct", active: true },
  { name: "Motorsport.com NASCAR", url: "https://www.motorsport.com/nascar/", rssUrl: "https://www.motorsport.com/rss/nascar/news/", country: "Estados Unidos", language: "en", category: "Nascar", kind: "direct", active: true },
  { name: "Motorsport.com MotoGP", url: "https://www.motorsport.com/motogp/", rssUrl: "https://www.motorsport.com/rss/motogp/news/", country: "Internacional", language: "en", category: "MotoGP", kind: "direct", active: true },
  { name: "Motorsport.com IndyCar", url: "https://www.motorsport.com/indycar/", rssUrl: "https://www.motorsport.com/rss/indycar/news/", country: "Estados Unidos", language: "en", category: "IndyCar", kind: "direct", active: true },
  { name: "Motorsport.com WEC", url: "https://www.motorsport.com/wec/", rssUrl: "https://www.motorsport.com/rss/wec/news/", country: "Internacional", language: "en", category: "WEC", kind: "direct", active: true },
  { name: "Motorsport.com WRC", url: "https://www.motorsport.com/wrc/", rssUrl: "https://www.motorsport.com/rss/wrc/news/", country: "Internacional", language: "en", category: "WRC", kind: "direct", active: true },
  { name: "Motorsport.com WSBK", url: "https://www.motorsport.com/wsbk/", rssUrl: "https://www.motorsport.com/rss/wsbk/news/", country: "Internacional", language: "en", category: "Superbike", kind: "direct", active: true },
  { name: "Motorsport.com Fórmula E", url: "https://www.motorsport.com/formula-e/", rssUrl: "https://www.motorsport.com/rss/formula-e/news/", country: "Internacional", language: "en", category: "Fórmula E", kind: "direct", active: true },
  { name: "Autosport", url: "https://www.autosport.com", rssUrl: "https://www.autosport.com/rss/feed/autosport", country: "Reino Unido", language: "en", category: "Fórmula 1", kind: "direct", active: true },
  { name: "The Race", url: "https://the-race.com", rssUrl: "https://the-race.com/feed/", country: "Reino Unido", language: "en", category: "Automobilismo histórico", kind: "direct", active: true },
  { name: "Racer", url: "https://racer.com", rssUrl: "https://racer.com/feed/", country: "Estados Unidos", language: "en", category: "IndyCar", kind: "direct", active: true },
  { name: "Formula1.com", url: "https://www.formula1.com", rssUrl: "https://www.formula1.com/en/latest/all.xml", country: "Internacional", language: "en", category: "Fórmula 1", kind: "direct", active: true },
  { name: "Jalopnik", url: "https://jalopnik.com", rssUrl: "https://jalopnik.com/rss", country: "Estados Unidos", language: "en", category: "Mercado e bastidores", kind: "direct", active: true },
  { name: "Motor1", url: "https://www.motor1.com", rssUrl: "https://www.motor1.com/rss/news/all/", country: "Internacional", language: "en", category: "Mercado e bastidores", kind: "direct", active: true },
  { name: "PlanetF1", url: "https://www.planetf1.com", rssUrl: "https://www.planetf1.com/rss", country: "Reino Unido", language: "en", category: "Fórmula 1", kind: "direct", active: true },
  { name: "Motorsport Week", url: "https://www.motorsportweek.com", rssUrl: "https://www.motorsportweek.com/feed/", country: "Reino Unido", language: "en", category: "Automobilismo histórico", kind: "direct", active: true },
  { name: "Crash.net", url: "https://www.crash.net", rssUrl: "https://www.crash.net/rss/all", country: "Reino Unido", language: "en", category: "Automobilismo histórico", kind: "direct", active: true },
  { name: "Auto Motor und Sport", url: "https://www.auto-motor-und-sport.de", rssUrl: "https://www.auto-motor-und-sport.de/rss/news/", country: "Alemanha", language: "de", category: "Mercado e bastidores", kind: "direct", active: true },
  { name: "Motorsport-Total", url: "https://www.motorsport-total.com", rssUrl: "https://www.motorsport-total.com/rss/rss.xml", country: "Alemanha", language: "de", category: "Automobilismo histórico", kind: "direct", active: true },
  { name: "Motorsport-Total Fórmula 1", url: "https://www.motorsport-total.com/formel-1/", rssUrl: "https://www.motorsport-total.com/rss/rss_formel-1.xml", country: "Alemanha", language: "de", category: "Fórmula 1", kind: "direct", active: true },
  { name: "Grande Prêmio", url: "https://grandepremio.com/br/", rssUrl: "https://grandepremio.com/br/feed/", country: "Brasil", language: "pt-BR", category: "Fórmula 1", kind: "direct", active: true },
  { name: "Tribuna do Motorsport", url: "https://tribunadomotorsport.com", rssUrl: "https://tribunadomotorsport.com/feed/", country: "Brasil", language: "pt-BR", category: "Stock Car", kind: "direct", active: true },
  { name: "RaceFans", url: "https://www.racefans.net", rssUrl: "https://www.racefans.net/feed/", country: "Reino Unido", language: "en", category: "Fórmula 1", kind: "direct", active: true },
  { name: "Speedcafe", url: "https://www.speedcafe.com", rssUrl: "https://www.speedcafe.com/feed/", country: "Austrália", language: "en", category: "Turismo", kind: "direct", active: true },
  { name: "NASCAR.com", url: "https://www.nascar.com", rssUrl: "https://www.nascar.com/feed/", country: "Estados Unidos", language: "en", category: "Nascar", kind: "direct", active: true },
];

/** Cobertura por categoria via Google News (preenche campeonatos sem RSS direto estável). */
const categoryQueries: { category: string; query: string }[] = [
  { category: "Fórmula 2", query: "Fórmula 2 OR Formula 2 FIA" },
  { category: "Fórmula 3", query: "Fórmula 3 OR Formula 3 FIA" },
  { category: "Fórmula 4", query: "Fórmula 4 OR Formula 4 FIA" },
  { category: "WEC", query: "WEC endurance Le Mans Hypercar" },
  { category: "IMSA", query: "IMSA WeatherTech SportsCar" },
  { category: "WRC", query: "WRC rally championship" },
  { category: "Rally Dakar", query: "Rally Dakar" },
  { category: "Rally regional", query: "rally regional championship" },
  { category: "Stock Car", query: "Stock Car Pro Series Brasil" },
  { category: "Turismo", query: "carro de turismo campeonato touring car" },
  { category: "GT3", query: "GT3 championship racing" },
  { category: "Porsche Cup", query: "Porsche Cup Carrera Cup" },
  { category: "Kart", query: "kartismo karting championship" },
  { category: "Motociclismo", query: "motociclismo motorcycle racing" },
  { category: "Moto2", query: "Moto2 championship" },
  { category: "Moto3", query: "Moto3 championship" },
  { category: "Superbike", query: "WorldSBK Superbike championship" },
  { category: "Motocross", query: "motocross MXGP championship" },
  { category: "Enduro", query: "enduro motorcycle championship" },
  { category: "Arrancada", query: "arrancada drag racing carro" },
  { category: "Dragster", query: "dragster NHRA drag racing" },
  { category: "Fórmula E", query: "Formula E championship" },
  { category: "Automobilismo histórico", query: "automobilismo histórico classic motorsport" },
  { category: "Mercado e bastidores", query: "mercado pilotos transferência equipe motorsport" },
  { category: "Tecnologia de competição", query: "tecnologia motorsport engenharia corrida" },
  { category: "IndyCar", query: "IndyCar series championship" },
];

/** Cobertura por país/região via Google News (idioma e domínio local). */
const countryQueries: { country: string; query: string; hl: string; gl: string; ceid: string }[] = [
  { country: "Brasil", query: "automobilismo OR motociclismo corrida", hl: "pt-BR", gl: "BR", ceid: "BR:pt-BR" },
  { country: "Argentina", query: "automovilismo OR motociclismo carrera", hl: "es-419", gl: "AR", ceid: "AR:es-419" },
  { country: "México", query: "automovilismo OR motociclismo carrera", hl: "es-419", gl: "MX", ceid: "MX:es-419" },
  { country: "Portugal", query: "automobilismo OR motociclismo corrida", hl: "pt-PT", gl: "PT", ceid: "PT:pt-PT" },
  { country: "Espanha", query: "automovilismo OR motociclismo carrera", hl: "es", gl: "ES", ceid: "ES:es" },
  { country: "Itália", query: "motorsport OR motociclismo gara", hl: "it", gl: "IT", ceid: "IT:it" },
  { country: "França", query: "sport automobile OR moto course", hl: "fr", gl: "FR", ceid: "FR:fr" },
  { country: "Bélgica", query: "sport automobile motorsport", hl: "fr", gl: "BE", ceid: "BE:fr" },
  { country: "Holanda", query: "motorsport OR motorcoureur race", hl: "nl", gl: "NL", ceid: "NL:nl" },
  { country: "Reino Unido", query: "motorsport OR motorcycle racing", hl: "en-GB", gl: "GB", ceid: "GB:en" },
  { country: "Estados Unidos", query: "motorsport racing OR motorcycle racing", hl: "en-US", gl: "US", ceid: "US:en" },
  { country: "Canadá", query: "motorsport racing Canada", hl: "en-CA", gl: "CA", ceid: "CA:en" },
  { country: "Austrália", query: "motorsport racing Australia", hl: "en-AU", gl: "AU", ceid: "AU:en" },
  { country: "Nova Zelândia", query: "motorsport racing New Zealand", hl: "en-NZ", gl: "NZ", ceid: "NZ:en" },
  { country: "Japão", query: "モータースポーツ OR オートバイ レース", hl: "ja", gl: "JP", ceid: "JP:ja" },
  { country: "China", query: "赛车 OR 摩托车比赛", hl: "zh-CN", gl: "CN", ceid: "CN:zh-CN" },
  { country: "Oriente Médio", query: "motorsport racing Middle East Saudi UAE", hl: "en", gl: "AE", ceid: "AE:en" },
  { country: "África do Sul", query: "motorsport racing South Africa", hl: "en-ZA", gl: "ZA", ceid: "ZA:en" },
  { country: "Alemanha", query: "motorsport OR motorrad rennen", hl: "de", gl: "DE", ceid: "DE:de" },
];

const googleNewsCategorySources: SourceConfig[] = categoryQueries.map(({ category, query }) => ({
  name: `Google News — ${category}`,
  url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
  rssUrl: googleNewsFeed(query, "pt-BR", "BR", "BR:pt-BR"),
  country: "Internacional",
  language: "pt-BR",
  category,
  kind: "google-news",
  active: true,
}));

const googleNewsCountrySources: SourceConfig[] = countryQueries.map(({ country, query, hl, gl, ceid }) => ({
  name: `Google News — ${country}`,
  url: `https://news.google.com/search?q=${encodeURIComponent(query)}&gl=${gl}`,
  rssUrl: googleNewsFeed(query, hl, gl, ceid),
  country,
  language: hl,
  category: "Mercado e bastidores",
  kind: "google-news",
  active: true,
}));

export const sources: SourceConfig[] = [
  ...directSources,
  ...googleNewsCategorySources,
  ...googleNewsCountrySources,
];

export const TOTAL_SOURCES = sources.length;
