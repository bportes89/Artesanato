import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminServer } from "@/lib/services/admin.server";
import { formatCurrency, formatDate } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="border border-[#1B2A3B]/10 bg-white/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-[#1B2A3B]/75">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-4xl font-semibold text-[#1B2A3B]">{value}</p>
      </CardContent>
    </Card>
  );
}

export default async function AdminPage() {
  const [metrics, users, waitlists, teacherApplications, orders, overview] = await Promise.all([
    adminServer.metrics(),
    adminServer.users({ page: 1, limit: 5 }),
    adminServer.waitlists({ page: 1, limit: 12 }),
    adminServer.teacherApplications({ page: 1, limit: 8 }),
    adminServer.orders({ page: 1, limit: 8 }),
    adminServer.analyticsOverview(30),
  ]);

  if (!metrics) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Admin</h1>
        <p className="text-base text-[#1B2A3B]/80">Sem acesso ou dados indisponíveis no momento.</p>
      </div>
    );
  }

  const waitlistsByTopic = new Map<string, number>();
  for (const entry of waitlists?.items ?? []) {
    waitlistsByTopic.set(entry.topic, (waitlistsByTopic.get(entry.topic) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Admin</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">
          Painel reservado para Fernanda e Gustavo com membros cadastrados, listas de espera, candidaturas, compras e analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Membros cadastrados" value={metrics.users ?? 0} />
        <Stat label="Pagamentos pagos" value={metrics.ordersPaid ?? 0} />
        <Stat label="Pedidos pendentes" value={metrics.ordersPending ?? 0} />
        <Stat label="Downloads" value={metrics.downloads ?? 0} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-[#1B2A3B]/10 bg-white/90">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Membros recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(users?.items ?? []).map((user) => (
              <div key={user.id} className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
                <p className="font-semibold text-[#1B2A3B]">{user.name ?? "Sem nome"}</p>
                <p className="text-sm text-[#1B2A3B]/75">{user.email}</p>
                <p className="mt-2 text-sm text-[#1B2A3B]/75">
                  {user.roles.map((role) => role.key).join(", ") || "MEMBER"} • {formatDate(user.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[#1B2A3B]/10 bg-white/90">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Analytics básico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
              <p className="font-semibold text-[#1B2A3B]">Usuárias ativas nos últimos 30 dias</p>
              <p className="mt-2 text-3xl font-semibold text-[#D4542A]">{overview?.kpis.activeUsers ?? 0}</p>
            </div>
            <div className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
              <p className="font-semibold text-[#1B2A3B]">Novas usuárias</p>
              <p className="mt-2 text-3xl font-semibold text-[#D4542A]">{overview?.kpis.newUsers ?? 0}</p>
            </div>
            <div className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
              <p className="font-semibold text-[#1B2A3B]">Posts e comentários</p>
              <p className="mt-2 text-base text-[#1B2A3B]/80">
                {overview?.kpis.communityPosts ?? 0} posts • {overview?.kpis.communityComments ?? 0} comentários
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-[#1B2A3B]/10 bg-white/90">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Listas de espera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(waitlistsByTopic.entries()).map(([topic, count]) => (
              <div key={topic} className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
                <p className="font-semibold text-[#1B2A3B]">{topic}</p>
                <p className="mt-2 text-base text-[#1B2A3B]/75">{count} inscritas nesta amostra inicial</p>
              </div>
            ))}
            {(waitlists?.items ?? []).map((entry) => (
              <div key={entry.id} className="rounded-[22px] border border-[#1B2A3B]/10 px-4 py-4">
                <p className="font-semibold text-[#1B2A3B]">{entry.user.name ?? "Sem nome"}</p>
                <p className="text-sm text-[#1B2A3B]/75">{entry.user.email}</p>
                <p className="mt-2 text-sm text-[#1B2A3B]/75">
                  {entry.topic} • {formatDate(entry.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[#1B2A3B]/10 bg-white/90">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">Candidaturas de professoras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(teacherApplications?.items ?? []).length ? (
              teacherApplications?.items.map((application) => (
                <div key={application.id} className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
                  <p className="font-semibold text-[#1B2A3B]">{application.name}</p>
                  <p className="text-sm text-[#1B2A3B]/75">
                    {application.city} • {application.whatsapp}
                  </p>
                  <p className="mt-2 text-sm text-[#1B2A3B]/75">{application.technique}</p>
                  <p className="mt-2 text-sm text-[#1B2A3B]/75">{application.experience}</p>
                </div>
              ))
            ) : (
              <p className="text-base text-[#1B2A3B]/80">Ainda não há candidaturas registradas.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[#1B2A3B]/10 bg-white/90">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-[#1B2A3B]">Compras realizadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(orders?.items ?? []).length ? (
            orders?.items.map((order) => (
              <div key={order.id} className="rounded-[22px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#1B2A3B]">{order.user.name ?? order.user.email}</p>
                    <p className="text-sm text-[#1B2A3B]/75">{order.items.map((item) => item.product.name).join(", ")}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-[#D4542A]">{formatCurrency(order.totalCents, order.currency)}</p>
                    <p className="text-sm text-[#1B2A3B]/75">{order.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-base text-[#1B2A3B]/80">Ainda não há compras registradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

