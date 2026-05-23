import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminServer } from "@/lib/services/admin.server";

export default async function AdminContentPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const query = typeof params.query === "string" ? params.query : "";
  const data = await adminServer.courses({ page: 1, limit: 20, query });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Conteúdos" title="Gestão de conteúdos" description="Cursos, módulos e organização do catálogo." />
      <div className="premium-surface rounded-[28px] p-6">
        <form className="flex flex-col gap-3 md:flex-row md:items-center" action="/membros/admin/conteudos">
          <input name="query" defaultValue={query} placeholder="Buscar curso por título" className="h-12 flex-1 rounded-2xl border border-input bg-background/80 px-4 text-sm" />
          <button className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">Buscar</button>
          <Link href="/membros/admin/conteudos/novo" className="h-12 rounded-full border border-border bg-background/80 px-6 text-sm font-medium leading-[3rem]">
            Novo curso
          </Link>
        </form>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {(data?.items ?? []).map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{course.description ?? "Sem descrição"}</p>
              <p className="text-sm text-muted-foreground">Status: {course.status} • Módulos: {course.modulesCount ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

