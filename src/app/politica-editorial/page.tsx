import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política editorial",
  description: "Como o MotorNews Global produz, traduz e atribui suas notícias.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose prose-neutral">
      <h1 className="font-headline text-3xl font-bold">Política editorial</h1>

      <h2 className="font-headline mt-8 text-xl font-bold">Como produzimos cada notícia</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Monitoramos RSS de veículos de imprensa especializados e agregadores públicos.</li>
        <li>Cada notícia recebe um resumo jornalístico próprio, escrito a partir do título e do trecho público disponível — nunca copiamos o texto integral.</li>
        <li>O título é traduzido para o português do Brasil; o título original também é preservado internamente.</li>
        <li>A fonte, o nome do veículo e a data de publicação original são sempre exibidos.</li>
        <li>Toda matéria traz um link direto para a publicação original.</li>
        <li>Imagens são usadas apenas quando disponibilizadas publicamente pela fonte (metadata de preview / hotlink), nunca extraídas do corpo do artigo.</li>
      </ul>

      <h2 className="font-headline mt-8 text-xl font-bold">O que não fazemos</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Não republicamos conteúdo integral protegido por direitos autorais.</li>
        <li>Não removemos ou ocultamos a autoria original.</li>
        <li>Não inventamos fatos: nosso processo de resumo é orientado a não adicionar informação que não esteja na fonte.</li>
      </ul>

      <h2 className="font-headline mt-8 text-xl font-bold">Correções</h2>
      <p className="mt-3 text-muted-foreground">
        Encontrou uma informação incorreta ou um problema de atribuição? Entre em contato pela{" "}
        <a href="/contato" className="text-accent-blue hover:underline">página de contato</a>.
      </p>
    </div>
  );
}
