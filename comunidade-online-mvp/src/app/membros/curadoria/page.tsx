import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contentService } from "@/lib/services/content";
export default async function CuradoriaPage() {
  const courses = (await contentService.list()) ?? [];
  return <div className="space-y-6"><PageHeader eyebrow="Curadoria" title="Trilhas e conteúdos premium" description="Seleção editorial das aulas e jornadas mais relevantes para este momento da comunidade." /><div className="grid gap-4 xl:grid-cols-2">{courses.length ? courses.map((course) => <Card key={course.id}><CardHeader><CardTitle>{course.title}</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">{course.description ?? 'Conteúdo selecionado pela curadoria da comunidade.'}</p><Link href={`/membros/videoaulas?course=${course.id}`} className="text-sm font-medium text-primary">Abrir trilha</Link></CardContent></Card>) : <div className="xl:col-span-2"><EmptyState title="Curadoria em preparação" description="Assim que os cursos forem publicados, eles aparecerão aqui para a sua jornada." /></div>}</div></div>;
}

