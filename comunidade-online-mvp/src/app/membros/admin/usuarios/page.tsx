import { PageHeader } from "@/components/common/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminServer } from "@/lib/services/admin.server";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const query = typeof params.query === "string" ? params.query : "";
  const status = typeof params.status === "string" ? params.status : undefined;
  const data = await adminServer.users({ page, query, status, limit: 20 });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Usuários" title="Gestão de usuários" description="Busca, filtros e visão operacional para suporte e operação." />
      <div className="premium-surface rounded-[28px] p-6">
        <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/membros/admin/usuarios">
          <input name="query" defaultValue={query} placeholder="Buscar por e-mail ou nome" className="h-12 flex-1 rounded-2xl border border-input bg-background/80 px-4 text-sm" />
          <select name="status" defaultValue={status ?? ""} className="h-12 rounded-2xl border border-input bg-background/80 px-4 text-sm">
            <option value="">Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="SUSPENDED">Suspensos</option>
          </select>
          <button className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Filtrar</button>
        </form>
      </div>

      <div className="premium-surface rounded-[28px] p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-mail</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Criado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.items ?? []).map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.name ?? "-"}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.roles.map((r) => r.key).join(", ") || "-"}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-muted-foreground">
          {data ? `Total: ${data.total} • Página: ${data.page}` : "Sem acesso ou dados indisponíveis."}
        </p>
      </div>
    </div>
  );
}

