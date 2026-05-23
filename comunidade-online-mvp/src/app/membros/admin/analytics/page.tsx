import { PageHeader } from "@/components/common/page-header";
import { AdminChart } from "@/components/charts/admin-chart";
import { StatCard } from "@/components/common/stat-card";
import { adminServer } from "@/lib/services/admin.server";

export default async function AdminAnalyticsPage() {
  const [overview, dau, paid, onboardingFunnel, purchaseFunnel] = await Promise.all([
    adminServer.analyticsOverview(30),
    adminServer.analyticsTimeseries("active_users", 30),
    adminServer.analyticsTimeseries("purchases_paid", 30),
    adminServer.analyticsFunnel("onboarding", 30),
    adminServer.analyticsFunnel("purchase", 30),
  ]);

  if (!overview) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin • Analytics" title="Analytics" description="Sem acesso ou dados indisponíveis." />
      </div>
    );
  }

  const pct = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin • Analytics"
        title="Analytics"
        description="KPIs, séries temporais e funis (últimos 30 dias)."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Usuárias ativas" value={overview.kpis.activeUsers} />
        <StatCard label="Novas usuárias" value={overview.kpis.newUsers} />
        <StatCard label="Onboarding concluído" value={`${overview.kpis.onboardingCompleted} (${pct(overview.kpis.onboardingCompletionRate)})`} />
        <StatCard label="Pedidos pagos" value={overview.kpis.ordersPaid} />
        <StatCard label="Downloads" value={overview.kpis.downloads} />
        <StatCard label="Retenção D1 / D7" value={`${pct(overview.kpis.retentionD1)} / ${pct(overview.kpis.retentionD7)}`} />
      </div>

      {dau ? <AdminChart title="Usuárias ativas por dia" variant="line" data={dau.items} /> : null}
      {paid ? <AdminChart title="Compras pagas por dia" variant="line" data={paid.items} /> : null}

      {onboardingFunnel ? (
        <AdminChart
          title="Funil de onboarding"
          data={onboardingFunnel.steps.map((s) => ({ name: s.step, value: s.users }))}
        />
      ) : null}

      {purchaseFunnel ? (
        <AdminChart
          title="Funil de compra"
          data={purchaseFunnel.steps.map((s) => ({ name: s.step, value: s.users }))}
        />
      ) : null}

      {overview.topEvents?.length ? (
        <AdminChart title="Top eventos" data={overview.topEvents.map((e) => ({ name: e.name, value: e.count }))} />
      ) : null}
    </div>
  );
}
