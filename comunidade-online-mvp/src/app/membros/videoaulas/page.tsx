import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PandaPlayer } from "@/components/media/panda-player";
import { buildWhatsAppIntentLink, videoLessons } from "@/lib/member-area";
import { contentService, type CourseDetail } from "@/lib/services/content";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default async function VideoaulasPage() {
  const courses = (await contentService.list()) ?? [];
  const courseDetails = (await Promise.all(courses.map((course) => contentService.detail(course.id)))).filter(
    (course): course is CourseDetail => Boolean(course),
  );

  const publishedLessons = courseDetails.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: course.description?.trim() || "Aula da Fernanda disponível para assistir no seu ritmo.",
        pandaVideoId: lesson.video?.pandaVideoId ?? null,
        courseTitle: course.title,
        moduleTitle: module.title,
      })),
    ),
  );

  const mappedLessons = videoLessons.map((lesson) => {
    const realLesson =
      publishedLessons.find((item) => normalizeText(item.title) === normalizeText(lesson.title)) ??
      publishedLessons.find((item) => normalizeText(item.title).includes(normalizeText(lesson.title))) ??
      publishedLessons.find((item) => normalizeText(lesson.title).includes(normalizeText(item.title)));

    return {
      id: realLesson?.id ?? lesson.id,
      title: realLesson?.title ?? lesson.title,
      description: realLesson?.description ?? lesson.description,
      pandaVideoId: realLesson?.pandaVideoId ?? null,
      courseTitle: realLesson?.courseTitle ?? "Videoaulas da Fernanda",
      moduleTitle: realLesson?.moduleTitle ?? null,
      hasRealLesson: Boolean(realLesson),
    };
  });

  const featuredLesson = mappedLessons.find((lesson) => lesson.pandaVideoId);
  const featuredPlayableLesson =
    featuredLesson?.pandaVideoId
      ? {
          ...featuredLesson,
          pandaVideoId: featuredLesson.pandaVideoId,
        }
      : null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="w-fit rounded-full bg-[#9DD4B5]/30 px-4 py-2 text-sm font-semibold text-[#1B2A3B]">Gratuito</span>
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Videoaulas</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">
          Aulas da Fernanda para você assistir no seu ritmo, quantas vezes quiser.
        </p>
      </div>

      {featuredPlayableLesson ? (
        <Card className="border border-[#1B2A3B]/10 bg-white/85">
          <CardHeader className="space-y-3">
            <span className="w-fit rounded-full bg-[#F1E8DC] px-4 py-2 text-sm font-semibold text-[#D4542A]">
              Aula em destaque
            </span>
            <CardTitle className="font-display text-2xl text-[#1B2A3B]">{featuredPlayableLesson.title}</CardTitle>
            <p className="text-base leading-8 text-[#1B2A3B]/80">
              {featuredPlayableLesson.moduleTitle
                ? `${featuredPlayableLesson.courseTitle} • ${featuredPlayableLesson.moduleTitle}`
                : featuredPlayableLesson.courseTitle}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <PandaPlayer lessonId={featuredPlayableLesson.id} videoId={featuredPlayableLesson.pandaVideoId} />
            <p className="text-base leading-8 text-[#1B2A3B]/80">{featuredPlayableLesson.description}</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {mappedLessons.map((lesson) => (
          <Card key={lesson.id} className="border border-[#1B2A3B]/10 bg-white/85">
            <div className="h-48 rounded-t-[28px] bg-[linear-gradient(135deg,rgba(27,42,59,0.9),rgba(212,84,42,0.76))]" />
            <CardHeader className="space-y-3">
              <CardTitle className="font-display text-2xl text-[#1B2A3B]">{lesson.title}</CardTitle>
              <p className="text-sm text-[#1B2A3B]/70">
                {lesson.moduleTitle ? `${lesson.courseTitle} • ${lesson.moduleTitle}` : lesson.courseTitle}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-base leading-8 text-[#1B2A3B]/80">{lesson.description}</p>
              {lesson.pandaVideoId ? (
                <div className="space-y-4">
                  <PandaPlayer lessonId={lesson.id} videoId={lesson.pandaVideoId} />
                  <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#9DD4B5]/30 px-5 text-base font-semibold text-[#1B2A3B]">
                    Aula liberada
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-dashed border-[#1B2A3B]/15 bg-[#F1E8DC] px-5 py-5 text-base leading-8 text-[#1B2A3B]/80">
                    {lesson.hasRealLesson
                      ? "A estrutura da aula já está publicada. O player será liberado assim que o vídeo final for vinculado."
                      : "Esta aula será publicada aqui assim que o conteúdo final for vinculado na plataforma."}
                  </div>
                  <Link
                    href={buildWhatsAppIntentLink(`Olá, quero receber acesso à aula "${lesson.title}" da Comunidade ArtesanatoInteligente®.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F5A623] px-5 text-base font-semibold text-[#1B2A3B]"
                  >
                    Solicitar acesso
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
