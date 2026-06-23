export interface TaxonomyItem {
  name: string;
  slug: string;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CATEGORIES: TaxonomyItem[] = [
  "Fórmula 1",
  "Fórmula 2",
  "Fórmula 3",
  "Fórmula 4",
  "IndyCar",
  "Nascar",
  "WEC",
  "IMSA",
  "WRC",
  "Rally Dakar",
  "Rally regional",
  "Stock Car",
  "Turismo",
  "GT3",
  "Porsche Cup",
  "Kart",
  "Motociclismo",
  "MotoGP",
  "Moto2",
  "Moto3",
  "Superbike",
  "Motocross",
  "Enduro",
  "Arrancada",
  "Dragster",
  "Fórmula E",
  "Automobilismo histórico",
  "Mercado e bastidores",
  "Tecnologia de competição",
].map((name) => ({ name, slug: toSlug(name) }));

/** Subconjunto exibido em destaque na home, na ordem pedida. */
export const HOME_CHAMPIONSHIP_BLOCKS = [
  "Fórmula 1",
  "MotoGP",
  "IndyCar",
  "WRC",
  "Stock Car",
  "Nascar",
  "Arrancada",
  "Motociclismo",
].map((name) => CATEGORIES.find((c) => c.name === name)!);

export const COUNTRIES: TaxonomyItem[] = [
  "Brasil",
  "Estados Unidos",
  "Canadá",
  "Reino Unido",
  "Argentina",
  "México",
  "Portugal",
  "Espanha",
  "Itália",
  "Alemanha",
  "Bélgica",
  "França",
  "Holanda",
  "Austrália",
  "Nova Zelândia",
  "Japão",
  "China",
  "Oriente Médio",
  "África do Sul",
  "América Latina",
  "Europa",
  "Ásia",
  "Oceania",
  "Internacional",
].map((name) => ({ name, slug: toSlug(name) }));

export function findCategoryBySlug(slug: string): TaxonomyItem | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findCountryBySlug(slug: string): TaxonomyItem | undefined {
  return COUNTRIES.find((c) => c.slug === slug);
}

export { toSlug };
