import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mentorshipService } from "@/lib/services/mentorship";

export default async function AdminMentoriaPage() {
  const offers = (await mentorshipService.offers()) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Mentoria" title="Gestão de mentoria" description="Ofertas publicadas e operação de sessões." />
      <div className="grid gap-4 xl:grid-cols-2">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              <CardTitle>{offer.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{offer.description ?? "Sem descrição"}</p>
              <p>Status: {offer.status ?? "PUBLISHED"}</p>
            </CardContent>
          </Card>
        ))}
        {!offers.length ? <div className="premium-surface rounded-[28px] p-8 text-sm text-muted-foreground">Nenhuma oferta publicada ainda.</div> : null}
      </div>
    </div>
  );
}

