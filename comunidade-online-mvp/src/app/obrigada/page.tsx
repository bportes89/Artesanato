import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_HELP_LINK } from "@/components/common/community-signup-form";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#1B2A3B] px-4 py-12 text-[hsl(var(--brand-sand))] sm:py-20">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center">
        <section className="w-full rounded-[36px] border border-white/10 bg-white/5 p-8 text-center shadow-premium sm:p-12">
          <CheckCircle2 className="mx-auto h-14 w-14 text-[hsl(var(--brand-mint))]" />
          <p className="font-display mt-6 text-sm font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Cadastro concluído</p>
          <h1 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            Que alegria ter você na
            <br />
            <span className="font-serif-accent italic text-[hsl(var(--brand-gold))]">Comunidade AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Seu acesso foi solicitado com sucesso. Em breve, você receberá no WhatsApp cadastrado as orientações de entrada e o convite para o grupo da comunidade.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="font-display min-h-11 rounded-full bg-[hsl(var(--brand-gold))] px-6 text-base font-bold text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]">
              <a href={WHATSAPP_HELP_LINK} target="_blank" rel="noreferrer">
                Falar com o WhatsApp de atendimento <MessageCircleHeart className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="font-display min-h-11 rounded-full border-white/15 bg-transparent px-6 text-base font-bold text-white hover:bg-white/10">
              <Link href="/login">
                Já quero entrar <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm leading-7 text-white/62">Se preferir, você também pode falar agora com o atendimento para confirmar os próximos passos da sua entrada.</p>
        </section>
      </div>
    </main>
  );
}
