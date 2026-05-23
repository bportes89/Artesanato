import { PageHeader } from "@/components/common/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminServer } from "@/lib/services/admin.server";
import { formatDate } from "@/lib/utils";

export default async function AdminUploadsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const query = typeof params.query === "string" ? params.query : "";
  const status = typeof params.status === "string" ? params.status : undefined;
  const purpose = typeof params.purpose === "string" ? params.purpose : undefined;
  const data = await adminServer.uploads({ page: 1, limit: 20, query, status, purpose });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Uploads" title="Gestão de uploads" description="Sessões, status, finalidade e auditoria operacional." />
      <div className="premium-surface rounded-[28px] p-6">
        <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/membros/admin/uploads">
          <input name="query" defaultValue={query} placeholder="Buscar por ID ou nome do arquivo" className="h-12 flex-1 rounded-2xl border border-input bg-background/80 px-4 text-sm" />
          <select name="status" defaultValue={status ?? ""} className="h-12 rounded-2xl border border-input bg-background/80 px-4 text-sm">
            <option value="">Todos</option>
            <option value="INITIATED">Iniciado</option>
            <option value="COMPLETED">Concluído</option>
            <option value="FAILED">Falhou</option>
          </select>
          <select name="purpose" defaultValue={purpose ?? ""} className="h-12 rounded-2xl border border-input bg-background/80 px-4 text-sm">
            <option value="">Todas as finalidades</option>
            <option value="IMAGE">Imagem</option>
            <option value="EBOOK">Ebook</option>
            <option value="OTHER">Outro</option>
          </select>
          <button className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Filtrar</button>
        </form>
      </div>

      <div className="premium-surface rounded-[28px] p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Upload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Finalidade</TableHead>
              <TableHead>Arquivo</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Criado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.items ?? []).map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.id}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell>{u.filePurpose}</TableCell>
                <TableCell>{u.originalFilename ?? u.file?.r2Key ?? "-"}</TableCell>
                <TableCell>{u.user?.email ?? "-"}</TableCell>
                <TableCell>{formatDate(u.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-muted-foreground">{data ? `Total: ${data.total}` : "Sem acesso ou dados indisponíveis."}</p>
      </div>
    </div>
  );
}

