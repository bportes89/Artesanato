"use client";

import { useState } from "react";
import { authService } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-10">
      <Card className="premium-surface w-full rounded-[28px]">
        <CardHeader className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Recuperação</p>
          <CardTitle className="font-serif text-4xl">Redefinir senha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await authService.requestReset(email);
              setMessage("Se o e-mail existir, enviaremos o link de redefinição.");
            }}
          >
            <Input placeholder="Seu e-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <Button className="w-full rounded-full">Enviar link</Button>
          </form>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}

