import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommunitySignupForm } from "@/components/common/community-signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#1B2A3B] text-[hsl(var(--brand-sand))]">
      <header className="border-b border-white/10 bg-[#1B2A3B]">
        <div className="landing-shell flex min-h-[80px] items-center justify-between gap-4 py-4">
          <Link href="/" className="min-w-0">
            <div className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
              <span>Fernanda</span>
              <Star className="h-5 w-5 fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]" />
              <span>Sklovsky</span>
            </div>
            <div className="font-serif-accent text-sm italic text-[hsl(var(--brand-sand)/0.84)]">ArtesanatoInteligente®</div>
          </Link>

          <Button asChild className="font-display min-h-11 rounded-full bg-[hsl(var(--brand-gold))] px-5 text-base font-bold text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]">
            <Link href="/login">
              Quero entrar <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="py-16 sm:py-20">
        <section className="landing-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">CADASTRO GRATUITO</p>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Entre para a
              <br />
              <span className="font-serif-accent italic text-[hsl(var(--brand-gold))]">Comunidade AI</span>
            </h1>
            <p className="mt-6 text-base leading-8 text-white/78 sm:text-lg">
              Preencha os campos abaixo para criar a sua conta na Comunidade ArtesanatoInteligente®. É gratuito, simples e rápido. Se precisar de ajuda, é só chamar no WhatsApp.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <CommunitySignupForm />
          </div>
        </section>
      </main>
    </div>
  );
}
