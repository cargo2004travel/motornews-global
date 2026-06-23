import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2 text-sm">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="rounded border border-border px-3 py-1.5 hover:bg-muted">
          ← Anterior
        </Link>
      )}
      <span className="px-3 py-1.5 text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="rounded border border-border px-3 py-1.5 hover:bg-muted">
          Próxima →
        </Link>
      )}
    </nav>
  );
}
