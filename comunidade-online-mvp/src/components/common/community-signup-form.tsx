"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";

const WHATSAPP_HELP_LINK = "https://wa.me/5551991135987";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatWhatsApp(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCep(value: string) {
  const digits = digitsOnly(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

type CommunitySignupFormProps = {
  compact?: boolean;
};

export function CommunitySignupForm({ compact = false }: CommunitySignupFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const phoneFormatted = useMemo(() => formatWhatsApp(form.phone), [form.phone]);
  const cepFormatted = useMemo(() => formatCep(form.cep), [form.cep]);

  return (
    <div className="w-full rounded-[32px] border border-white/12 bg-white/5 p-6 text-white shadow-premium backdrop-blur-sm sm:p-8">
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          if (loading) return;
          setError(null);

          if (form.password !== form.confirmPassword) {
            setError("As senhas não conferem.");
            return;
          }

          setLoading(true);
          try {
            await authService.register({
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
              phone: digitsOnly(form.phone),
            });
            router.push("/obrigada");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Falha no cadastro.");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="space-y-2">
          <label className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Seu nome completo</label>
          <Input
            value={form.name}
            placeholder="Digite seu nome"
            className="h-14 rounded-[20px] border-white/15 bg-white/5 text-base text-white placeholder:text-white/35"
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Seu e-mail</label>
          <Input
            type="email"
            value={form.email}
            placeholder="seunome@exemplo.com"
            className="h-14 rounded-[20px] border-white/15 bg-white/5 text-base text-white placeholder:text-white/35"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <p className="text-sm text-white/68">Será usado para acessar a Comunidade</p>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Seu WhatsApp</label>
          <Input
            inputMode="tel"
            value={phoneFormatted}
            placeholder="(00) 00000-0000"
            className="h-14 rounded-[20px] border-white/15 bg-white/5 text-base text-white placeholder:text-white/35"
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            required
          />
          <p className="text-sm text-white/68">É por aqui que a gente te avisa das novidades e te manda o convite do grupo.</p>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Seu CEP</label>
          <Input
            inputMode="numeric"
            value={cepFormatted}
            placeholder="00000-000"
            className="h-14 rounded-[20px] border-white/15 bg-white/5 text-base text-white placeholder:text-white/35"
            onChange={(event) => setForm((current) => ({ ...current, cep: event.target.value }))}
            required
          />
          <p className="text-sm text-white/68">Para entendermos de onde vêm as nossas artesãs.</p>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Crie uma senha</label>
          <Input
            type="password"
            minLength={8}
            value={form.password}
            placeholder="Mínimo de 8 caracteres"
            className="h-14 rounded-[20px] border-white/15 bg-white/5 text-base text-white placeholder:text-white/35"
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
          <p className="text-sm text-white/68">Use letras e números. Você vai precisar dela para entrar depois.</p>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">Repita a senha</label>
          <Input
            type="password"
            minLength={8}
            value={form.confirmPassword}
            placeholder="Digite a mesma senha novamente"
            className="h-14 rounded-[20px] border-white/15 bg-white/5 text-base text-white placeholder:text-white/35"
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            required
          />
        </div>

        {error ? <p className="text-sm text-[hsl(var(--brand-blush))]">{error}</p> : null}

        <Button
          type="submit"
          disabled={loading}
          className="font-display h-14 w-full rounded-full bg-[hsl(var(--brand-gold))] px-6 text-base font-bold text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Enviando...
            </>
          ) : (
            "Garantir meu acesso gratuito agora →"
          )}
        </Button>

        <p className="text-center text-sm text-white/68">Seus dados estão seguros. Não compartilhamos com ninguém e não enviamos spam.</p>
      </form>

      <div className={`text-white/72 ${compact ? "mt-5 text-sm" : "mt-6 text-center text-sm"}`}>
        <a href={WHATSAPP_HELP_LINK} target="_blank" rel="noreferrer" className="font-display font-semibold text-[hsl(var(--brand-gold))] hover:opacity-90">
          Está com dificuldade? Fale no WhatsApp →
        </a>
      </div>

      {!compact ? (
        <div className="mt-5 text-center text-sm text-white/72">
          Já tem acesso?{" "}
          <Link href="/login" className="font-display font-semibold text-[hsl(var(--brand-gold))] hover:opacity-90">
            Entrar
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export { WHATSAPP_HELP_LINK };
