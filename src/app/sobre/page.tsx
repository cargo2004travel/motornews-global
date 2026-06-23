import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça o MotorNews Global e como produzimos nossa cobertura.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose prose-neutral">
      <h1 className="font-headline text-3xl font-bold">Sobre o MotorNews Global</h1>
      <p className="mt-4 text-muted-foreground">
        O MotorNews Global é um portal de notícias agregadas sobre automobilismo de competição e
        motociclismo. Monitoramos dezenas de veículos especializados pelo mundo — Fórmula 1, MotoGP,
        IndyCar, WRC, Nascar, Stock Car e outras categorias — e publicamos resumos jornalísticos originais
        em português, atualizados automaticamente a cada 30 minutos.
      </p>
      <p className="mt-4 text-muted-foreground">
        Não somos afiliados a nenhuma das fontes que monitoramos. Cada matéria publicada aqui traz um
        resumo próprio, nunca o texto integral original, e sempre um link direto para a fonte — veja nossa{" "}
        <a href="/politica-editorial" className="text-accent-blue hover:underline">política editorial</a>.
      </p>
    </div>
  );
}
