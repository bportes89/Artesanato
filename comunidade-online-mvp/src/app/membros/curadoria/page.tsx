import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { curationCategories } from "@/lib/member-area";

export default async function CuradoriaPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="w-fit rounded-full bg-[#9DD4B5]/30 px-4 py-2 text-sm font-semibold text-[#1B2A3B]">Gratuito</span>
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Curadoria</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">
          Conteúdos selecionados a dedo pela Fernanda — sem precisar garimpar na internet.
        </p>
      </div>

      <div className="grid gap-4">
        {curationCategories.map((category) => (
          <Card key={category.id} className="border border-[#1B2A3B]/10 bg-white/85">
            <CardHeader className="space-y-3">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">{category.id}</p>
              <CardTitle className="font-display text-2xl text-[#1B2A3B]">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              {category.items.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#1B2A3B]">{item.title}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#D4542A]">{item.kind}</span>
                  </div>
                  <p className="mt-3 text-base leading-8 text-[#1B2A3B]/80">{item.description}</p>
                  <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-[#D4542A]">
                    Abrir conteúdo
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

