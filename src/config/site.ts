export const SITE_NAME = "MotorNews Global";
export const SITE_TAGLINE = "Automobilismo e motociclismo, direto da pista";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_DESCRIPTION =
  "Cobertura agregada de Fórmula 1, MotoGP, IndyCar, WRC, Nascar, Stock Car e mais — com resumo em português e link sempre para a fonte original.";

export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Notícias", href: "/noticias" },
  { label: "Fórmula 1", href: "/campeonato/formula-1" },
  { label: "MotoGP", href: "/campeonato/motogp" },
  { label: "IndyCar", href: "/campeonato/indycar" },
  { label: "WRC", href: "/campeonato/wrc" },
  { label: "Nascar", href: "/campeonato/nascar" },
  { label: "Fontes", href: "/fontes" },
];

export const FOOTER_LINKS = [
  { label: "Sobre", href: "/sobre" },
  { label: "Política editorial", href: "/politica-editorial" },
  { label: "Fontes", href: "/fontes" },
  { label: "Contato", href: "/contato" },
  { label: "Newsletter", href: "/newsletter" },
];
