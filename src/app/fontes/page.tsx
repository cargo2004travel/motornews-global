import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fontes",
  description: "Veículos de imprensa monitorados pelo MotorNews Global, organizados por país.",
};

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    where: { active: true },
    orderBy: [{ country: "asc" }, { name: "asc" }],
  });

  const byCountry = sources.reduce<Record<string, typeof sources>>((acc, s) => {
    (acc[s.country] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-headline text-2xl font-bold border-b border-border pb-3">Fontes monitoradas</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        O MotorNews Global agrega e resume notícias publicadas por estes veículos, sempre com link para a
        matéria original. Atualmente {sources.length} fonte(s) ativa(s).
      </p>

      <div className="mt-8 space-y-8">
        {Object.entries(byCountry).map(([country, list]) => (
          <section key={country}>
            <h2 className="font-headline text-lg font-bold">{country}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {list.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-red">
                    {s.name}
                  </a>
                  <span className="text-xs text-muted-foreground">{s.category}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
