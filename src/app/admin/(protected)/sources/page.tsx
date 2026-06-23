import { prisma } from "@/lib/prisma";
import { SourceToggle } from "@/components/admin/source-toggle";
import { AddSourceForm } from "@/components/admin/add-source-form";

export default async function AdminSourcesPage() {
  const sources = await prisma.source.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] });

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold">Fontes ({sources.length})</h1>

      <div className="mt-6">
        <AddSourceForm />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2">Nome</th>
              <th className="py-2">País</th>
              <th className="py-2">Categoria</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id} className="border-b border-border">
                <td className="py-2">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-red">
                    {s.name}
                  </a>
                </td>
                <td className="py-2">{s.country}</td>
                <td className="py-2">{s.category}</td>
                <td className="py-2">
                  <SourceToggle id={s.id} active={s.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
