import { AdminChart } from "@/components/charts/admin-chart";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { UploadPanel } from "@/components/media/upload-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminServer } from "@/lib/services/admin.server";
export default async function AdminPage() {
  const metrics = await adminServer.metrics();
  if (!metrics) return <div className="space-y-6"><PageHeader eyebrow="Admin" title="Área administrativa" description="Sem acesso ou métricas indisponíveis no momento." /></div>;
  const chartData = [
    { name: 'Usuárias', value: metrics.users ?? 0 },
    { name: 'Pagas', value: metrics.ordersPaid ?? 0 },
    { name: 'Pendentes', value: metrics.ordersPending ?? 0 },
    { name: 'Posts', value: metrics.posts ?? 0 },
    { name: 'Downloads', value: metrics.downloads ?? 0 },
  ];
  return <div className="space-y-6"><PageHeader eyebrow="Admin" title="Operação da comunidade" description="Métricas, uploads e visão rápida de performance do produto." /><div className="grid gap-4 md:grid-cols-3"><StatCard label="Usuárias" value={metrics.users ?? 0} /><StatCard label="Pagamentos pagos" value={metrics.ordersPaid ?? 0} /><StatCard label="Webhooks falhos" value={metrics.webhooksFailed ?? 0} /></div><div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><AdminChart data={chartData} /><UploadPanel /></div><Card><CardHeader><CardTitle>Saúde financeira</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Pedidos pendentes: {metrics.ordersPending ?? 0} • Downloads: {metrics.downloads ?? 0} • Posts: {metrics.posts ?? 0}</p></CardContent></Card></div>;
}

