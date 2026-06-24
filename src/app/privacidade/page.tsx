import type { Metadata } from "next";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como o MotorNews Global coleta, usa e protege dados, incluindo cookies e publicidade.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 prose prose-neutral">
      <h1 className="font-headline text-3xl font-bold">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <h2 className="font-headline mt-8 text-xl font-bold">Dados que coletamos</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>E-mail informado voluntariamente ao assinar nossa newsletter.</li>
        <li>Dados de navegação coletados automaticamente por cookies e tecnologias semelhantes (ex.: páginas visitadas, dispositivo, localização aproximada).</li>
        <li>Não coletamos dados sensíveis nem exigimos cadastro para ler as notícias.</li>
      </ul>

      <h2 className="font-headline mt-8 text-xl font-bold">Publicidade e cookies (Google AdSense)</h2>
      <p className="mt-3 text-muted-foreground">
        Este site exibe anúncios fornecidos pelo Google AdSense. O Google e seus parceiros usam cookies
        para exibir anúncios com base em visitas anteriores do usuário a este e a outros sites. Isso
        permite que o Google e seus parceiros exibam anúncios personalizados para você.
      </p>
      <p className="mt-3 text-muted-foreground">
        Você pode desativar a publicidade personalizada acessando as{" "}
        <a
          href="https://adssettings.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue hover:underline"
        >
          Configurações de anúncios do Google
        </a>
        . Também é possível acessar{" "}
        <a
          href="https://www.aboutads.info/choices/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue hover:underline"
        >
          www.aboutads.info
        </a>{" "}
        para mais opções de opt-out de publicidade comportamental de terceiros.
      </p>

      <h2 className="font-headline mt-8 text-xl font-bold">Como usamos os dados</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li>Enviar a newsletter para quem se inscreveu, e nada além disso.</li>
        <li>Medir audiência e melhorar o site (analytics agregado, sem identificação individual).</li>
        <li>Exibir anúncios relevantes através do Google AdSense.</li>
      </ul>

      <h2 className="font-headline mt-8 text-xl font-bold">Compartilhamento de dados</h2>
      <p className="mt-3 text-muted-foreground">
        Não vendemos dados pessoais. Compartilhamos dados de navegação apenas com provedores de
        publicidade (Google AdSense) e analytics, conforme necessário para o funcionamento do site.
      </p>

      <h2 className="font-headline mt-8 text-xl font-bold">Seus direitos</h2>
      <p className="mt-3 text-muted-foreground">
        Você pode solicitar a remoção do seu e-mail da newsletter a qualquer momento pelo link de
        descadastro enviado em cada edição, ou entrando em contato pela{" "}
        <a href="/contato" className="text-accent-blue hover:underline">página de contato</a>.
      </p>

      <h2 className="font-headline mt-8 text-xl font-bold">Conteúdo de terceiros</h2>
      <p className="mt-3 text-muted-foreground">
        {SITE_NAME} agrega e resume notícias publicadas originalmente por veículos de imprensa
        especializados, sempre com link para a fonte. Veja nossa{" "}
        <a href="/politica-editorial" className="text-accent-blue hover:underline">política editorial</a>{" "}
        para mais detalhes sobre como tratamos esse conteúdo.
      </p>
    </div>
  );
}
