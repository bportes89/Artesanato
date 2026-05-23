"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-10">
      <Card className="premium-surface w-full rounded-[28px]">
        <CardHeader className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Nova senha</p>
          <CardTitle className="font-serif text-4xl">Atualizar acesso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              const token = searchParams.get("token");
              if (!token) {
                setMessage("Token inválido.");
                return;
              }
              await authService.resetPassword({ token, password });
              router.push("/login");
            }}
          >
            <Input placeholder="Nova senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
            <Button className="w-full rounded-full">Salvar nova senha</Button>
          </form>
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}

