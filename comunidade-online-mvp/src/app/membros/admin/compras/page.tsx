import { PageHeader } from "@/components/common/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminServer } from "@/lib/services/admin.server";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminPurchasesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const query = typeof params.query === "string" ? params.query : "";
  const status = typeof params.status === "string" ? params.status : undefined;
  const data = await adminServer.orders({ page: 1, limit: 20, query, status });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Compras" title="Gestão de compras" description="Pedidos, pagamentos, status e reconciliação." />
      <div className="premium-surface rounded-[28px] p-6">
        <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/membros/admin/compras">
          <input name="query" defaultValue={query} placeholder="Buscar por pedido, e-mail ou ref" className="h-12 flex-1 rounded-2xl border border-input bg-background/80 px-4 text-sm" />
          <select name="status" defaultValue={status ?? ""} className="h-12 rounded-2xl border border-input bg-background/80 px-4 text-sm">
            <option value="">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
            <option value="FAILED">Falhou</option>
            <option value="CANCELED">Cancelado</option>
            <option value="REFUNDED">Reembolsado</option>
          </select>
          <button className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Filtrar</button>
        </form>
      </div>
      <div className="premium-surface rounded-[28px] p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pagamentos</TableHead>
              <TableHead>Criado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.items ?? []).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatCurrency(order.totalCents, order.currency)}</TableCell>
                <TableCell>{order.payments.map((p) => `${p.provider}:${p.status}`).join(" • ") || "-"}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-muted-foreground">{data ? `Total: ${data.total}` : "Sem acesso ou dados indisponíveis."}</p>
      </div>
    </div>
  );
}

