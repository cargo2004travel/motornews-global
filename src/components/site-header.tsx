import Link from "next/link";
import { NAV_LINKS } from "@/config/site";
import { SearchForm } from "@/components/search-form";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="font-headline text-2xl font-bold tracking-tight">
          Motor<span className="text-accent-red">News</span> Global
        </Link>

        <nav className="hidden items-center gap-4 text-xs font-medium lg:flex xl:gap-5 xl:text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap hover:text-accent-red transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <SearchForm className="hidden md:block" />
          <Link
            href="/newsletter"
            className="rounded bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-accent-red transition-colors"
          >
            Newsletter
          </Link>
        </div>
      </div>
      <div className="border-t border-border bg-muted lg:hidden">
        <nav className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-2 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-accent-red">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
