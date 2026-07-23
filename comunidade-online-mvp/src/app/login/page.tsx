"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-10">
      <Card className="premium-surface rounded-[28px]">
        <CardHeader className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Área de membros</p>
          <CardTitle className="font-serif text-4xl">Entrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError(null);
              try {
                await authService.login({ email, password });
                router.push(searchParams.get("next") ?? "/membros");
                router.refresh();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Falha ao entrar.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input placeholder="Seu e-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Input placeholder="Sua senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full rounded-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="space-y-3 border-t border-[#1B2A3B]/10 pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Ainda não tem acesso?</span>
              <Link href="/cadastro" className="font-semibold text-[#1B2A3B] hover:text-[#D4542A]">
                Criar conta
              </Link>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Precisa recuperar sua senha?</span>
              <Link href="/esqueci-senha" className="font-semibold text-[#1B2A3B] hover:text-[#D4542A]">
                Esqueci minha senha
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

