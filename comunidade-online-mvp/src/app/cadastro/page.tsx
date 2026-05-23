"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Leaf } from "lucide-react";
import { authService } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatWhatsApp(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const phoneFormatted = formatWhatsApp(form.phone);
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-[hsl(var(--premium-sidebar-from))] text-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight">Fernanda</span>
            <Leaf className="h-5 w-5 text-accent" />
            <span className="font-serif text-lg font-semibold tracking-tight">Sklovsky</span>
          </Link>

          <Button
            asChild
            className="rounded-full bg-[hsl(var(--brand-gold))] px-5 text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
          >
            <Link href="/login">
              Quero entrar <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="bg-background">
          <div className="mx-auto max-w-[1100px] px-4 pt-16 lg:px-8 lg:pt-20">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-accent">Cadastro gratuito</p>
            <h1 className="mt-6 text-center font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Entre para a
              <br />
              <span className="italic text-accent">Comunidade AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:text-base">
              Preencha os campos abaixo para criar a sua conta na Comunidade ArtesanatoInteligente. É gratuito, simples e rápido. Se precisar de ajuda, é
              só chamar no WhatsApp.
            </p>
          </div>

          <div className="mt-12 bg-[hsl(var(--premium-sidebar-from))] py-14">
            <div className="mx-auto flex max-w-[1100px] justify-center px-4 lg:px-8">
              <div className="w-full max-w-[520px] rounded-[28px] border border-white/10 bg-white/5 p-8 text-white shadow-premium">
                <form
                  className="space-y-5"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setLoading(true);
                    setError(null);
                    try {
                      const phoneDigits = digitsOnly(form.phone);
                      if (form.password !== form.confirmPassword) {
                        setError("As senhas não conferem.");
                        return;
                      }
                      await authService.register({ name: form.name, email: form.email, password: form.password, phone: phoneDigits });
                      router.push("/membros/onboarding");
                      router.refresh();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Falha no cadastro.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Seu nome completo</p>
                    <Input
                      placeholder="Digite seu nome"
                      value={form.name}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Seu e-mail</p>
                    <Input
                      placeholder="Digite seu e-mail"
                      type="email"
                      value={form.email}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      required
                    />
                    <p className="text-xs text-white/60">Será usado para acessar a Comunidade</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Seu WhatsApp</p>
                    <Input
                      placeholder="(00) 00000-0000"
                      inputMode="tel"
                      value={phoneFormatted}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                      required
                    />
                    <p className="text-xs text-white/60">Para receber o link do grupo da Comunidade</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Crie uma senha</p>
                    <Input
                      placeholder="Mínimo de 8 caracteres"
                      type="password"
                      value={form.password}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-white/60">Use letras e números — você vai precisar dela para entrar depois</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Repita a senha</p>
                    <Input
                      placeholder="Digite a mesma senha novamente"
                      type="password"
                      value={form.confirmPassword}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                      required
                      minLength={8}
                    />
                  </div>

                  {error ? <p className="text-sm text-[hsl(var(--brand-tan))]">{error}</p> : null}

                  <Button
                    className="w-full rounded-full bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
                    disabled={loading}
                  >
                    {loading ? "Criando..." : "Criar minha conta — é grátis ✓"}
                  </Button>

                  <p className="text-center text-xs text-white/60">Seus dados estão seguros. Não compartilhamos com ninguém e não enviamos spam.</p>
                </form>

                <div className="mt-6 text-center text-sm text-white/70">
                  Já tem acesso?{" "}
                  <Link href="/login" className="font-semibold text-[hsl(var(--brand-gold))] hover:opacity-90">
                    Entrar
                  </Link>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-[1100px] px-4 text-center text-xs text-white/70 lg:px-8">
              Está com dificuldade?{" "}
              <a href="/login?next=%2Fmembros%2Fwhatsapp" className="font-semibold text-[hsl(var(--brand-gold))] hover:opacity-90">
                Fale no WhatsApp →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
