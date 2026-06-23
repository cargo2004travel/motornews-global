import { Search } from "lucide-react";

export function SearchForm({ className }: { className?: string }) {
  return (
    <form action="/noticias" method="get" className={className}>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          placeholder="Buscar notícias…"
          className="w-56 rounded border border-border bg-muted py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
        />
      </label>
    </form>
  );
}
