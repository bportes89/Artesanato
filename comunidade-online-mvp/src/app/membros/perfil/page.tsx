"use client";
import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { usersService } from "@/lib/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
export default function PerfilPage() {
  const user = useSession();
  const [name, setName] = useState(user?.name ?? "");
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Meu perfil</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-[#1B2A3B]/10 bg-white/85">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Dados básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" />
            <Input value={user?.email ?? ""} disabled />
            <Button
              className="min-h-11"
              onClick={async () => {
                await usersService.updateMe({ name });
                setMessage("Perfil atualizado com sucesso.");
              }}
            >
              Salvar alterações
            </Button>
            {message ? <p className="text-sm text-[#1B2A3B]/75">{message}</p> : null}
          </CardContent>
        </Card>

        <Card className="border border-[#1B2A3B]/10 bg-white/85">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Minha conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base text-[#1B2A3B]/80">
            <p>E-mail: {user?.email ?? "-"}</p>
            <p>Status: {user?.status === "ACTIVE" ? "Ativa" : user?.status ?? "Ativa"}</p>
            <p>Data de cadastro: {formatDate(user?.createdAt)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

