"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useSessionStore } from "@/lib/stores/session-store";
import { usersService } from "@/lib/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
export default function PerfilPage() {
  const user = useSession();
  const setUser = useSessionStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function ensureUserLoaded() {
      if (user) return;

      setLoading(true);
      try {
        const me = await usersService.meClient();
        if (!active) return;
        setUser(me);
      } catch {
        if (!active) return;
        setMessage("Não foi possível carregar seus dados agora.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void ensureUserLoaded();

    return () => {
      active = false;
    };
  }, [setUser, user]);

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

  const accountStatus = useMemo(() => {
    if (user?.status === "ACTIVE" || !user?.status) return "Ativa";
    return user.status;
  }, [user?.status]);

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
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={loading ? "Carregando seu nome..." : "Seu nome"}
              disabled={loading}
            />
            <Input value={user?.email ?? (loading ? "Carregando seu e-mail..." : "")} disabled />
            <Button
              className="min-h-11"
              disabled={loading || saving || !name.trim()}
              onClick={async () => {
                setSaving(true);
                setMessage(null);
                try {
                  const updatedUser = await usersService.updateMe({ name: name.trim() });
                  setUser(updatedUser);
                  setName(updatedUser.name ?? "");
                  setMessage("Perfil atualizado com sucesso.");
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Não foi possível salvar suas alterações.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
            {message ? <p className="text-sm text-[#1B2A3B]/75">{message}</p> : null}
          </CardContent>
        </Card>

        <Card className="border border-[#1B2A3B]/10 bg-white/85">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Minha conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base text-[#1B2A3B]/80">
            <p>E-mail: {user?.email ?? (loading ? "Carregando..." : "-")}</p>
            <p>Status: {accountStatus}</p>
            <p>Data de cadastro: {formatDate(user?.createdAt)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

