import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do MotorNews Global.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-headline text-3xl font-bold">Contato</h1>
      <p className="mt-4 text-muted-foreground">
        Para dúvidas, correções, solicitações de remoção ou parcerias com veículos de imprensa, escreva
        para:
      </p>
      <p className="mt-2 text-lg font-semibold text-accent-blue">contato@motornewsglobal.com</p>
      <p className="mt-6 text-sm text-muted-foreground">
        Se você representa um veículo de imprensa e deseja ajustar como suas notícias são referenciadas
        aqui — incluindo remoção de uma fonte — responderemos em até 5 dias úteis.
      </p>
    </div>
  );
}
