import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memberWhatsAppLink } from "@/lib/member-area";

export default function ComunidadePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Comunidade</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">É aqui que tudo acontece. Entre no grupo e faça parte.</p>
      </div>

      <Card className="border border-[#1B2A3B]/10 bg-white/85">
        <CardHeader>
          <CardTitle className="font-display text-3xl text-[#1B2A3B]">Entre no grupo do WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/85">
            O grupo do WhatsApp é o coração da Comunidade ArtesanatoInteligente®. É lá que as artesãs se encontram,
            trocam experiências, tiram dúvidas e se inspiram. Novidades e oportunidades chegam primeiro por aqui.
          </p>
          <Button asChild className="min-h-11 w-full sm:w-auto">
            <Link href={memberWhatsAppLink} target="_blank" rel="noreferrer">
              Entrar no grupo do WhatsApp <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-[#1B2A3B]/10 bg-white/85">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-[#1B2A3B]">Próximas novidades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-8 text-[#1B2A3B]/80">Em breve, novidades por aqui. Fique de olho!</p>
        </CardContent>
      </Card>
    </div>
  );
}
