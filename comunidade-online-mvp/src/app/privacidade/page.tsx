import Link from "next/link";

function PrivacySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[hsl(var(--brand-ink)/0.08)] bg-white p-6 shadow-premium sm:p-8">
      <h2 className="font-display text-2xl font-bold text-[hsl(var(--brand-ink))]">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-[hsl(var(--brand-ink)/0.78)]">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[hsl(var(--brand-sand))] px-4 py-12 sm:py-16">
      <div className="landing-shell max-w-4xl">
        <Link href="/" className="font-display text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--brand-tan))] hover:opacity-80">
          ← Voltar para a landing
        </Link>
        <header className="mt-6">
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.24em] text-[hsl(var(--brand-tan))]">Documento legal</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight text-[hsl(var(--brand-ink))] sm:text-5xl">Política de privacidade</h1>
          <p className="mt-5 text-base leading-8 text-[hsl(var(--brand-ink)/0.72)] sm:text-lg">
            Esta política explica como os dados pessoais das usuárias da Comunidade ArtesanatoInteligente® são coletados, utilizados e protegidos.
          </p>
        </header>

        <div className="mt-10 space-y-5">
          <PrivacySection title="1. Dados coletados">
            <p>Podemos coletar nome, e-mail, telefone, CEP e demais dados informados voluntariamente no momento do cadastro, da compra ou do contato.</p>
            <p>Também podem ser registrados dados técnicos de navegação, autenticação e uso da plataforma para segurança e melhoria da experiência.</p>
          </PrivacySection>

          <PrivacySection title="2. Finalidades do uso">
            <p>Os dados são utilizados para criar seu acesso, autenticar sua conta, enviar comunicações relacionadas à comunidade e disponibilizar conteúdos, ofertas e suporte.</p>
            <p>Também podem ser usados para análise de funcionamento, prevenção de fraude e aprimoramento dos serviços.</p>
          </PrivacySection>

          <PrivacySection title="3. Compartilhamento">
            <p>Os dados não são vendidos. O compartilhamento poderá ocorrer apenas com fornecedores essenciais à operação da plataforma, como serviços de hospedagem, autenticação, pagamento e comunicação.</p>
            <p>Esses parceiros devem tratar os dados conforme finalidades compatíveis com esta política e com a legislação aplicável.</p>
          </PrivacySection>

          <PrivacySection title="4. Armazenamento e segurança">
            <p>Adotamos medidas técnicas e organizacionais adequadas para reduzir riscos de acesso indevido, perda ou uso não autorizado das informações.</p>
            <p>Mesmo com boas práticas, nenhum ambiente digital é completamente imune a incidentes, por isso recomendamos o uso de senhas fortes e exclusivas.</p>
          </PrivacySection>

          <PrivacySection title="5. Direitos da titular">
            <p>Você pode solicitar confirmação de tratamento, acesso, correção, atualização ou exclusão de dados pessoais, observadas as hipóteses legais aplicáveis.</p>
            <p>Também pode solicitar informações sobre compartilhamento e revogar consentimentos quando essa for a base legal do tratamento.</p>
          </PrivacySection>

          <PrivacySection title="6. Contato e atualizações">
            <p>Se tiver dúvidas sobre privacidade ou quiser exercer seus direitos, utilize os canais oficiais da plataforma.</p>
            <p>Esta política pode ser atualizada periodicamente para refletir melhorias operacionais, requisitos legais ou mudanças no serviço.</p>
          </PrivacySection>
        </div>
      </div>
    </main>
  );
}
