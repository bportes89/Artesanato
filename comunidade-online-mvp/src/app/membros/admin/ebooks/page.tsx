import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminServer } from "@/lib/services/admin.server";

export default async function AdminEbooksPage() {
  const data = await adminServer.ebooks({ page: 1, limit: 20 });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B]">Admin • Ebooks</h1>
        <p className="text-base text-[#1B2A3B]/80">Catálogo de ebooks disponíveis no tenant.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {(data?.items ?? []).map((ebook) => (
          <Card key={ebook.id} className="border border-[#1B2A3B]/10 bg-white/90">
            <CardHeader>
              <CardTitle>{ebook.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{ebook.description ?? "Sem descrição"}</p>
              <p className="text-sm text-muted-foreground">Status: {ebook.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
