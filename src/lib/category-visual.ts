const PALETTE = [
  "#E10600",
  "#0057FF",
  "#FFD000",
  "#111111",
  "#7A1FA2",
  "#0F8A5F",
  "#C2410C",
  "#1D4ED8",
];

/** Cor estável por categoria (mesmo hash sempre dá a mesma cor). */
export function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

/** true se a cor de fundo exige texto claro por cima (contraste). */
export function needsLightText(hex: string): boolean {
  return hex !== "#FFD000";
}
