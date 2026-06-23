import { prisma } from "@/lib/prisma";

export default async function AdminLogsPage() {
  const logs = await prisma.importLog.findMany({ orderBy: { startedAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold">Logs de importação</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2">Quando</th>
              <th className="py-2">Fonte</th>
              <th className="py-2">Importadas</th>
              <th className="py-2">Ignoradas</th>
              <th className="py-2">Erros</th>
              <th className="py-2">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border">
                <td className="py-2 whitespace-nowrap">{log.startedAt.toLocaleString("pt-BR")}</td>
                <td className="py-2">{log.sourceName}</td>
                <td className="py-2">{log.imported}</td>
                <td className="py-2">{log.skipped}</td>
                <td className="py-2">{log.errors}</td>
                <td className="max-w-xs truncate py-2 text-xs text-muted-foreground">{log.errorDetail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
