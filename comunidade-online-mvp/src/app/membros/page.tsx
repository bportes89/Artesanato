import Link from "next/link";
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  HandHeart,
  MessageCircleHeart,
  PlayCircle,
  SunMedium,
} from "lucide-react";
import { WaitlistCta } from "@/components/members/waitlist-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  consultoriaCheckoutLink,
  diagnosisCheckoutLink,
  getDashboardGreeting,
  memberWhatsAppLink,
  welcomeVideoEmbedUrl,
} from "@/lib/member-area";
import { usersServerService } from "@/lib/services/users.server";

const firstSteps = [
  {
    title: "Passo 1",
    subtitle: "Não caminhe sozinha",
    description: "Entre na Comunidade e fique perto das trocas, avisos e conversas do dia a dia.",
    href: "/membros/comunidade",
    action: "Ir para Comunidade",
  },
  {
    title: "Passo 2",
    subtitle: "Comece a aprender",
    description: "Assista às aulas da Fernanda no seu ritmo e volte sempre que precisar.",
    href: "/membros/videoaulas",
    action: "Abrir Videoaulas",
  },
  {
    title: "Passo 3",
    subtitle: "Explore o conteúdo",
    description: "Acesse materiais selecionados para aplicar no seu negócio artesanal.",
    href: "/membros/curadoria",
    action: "Ver Curadoria",
  },
] as const;

const sections = [
  {
    title: "Curadoria",
    teaser: "Conteúdos selecionados a dedo para você aplicar hoje.",
    badge: "Gratuito",
    badgeTone: "free",
    href: "/membros/curadoria",
    action: "Explorar",
    icon: SunMedium,
  },
  {
    title: "Videoaulas",
    teaser: "Aulas da Fernanda para assistir no seu ritmo.",
    badge: "Gratuito",
    badgeTone: "free",
    href: "/membros/videoaulas",
    action: "Assistir",
    icon: PlayCircle,
  },
  {
    title: "Guardiãs do Ofício",
    teaser: "Projeto para preservar e repassar saberes raros.",
    badge: "Em breve",
    badgeTone: "soon",
    href: "/membros/guardias-do-oficio",
    action: "Quero ser avisada",
    icon: HandHeart,
  },
  {
    title: "Ebooks",
    teaser: "Materiais para baixar, ler e aplicar no seu negócio.",
    badge: "Gratuito e pago",
    badgeTone: "paid",
    href: "/membros/ebooks",
    action: "Baixar",
    icon: BookOpen,
  },
  {
    title: "Livro",
    teaser: "Objeto & Cura está em preparação para o lançamento.",
    badge: "Em breve",
    badgeTone: "soon",
    href: "/membros/livro",
    action: "Quero ser avisada",
    icon: BookMarked,
  },
  {
    title: "Comunidade",
    teaser: "O coração da Comunidade ArtesanatoInteligente® está no WhatsApp.",
    badge: "Gratuito",
    badgeTone: "free",
    href: "/membros/comunidade",
    action: "Entrar",
    icon: MessageCircleHeart,
  },
  {
    title: "Workshops",
    teaser: "Turmas pequenas e acompanhamento próximo ao longo do ano.",
    badge: "Em breve",
    badgeTone: "soon",
    href: "/membros/workshops",
    action: "Quero ser avisada",
    icon: CalendarDays,
  },
] as const;

function BadgePill({ label, tone }: { label: string; tone: "free" | "soon" | "paid" }) {
  const classes =
    tone === "free"
      ? "bg-[#9DD4B5]/30 text-[#1B2A3B]"
      : tone === "soon"
        ? "bg-[#F5A623]/25 text-[#1B2A3B]"
        : "bg-[#E8B4A0]/35 text-[#1B2A3B]";

  return <span className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${classes}`}>{label}</span>;
}

export default async function DashboardPage() {
  const user = await usersServerService.me();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="font-display text-3xl font-semibold text-[#1B2A3B] md:text-5xl">{getDashboardGreeting(user)}</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">
          Esta é a vitrine da sua jornada dentro da Comunidade ArtesanatoInteligente®. Tudo o que você precisa começa aqui.
        </p>
      </section>

      <Card className="overflow-hidden border border-[#1B2A3B]/10 bg-white/85">
        <CardHeader className="space-y-3">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">
            Antes de começar, um recado da Fernanda para você.
          </p>
          <CardTitle className="font-display text-3xl text-[#1B2A3B]">Boas-vindas à sua comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          {welcomeVideoEmbedUrl ? (
            <div className="overflow-hidden rounded-[24px] border border-[#1B2A3B]/10">
              <iframe
                src={welcomeVideoEmbedUrl}
                title="Vídeo de boas-vindas da Fernanda"
                className="aspect-video w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen={false}
              />
            </div>
          ) : (
            <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-dashed border-[#1B2A3B]/20 bg-[#F1E8DC] p-6 text-center text-base leading-8 text-[#1B2A3B]/80">
              O vídeo de boas-vindas da Fernanda será integrado aqui assim que o arquivo for enviado.
            </div>
          )}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">Comece por aqui</p>
          <h2 className="font-display text-3xl font-semibold text-[#1B2A3B]">Seus primeiros passos</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {firstSteps.map((step) => (
            <Card key={step.title} className="border border-[#1B2A3B]/10 bg-white/85">
              <CardHeader>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">{step.title}</p>
                <CardTitle className="font-display text-2xl text-[#1B2A3B]">{step.subtitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-base leading-8 text-[#1B2A3B]/80">{step.description}</p>
                <Button asChild className="min-h-11 w-full">
                  <Link href={step.href}>{step.action}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">Tudo em um só lugar</p>
          <h2 className="font-display text-3xl font-semibold text-[#1B2A3B]">Explore cada área da plataforma</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isComingSoon = section.badgeTone === "soon";

            return (
              <Card
                key={section.title}
                className={`border border-[#1B2A3B]/10 ${isComingSoon ? "bg-[linear-gradient(135deg,rgba(27,42,59,0.04),rgba(245,166,35,0.12))]" : "bg-white/85"}`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1B2A3B] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <BadgePill label={section.badge} tone={section.badgeTone as "free" | "soon" | "paid"} />
                  </div>
                  <CardTitle className="font-display text-2xl text-[#1B2A3B]">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-base leading-8 text-[#1B2A3B]/80">{section.teaser}</p>
                  {section.title === "Guardiãs do Ofício" ? (
                    <WaitlistCta topic="GUARDIAS_DO_OFICIO" buttonLabel={section.action} />
                  ) : section.title === "Livro" ? (
                    <WaitlistCta topic="LIVRO" buttonLabel={section.action} />
                  ) : section.title === "Workshops" ? (
                    <WaitlistCta topic="WORKSHOPS" buttonLabel={section.action} />
                  ) : section.title === "Comunidade" ? (
                    <Button asChild className="min-h-11 w-full">
                      <Link href={memberWhatsAppLink} target="_blank" rel="noreferrer">
                        {section.action}
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="min-h-11 w-full">
                      <Link href={section.href}>{section.action}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Card className="border border-[#D4542A]/20 bg-[linear-gradient(135deg,rgba(212,84,42,0.12),rgba(232,180,160,0.45))]">
        <CardHeader className="space-y-3">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">Destaque</p>
          <CardTitle className="font-display text-3xl text-[#1B2A3B]">Diagnóstico & Consultoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/85">
            Antes de avançar, é preciso entender onde você está. Comece pelo Diagnóstico ou conheça a Consultoria
            ArtesanatoInteligente® Essencial.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="min-h-11 flex-1">
              <Link href={diagnosisCheckoutLink} target="_blank" rel="noreferrer">
                Quero agendar meu Diagnóstico
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11 flex-1 bg-white/70">
              <Link href={consultoriaCheckoutLink} target="_blank" rel="noreferrer">
                Quero conhecer a Consultoria
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[#1B2A3B]/10 bg-white/85">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-[#1B2A3B]">Acesso rápido ao WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="min-h-11">
            <Link href={memberWhatsAppLink} target="_blank" rel="noreferrer">
              Entrar no grupo do WhatsApp <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
