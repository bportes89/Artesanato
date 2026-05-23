"use client";
import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { usersService } from "@/lib/services/users";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
export default function PerfilPage() {
  const user = useSession();
  const [name, setName] = useState(user?.name ?? '');
  const [message, setMessage] = useState<string | null>(null);
  return <div className="space-y-6"><PageHeader eyebrow="Perfil" title="Conta e preferências" description="Atualize seus dados, acompanhe seu acesso e mantenha sua sessão organizada." /><div className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle>Dados básicos</CardTitle></CardHeader><CardContent className="space-y-4"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" /><Input value={user?.email ?? ''} disabled /><Button onClick={async () => { await usersService.updateMe({ name }); setMessage('Perfil atualizado com sucesso.'); }}>Salvar alterações</Button>{message ? <p className="text-sm text-muted-foreground">{message}</p> : null}</CardContent></Card><Card><CardHeader><CardTitle>Conta atual</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p>ID: {user?.id ?? '-'}</p><p>Status: {user?.status ?? 'ACTIVE'}</p><p>Front guard protegido por cookie `access_token` e middleware Next.js.</p></CardContent></Card></div></div>;
}

