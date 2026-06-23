import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [articleCount, sourceCount, activeSourceCount, lastImport] = await Promise.all([
    prisma.article.count(),
    prisma.source.count(),
    prisma.source.count({ where: { active: true } }),
    prisma.importLog.findFirst({ orderBy: { startedAt: "desc" } }),
  ]);

  const stats = [
    { label: "Notícias importadas", value: articleCount },
    { label: "Fontes cadastradas", value: sourceCount },
    { label: "Fontes ativas", value: activeSourceCount },
  ];

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold">Visão geral</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded border border-border p-5">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {lastImport && (
        <p className="mt-6 text-sm text-muted-foreground">
          Última execução do cron: {lastImport.startedAt.toLocaleString("pt-BR")} — {lastImport.imported}{" "}
          importadas, {lastImport.skipped} ignoradas, {lastImport.errors} erros.
        </p>
      )}
    </div>
  );
}
