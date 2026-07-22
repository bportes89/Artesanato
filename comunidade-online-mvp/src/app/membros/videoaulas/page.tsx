import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { videoLessons } from "@/lib/member-area";

export default async function VideoaulasPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="w-fit rounded-full bg-[#9DD4B5]/30 px-4 py-2 text-sm font-semibold text-[#1B2A3B]">Gratuito</span>
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Videoaulas</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">
          Aulas da Fernanda para você assistir no seu ritmo, quantas vezes quiser.
        </p>
      </div>

      <Card className="border border-[#1B2A3B]/10 bg-white/85">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-[#1B2A3B]">Espaço do player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-[#1B2A3B]/20 bg-[#F1E8DC] p-6 text-center text-base leading-8 text-[#1B2A3B]/80">
            As 4 aulas já estão organizadas abaixo. O player integrado pode ser conectado aqui assim que os links finais de vídeo forem enviados.
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {videoLessons.map((lesson) => (
          <Card key={lesson.id} className="border border-[#1B2A3B]/10 bg-white/85">
            <div className="h-48 rounded-t-[28px] bg-[linear-gradient(135deg,rgba(27,42,59,0.9),rgba(212,84,42,0.76))]" />
            <CardHeader className="space-y-3">
              <CardTitle className="font-display text-2xl text-[#1B2A3B]">{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-base leading-8 text-[#1B2A3B]/80">{lesson.description}</p>
              <Link
                href="#"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F5A623] px-5 text-base font-semibold text-[#1B2A3B]"
              >
                Assistir
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
