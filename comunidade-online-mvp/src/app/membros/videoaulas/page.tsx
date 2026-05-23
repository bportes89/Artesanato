import Link from "next/link";
import { PandaPlayer } from "@/components/media/panda-player";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serverApiFetch } from "@/lib/api/server";
import { contentService } from "@/lib/services/content";
export default async function VideoaulasPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const courses = (await contentService.list()) ?? [];
  const selectedCourseId = typeof params?.course === "string" ? params.course : courses[0]?.id;
  const course = selectedCourseId ? await contentService.detail(selectedCourseId) : null;
  const selectedLessonId = typeof params?.lesson === "string" ? params.lesson : course?.modules?.[0]?.lessons?.[0]?.id;
  const playback = selectedLessonId ? await serverApiFetch<{ pandaVideoId: string }>(`/videos/lessons/${selectedLessonId}/playback`).catch(() => null) : null;
  return <div className="space-y-6"><PageHeader eyebrow="Videoaulas" title={course?.title ?? "Streaming da comunidade"} description="Assista com qualidade premium e retome do ponto em que parou." /><div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">{playback?.pandaVideoId ? <PandaPlayer lessonId={selectedLessonId!} videoId={playback.pandaVideoId} /> : <Card><CardContent className="flex min-h-[360px] items-center justify-center text-center text-sm text-muted-foreground">Selecione uma aula disponível para iniciar o streaming.</CardContent></Card>}<Card><CardHeader><CardTitle>Trilha da aula</CardTitle></CardHeader><CardContent className="space-y-4">{course?.modules?.map((module) => <div key={module.id} className="space-y-3"><div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Módulo</p><p className="font-semibold">{module.title}</p></div><div className="space-y-2">{module.lessons.map((lesson) => <Link key={lesson.id} href={`/membros/videoaulas?course=${course.id}&lesson=${lesson.id}`} className="block rounded-[20px] border border-border/70 px-4 py-3 text-sm hover:bg-muted/50">{lesson.title}</Link>)}</div></div>) ?? <p className="text-sm text-muted-foreground">Ainda não há aulas publicadas.</p>}</CardContent></Card></div></div>;
}
