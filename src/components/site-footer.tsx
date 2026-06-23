import Link from "next/link";
import { FOOTER_LINKS, SITE_DESCRIPTION } from "@/config/site";
import { CATEGORIES } from "@/config/taxonomy";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <p className="font-headline text-xl font-bold">
              Motor<span className="text-accent-red">News</span> Global
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Institucional</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-red">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide">Categorias</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categoria/${cat.slug}`} className="hover:text-accent-red">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} MotorNews Global. Todo o conteúdo é um resumo jornalístico original
            produzido a partir de notícias publicadas por veículos de imprensa especializados, sempre com link
            para a fonte original. Não reproduzimos textos integrais protegidos por direitos autorais.
          </p>
        </div>
      </div>
    </footer>
  );
}
