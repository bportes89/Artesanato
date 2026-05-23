import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNotificacoesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin • Notificações"
        title="Gestão de notificações"
        description="Envio in-app e organização operacional (MVP)."
      />
      <Card>
        <CardHeader>
          <CardTitle>Próximo passo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Em MVP, o backend já suporta notificações por usuário. Nesta etapa do painel, a próxima entrega é broadcast segmentado e histórico de campanhas.
        </CardContent>
      </Card>
    </div>
  );
}

