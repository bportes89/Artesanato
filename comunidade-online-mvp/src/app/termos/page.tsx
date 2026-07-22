import Link from "next/link";

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[hsl(var(--brand-ink)/0.08)] bg-white p-6 shadow-premium sm:p-8">
      <h2 className="font-display text-2xl font-bold text-[hsl(var(--brand-ink))]">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-[hsl(var(--brand-ink)/0.78)]">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[hsl(var(--brand-sand))] px-4 py-12 sm:py-16">
      <div className="landing-shell max-w-4xl">
        <Link href="/" className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--brand-tan))] hover:opacity-80">
          ← Voltar para a landing
        </Link>
        <header className="mt-6">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.24em] text-[hsl(var(--brand-tan))]">Documento legal</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight text-[hsl(var(--brand-ink))] sm:text-5xl">Termos de uso</h1>
          <p className="mt-5 text-base leading-8 text-[hsl(var(--brand-ink)/0.72)] sm:text-lg">
            Estes termos regulam o acesso à Comunidade ArtesanatoInteligente® e aos conteúdos disponibilizados por Fernanda Sklovsky na plataforma.
          </p>
        </header>

        <div className="mt-10 space-y-5">
          <TermsSection title="1. Aceitação">
            <p>Ao se cadastrar e utilizar a plataforma, você declara que leu, compreendeu e concorda com estes termos.</p>
            <p>Se não concordar com qualquer condição, interrompa o uso e solicite o cancelamento do seu cadastro.</p>
          </TermsSection>

          <TermsSection title="2. Acesso à comunidade">
            <p>O acesso pode incluir conteúdos gratuitos, materiais complementares, grupos de comunicação e ofertas pagas, conforme informado em cada área da plataforma.</p>
            <p>Algumas funcionalidades podem depender de disponibilidade técnica, calendário de lançamentos e ativação manual pela equipe responsável.</p>
          </TermsSection>

          <TermsSection title="3. Responsabilidades da usuária">
            <p>Você se compromete a fornecer dados verdadeiros, manter sua senha em sigilo e não compartilhar sua conta com terceiros.</p>
            <p>Também se compromete a utilizar a comunidade com respeito, sem publicar conteúdo ofensivo, ilícito ou que viole direitos de terceiros.</p>
          </TermsSection>

          <TermsSection title="4. Propriedade intelectual">
            <p>Os materiais, aulas, textos, métodos, marcas e elementos visuais da Comunidade ArtesanatoInteligente® pertencem às titulares e não podem ser copiados, redistribuídos ou revendidos sem autorização expressa.</p>
            <p>O uso é pessoal e intransferível, salvo quando houver autorização formal por escrito.</p>
          </TermsSection>

          <TermsSection title="5. Produtos e ofertas pagas">
            <p>Mentorias, workshops, livros, videoaulas especiais e demais produtos pagos poderão ter regras próprias de contratação, pagamento, cancelamento e entrega.</p>
            <p>Sempre que houver uma oferta comercial, as condições específicas devem prevalecer em conjunto com estes termos gerais.</p>
          </TermsSection>

          <TermsSection title="6. Suspensão e encerramento">
            <p>O acesso poderá ser suspenso em caso de violação destes termos, uso indevido da plataforma ou comportamento incompatível com o ambiente da comunidade.</p>
            <p>A equipe também poderá encerrar ou atualizar funcionalidades, áreas e serviços, preservando comunicações razoáveis às usuárias sempre que possível.</p>
          </TermsSection>

          <TermsSection title="7. Contato">
            <p>Se você tiver dúvidas sobre estes termos, utilize os canais oficiais informados na landing page ou no ambiente da plataforma.</p>
          </TermsSection>
        </div>
      </div>
    </main>
  );
}
