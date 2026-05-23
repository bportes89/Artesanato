import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminServer } from "@/lib/services/admin.server";

export default async function AdminSearchPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const query = typeof params.query === "string" ? params.query : "";
  const results = query ? await adminServer.search(query) : null;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Busca" title="Busca global" description="Localize rapidamente usuários, cursos, ebooks, pedidos e posts." />
      <div className="premium-surface rounded-[28px] p-6">
        <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/membros/admin/busca">
          <input name="query" defaultValue={query} placeholder="Digite para buscar (e-mail, título, ID)" className="h-12 flex-1 rounded-2xl border border-input bg-background/80 px-4 text-sm" />
          <button className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Buscar</button>
        </form>
      </div>

      {results ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usuários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {results.users.slice(0, 8).map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-[20px] border border-border/70 px-4 py-3">
                  <span className="font-medium">{u.email}</span>
                  <span className="text-muted-foreground">{u.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {results.orders.slice(0, 8).map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-[20px] border border-border/70 px-4 py-3">
                  <span className="font-medium">{o.id}</span>
                  <span className="text-muted-foreground">{o.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cursos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {results.courses.slice(0, 8).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-[20px] border border-border/70 px-4 py-3">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-muted-foreground">{c.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ebooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {results.ebooks.slice(0, 8).map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-[20px] border border-border/70 px-4 py-3">
                  <span className="font-medium">{e.title}</span>
                  <span className="text-muted-foreground">{e.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {results.posts.slice(0, 8).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-[20px] border border-border/70 px-4 py-3">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-muted-foreground">{p.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="premium-surface rounded-[28px] p-8 text-sm text-muted-foreground">Digite um termo de busca para ver resultados.</div>
      )}

      <p className="text-sm text-muted-foreground">
        Atalhos: <Link className="text-primary" href="/membros/admin/usuarios">Usuários</Link> •{" "}
        <Link className="text-primary" href="/membros/admin/compras">Compras</Link>
      </p>
    </div>
  );
}
