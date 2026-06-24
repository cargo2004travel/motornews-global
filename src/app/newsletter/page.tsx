import type { Metadata } from "next";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Assine a newsletter do MotorNews Global e receba o resumo das principais notícias.",
};

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ unsubscribed?: string }>;
}) {
  const { unsubscribed } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <h1 className="font-headline text-3xl font-bold">Newsletter MotorNews Global</h1>
      <p className="mt-4 text-muted-foreground">
        Receba, direto no seu e-mail, o resumo das 10 principais notícias do dia de Fórmula 1, MotoGP,
        IndyCar, WRC, Nascar e muito mais.
      </p>
      {unsubscribed && (
        <p className="mt-4 rounded bg-muted px-4 py-3 text-sm text-muted-foreground">
          Você foi removido da nossa lista de e-mails.
        </p>
      )}
      <div className="mt-8 mx-auto max-w-sm">
        <NewsletterForm />
      </div>
    </div>
  );
}
