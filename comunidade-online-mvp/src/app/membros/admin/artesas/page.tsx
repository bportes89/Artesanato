import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeServerApiFetch } from "@/lib/api/server";
import { formatDate } from "@/lib/utils";

type Guest = { id: string; email: string; name?: string | null; status?: string; createdAt?: string };

export default async function AdminArtesasPage() {
  const guests = (await safeServerApiFetch<Guest[]>("/guest-artisans")) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Artesãs" title="Gestão de artesãs" description="Convites e acompanhamento de convidadas (guest artisans)." />
      <div className="grid gap-4 xl:grid-cols-2">
        {guests.map((g) => (
          <Card key={g.id}>
            <CardHeader>
              <CardTitle>{g.name ?? g.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Email: {g.email}</p>
              <p>Status: {g.status ?? "-"}</p>
              <p>Criado: {formatDate(g.createdAt)}</p>
            </CardContent>
          </Card>
        ))}
        {!guests.length ? <div className="premium-surface rounded-[28px] p-8 text-sm text-muted-foreground">Nenhuma artesã convidada ainda.</div> : null}
      </div>
    </div>
  );
}

