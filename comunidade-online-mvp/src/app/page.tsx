"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Crown, Leaf, MessageCircleHeart, Sparkles, Tv, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/auth";

const topics = [
  "Aprendizado",
  "Comunidade",
  "Curadoria",
  "Pertencimento",
  "ArtesanatoInteligente",
  "Técnicas tradicionais",
  "Branding",
  "Valorização",
  "Precificação",
] as const;

const features = [
  {
    icon: Crown,
    title: "Curadoria de conteúdo selecionado pela Fernanda",
    description:
      "Nada de sair garimpando na internet. Aqui o conteúdo já foi avaliado, testado e escolhido. Você acessa direto o que importa, organizado por tema.",
    tags: ["Como precificar", "Técnicas de vendas", "Como usar o Canva", "Legislação do artesanato", "Aulas gratuitas da Fernanda"],
  },
  {
    icon: Tv,
    title: "Videoaulas exclusivas",
    description:
      "Aulas da Fernanda sobre design, branding, fotografia e valorização do artesanato — organizadas por tema, acessadas no seu ritmo. O mesmo conteúdo que já transformou artesãs em todo o Brasil, agora disponível para você a qualquer hora.",
    tags: ["Aulas por tema", "No seu ritmo", "Do básico ao avançado"],
  },
  {
    icon: MessageCircleHeart,
    title: "Comunidade no WhatsApp",
    description:
      "Assim que você entrar, você recebe o link do grupo exclusivo. Um espaço para trocar, perguntar, divulgar o seu trabalho e se inspirar com o das outras.",
    tags: ["Troca real", "Apoio", "Pertencimento"],
  },
  {
    icon: Users,
    title: "Mentoria individual com a Fernanda",
    description:
      "No seu primeiro acesso, você recebe um convite especial para uma sessão de mentoria individual com a Fernanda, com condição exclusiva de lançamento. Uma hora dedicada ao seu trabalho, à sua história e ao seu próximo passo.",
    tags: ["Mentoria paga", "Plano premium", "Convite no 1º acesso"],
  },
] as const;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatWhatsApp(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export default function HomePage() {
  const router = useRouter();
  const [signup, setSignup] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const phoneFormatted = useMemo(() => formatWhatsApp(signup.phone), [signup.phone]);

  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-[hsl(var(--premium-sidebar-from))] text-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight">Fernanda</span>
            <Leaf className="h-5 w-5 text-accent" />
            <span className="font-serif text-lg font-semibold tracking-tight">Sklovsky</span>
          </Link>

          <Button
            asChild
            className="rounded-full bg-[hsl(var(--brand-gold))] px-5 text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
          >
            <Link href="/login">
              Quero entrar <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, hsl(var(--brand-tan) / 0.10), transparent 40%), radial-gradient(circle at 85% 25%, hsl(var(--brand-mint) / 0.20), transparent 42%), radial-gradient(circle at 75% 85%, hsl(var(--brand-olive) / 0.10), transparent 40%)",
            }}
          />

          <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="space-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Comunidade ArtesanatoInteligente</p>

              <div className="space-y-5">
                <h1 className="font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">
                  A jornada
                  <br />
                  não termina
                  <br />
                  <span className="italic text-accent">no workshop.</span>
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  A Comunidade ArtesanatoInteligente é o espaço onde o aprendizado continua — com conteúdo selecionado, conexão com outras artesãs e tudo
                  que você precisa para crescer, no seu tempo e do seu jeito.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href="#cadastro">
                    Quero fazer parte <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full bg-background/60">
                  <Link href="#como-funciona">Quero entender</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">Gratuito para entrar • Simples de usar • Feito para você</p>
            </div>

            <div className="relative">
              <div className="premium-surface relative overflow-hidden rounded-[32px] p-8">
                <div
                  aria-hidden="true"
                  className="absolute -right-28 -top-28 h-[520px] w-[520px] rounded-full"
                  style={{ background: "hsl(var(--brand-olive) / 0.12)" }}
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full"
                  style={{ background: "hsl(var(--brand-mint) / 0.24)" }}
                />

                <div className="relative space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">O que você encontra aqui</p>
                  <h2 className="font-serif text-3xl font-semibold text-foreground">Tudo organizado para você aplicar.</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-border/70 bg-background/70 p-4">
                      <Crown className="h-5 w-5 text-accent" />
                      <p className="mt-3 font-medium">Curadoria</p>
                      <p className="mt-1 text-sm text-muted-foreground">Conteúdo selecionado, sem dispersão.</p>
                    </div>
                    <div className="rounded-[22px] border border-border/70 bg-background/70 p-4">
                      <Tv className="h-5 w-5 text-accent" />
                      <p className="mt-3 font-medium">Videoaulas</p>
                      <p className="mt-1 text-sm text-muted-foreground">No seu ritmo, do básico ao avançado.</p>
                    </div>
                    <div className="rounded-[22px] border border-border/70 bg-background/70 p-4">
                      <Users className="h-5 w-5 text-accent" />
                      <p className="mt-3 font-medium">Comunidade</p>
                      <p className="mt-1 text-sm text-muted-foreground">Troca real com pertencimento.</p>
                    </div>
                    <div className="rounded-[22px] border border-border/70 bg-background/70 p-4">
                      <Sparkles className="h-5 w-5 text-accent" />
                      <p className="mt-3 font-medium">Mentoria</p>
                      <p className="mt-1 text-sm text-muted-foreground">Convite premium no 1º acesso.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-[hsl(var(--premium-sidebar-from))] text-white">
          <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-10 lg:px-8 lg:pb-20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
                Fernanda <Leaf className="h-5 w-5 text-accent" /> Sklovsky
              </div>
              <Button
                asChild
                className="rounded-full bg-[hsl(var(--brand-gold))] px-5 text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
              >
                <Link href="/login">
                  Quero entrar <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 overflow-auto rounded-[24px] bg-[hsl(var(--brand-tan)/0.95)] px-4 py-3">
              <div className="flex min-w-max items-center gap-6">
                {topics.map((topic) => (
                  <a key={topic} href="#tudo-em-um-so-lugar" className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-ink))]">
                    {topic}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[hsl(var(--brand-gold))]">Este espaço é para você</p>
              <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Você chegou
                <br />
                ao lugar <span className="italic text-[hsl(var(--brand-gold))]">certo.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                Esta comunidade foi criada para quem leva o artesanato a sério — seja você uma artesã que acabou de viver uma transformação numa capacitação,
                ou alguém que nunca para de aprender e buscar o próximo nível.
              </p>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Você passou por uma capacitação</p>
                <ul className="space-y-4 text-sm text-white/85">
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                    <span>Você viveu algo importante naquelas horas — e não quer que aquilo fique só no workshop.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                    <span>Você quer continuar aprendendo com a Fernanda, acessar os conteúdos do método e aplicar no dia a dia.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                    <span>Você quer se conectar com as outras artesãs que estiveram na mesma sala — e com tantas outras espalhadas pelo Brasil.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Você quer sempre se aprimorar</p>
                <ul className="space-y-4 text-sm text-white/85">
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                    <span>Você não se contenta em saber só o básico — quer entender de branding, precificação, fotografia, vendas e muito mais.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                    <span>Você busca referências de qualidade, não qualquer conteúdo da internet — quer o que foi selecionado por quem entende.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                    <span>Você quer estar conectada a uma comunidade ativa, trocar experiências, divulgar o seu trabalho e se inspirar com o das outras.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="tudo-em-um-so-lugar" className="bg-background">
          <div className="mx-auto max-w-[1100px] px-4 py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">O que você encontra aqui</p>
                <h2 className="font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                  Tudo em
                  <br />
                  <span className="italic text-accent">um só lugar.</span>
                </h2>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  Sem precisar garimpar na internet. Sem dispersão. O que está aqui foi escolhido a dedo — e vai crescendo com a comunidade.
                </p>

                <div className="premium-surface rounded-[28px] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Acesso rápido</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Button asChild variant="outline" className="justify-start rounded-[18px] bg-background/70">
                      <Link href="/membros/curadoria">
                        <Crown className="h-4 w-4" />
                        Curadoria
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start rounded-[18px] bg-background/70">
                      <Link href="/membros/videoaulas">
                        <Tv className="h-4 w-4" />
                        Videoaulas
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start rounded-[18px] bg-background/70">
                      <Link href="/membros/ebooks">
                        <BookOpen className="h-4 w-4" />
                        Ebooks
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start rounded-[18px] bg-background/70">
                      <Link href="/membros/whatsapp">
                        <MessageCircleHeart className="h-4 w-4" />
                        WhatsApp
                      </Link>
                    </Button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Se você ainda não tem acesso, clique em <span className="font-semibold text-foreground">Quero fazer parte</span> lá no topo.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={feature.title} className="rounded-[28px] border-border/70 bg-background/70 shadow-sm">
                      <CardContent className="p-7">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-accent/15 text-accent">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <p className="text-base font-semibold text-foreground">{feature.title}</p>
                            <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {feature.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="o-que-esta-por-vir" className="bg-[hsl(var(--premium-sidebar-from))] text-white">
          <div className="mx-auto max-w-[1100px] px-4 py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[hsl(var(--brand-gold))]">O que está por vir</p>
            <h2 className="mt-6 font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              A comunidade
              <br />
              que <span className="italic text-[hsl(var(--brand-gold))]">cresce com você.</span>
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
              Quem entra agora entra no começo de algo que vai muito além. A Comunidade ArtesanatoInteligente está em construção — e cada nova etapa foi
              pensada para dar ainda mais valor ao que você sabe e ao que você faz.
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
                <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                  Em produção • Em breve
                </p>
                <p className="mt-4 text-lg font-semibold">Videoaulas de técnicas tradicionais — ensinadas pelas próprias artesãs</p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  A primeira gravação já está acontecendo: uma aula completa de frivolité — uma técnica delicada e rara que corre o risco de se perder. A
                  artesã que ensina é mestre no ofício. A Fernanda cuida da produção. E a aula fica disponível para toda a comunidade.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  Mais artesãs serão convidadas. Mais técnicas serão gravadas. Porque preservar um saber é também garantir que ele continue vivo — e que
                  quem o domina seja reconhecida e remunerada por isso.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
                <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                  Em breve
                </p>
                <p className="mt-4 text-lg font-semibold">Mais conteúdo, mais conexões, mais possibilidades</p>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  Novas categorias de curadoria, novas artesãs convidadas, novos formatos de aprendizado. A comunidade cresce com quem faz parte dela — e
                  você, que está entrando agora, ajuda a construir o que vem pela frente.
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]">
                <a href="#cadastro">
                  Quero fazer parte <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10">
                <Link href="/login">Já tenho acesso</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="quem-criou" className="bg-background">
          <div className="mx-auto max-w-[1100px] px-4 py-16 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Quem criou esta comunidade</p>
                <h2 className="font-serif text-6xl font-semibold leading-[0.95] tracking-tight text-foreground">
                  Fernanda
                  <br />
                  <span className="italic text-accent">Sklovsky</span>
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Há mais de 25 anos, Fernanda Sklovsky percorre o Brasil ao lado de artesãs e artesãos — trabalhando onde o design e o artesanato se
                  encontram com a identidade cultural e a geração de renda. Mestre em Design Estratégico, criou o Método ArtesanatoInteligente a partir de
                  uma convicção simples e profunda: a pessoa vem antes do produto.
                </p>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-border/70 bg-background/70 p-8">
                  <p className="border-l-2 border-accent pl-5 font-serif text-xl italic leading-relaxed text-foreground">
                    “O que falta nesses produtos não é técnica. É identidade. É história. E essas são coisas que cada uma já tem — só ainda não sabe que
                    tem.”
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    O método já percorreu mais de 60 municípios gaúchos, foi desenvolvido em parceria com o Sebrae e alcançou mais de 1.500 artesãs
                    capacitadas diretamente. A Comunidade ArtesanatoInteligente nasceu para que esse trabalho continue — agora com um espaço permanente,
                    acessível e em constante crescimento.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 rounded-[28px] border border-border/70 bg-background/70 p-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "25", label: "anos de atuação" },
                { value: "+1.500", label: "artesãs capacitadas" },
                { value: "+60", label: "municípios percorridos" },
                { value: "+10", label: "estados no Brasil" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-semibold text-accent">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="primeiro-acesso" className="bg-background">
          <div className="mx-auto max-w-[1100px] px-4 pb-16 lg:px-8 lg:pb-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">Primeiro acesso</p>
                <h2 className="font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                  Uma hora
                  <br />
                  só sua, com
                  <br />
                  <span className="italic text-accent">a Fernanda.</span>
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Quando você faz seu primeiro acesso à comunidade, recebe um convite para uma mentoria individual. Uma conversa real, personalizada para o
                  seu trabalho, a sua história e o seu momento.
                </p>

                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "Análise do seu trabalho e da sua trajetória",
                    "Orientações de branding, identidade e posicionamento",
                    "Como precificar e valorizar o que você cria",
                    "Diagnóstico com base no Método ArtesanatoInteligente",
                    "Agendamento direto pelo WhatsApp, no seu horário",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="premium-surface overflow-hidden rounded-[28px]">
                <div className="bg-[hsl(var(--premium-sidebar-from))] p-8 text-white">
                  <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">
                    Oferta de lançamento
                  </p>
                  <p className="mt-4 text-sm text-white/70">De R$ 400,00</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-[hsl(var(--brand-gold))]">R$ 197</p>
                  <p className="mt-4 text-sm text-white/75">Sessão de 1 hora via vídeo</p>
                  <p className="mt-1 text-xs text-white/60">Condição exclusiva para membros da comunidade</p>

                  <Button
                    asChild
                    size="lg"
                    className="mt-8 w-full rounded-full bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
                  >
                    <a href="#cadastro">
                      Garantir minha vaga <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>

                  <p className="mt-4 text-center text-xs text-white/60">Disponível após o cadastro, no primeiro acesso.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cadastro" className="bg-background">
          <div className="mx-auto max-w-[1100px] px-4 pt-16 lg:px-8 lg:pt-20">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-accent">Cadastro gratuito</p>
            <h2 className="mt-6 text-center font-serif text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Entre para a
              <br />
              <span className="italic text-accent">Comunidade AI</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:text-base">
              Preencha os campos abaixo para criar a sua conta na Comunidade ArtesanatoInteligente. É gratuito, simples e rápido. Se precisar de ajuda, é
              só chamar no WhatsApp.
            </p>
          </div>

          <div className="mt-12 bg-[hsl(var(--premium-sidebar-from))] py-14">
            <div className="mx-auto flex max-w-[1100px] justify-center px-4 lg:px-8">
              <div className="w-full max-w-[520px] rounded-[28px] border border-white/10 bg-white/5 p-8 text-white shadow-premium">
                <form
                  className="space-y-5"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setSignupError(null);
                    const phoneDigits = digitsOnly(signup.phone);
                    if (signup.password !== signup.confirmPassword) {
                      setSignupError("As senhas não conferem.");
                      return;
                    }
                    setSignupLoading(true);
                    try {
                      await authService.register({ name: signup.name, email: signup.email, password: signup.password, phone: phoneDigits });
                      router.push("/membros/onboarding");
                      router.refresh();
                    } catch (err) {
                      setSignupError(err instanceof Error ? err.message : "Falha no cadastro.");
                    } finally {
                      setSignupLoading(false);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Seu nome completo</p>
                    <Input
                      placeholder="Digite seu nome"
                      value={signup.name}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setSignup((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Seu e-mail</p>
                    <Input
                      placeholder="Digite seu e-mail"
                      type="email"
                      value={signup.email}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setSignup((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                    <p className="text-xs text-white/60">Será usado para acessar a Comunidade</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Seu WhatsApp</p>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={phoneFormatted}
                      inputMode="tel"
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setSignup((prev) => ({ ...prev, phone: event.target.value }))}
                      required
                    />
                    <p className="text-xs text-white/60">Para receber o link do grupo da Comunidade</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Crie uma senha</p>
                    <Input
                      placeholder="Mínimo de 8 caracteres"
                      type="password"
                      value={signup.password}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setSignup((prev) => ({ ...prev, password: event.target.value }))}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-white/60">Use letras e números — você vai precisar dela para entrar depois</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--brand-gold))]">Repita a senha</p>
                    <Input
                      placeholder="Digite a mesma senha novamente"
                      type="password"
                      value={signup.confirmPassword}
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/35"
                      onChange={(event) => setSignup((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      required
                      minLength={8}
                    />
                  </div>

                  {signupError ? <p className="text-sm text-[hsl(var(--brand-tan))]">{signupError}</p> : null}

                  <Button
                    className="w-full rounded-full bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]"
                    disabled={signupLoading}
                  >
                    {signupLoading ? "Criando..." : "Criar minha conta — é grátis ✓"}
                  </Button>

                  <p className="text-center text-xs text-white/60">Seus dados estão seguros. Não compartilhamos com ninguém e não enviamos spam.</p>
                </form>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-[1100px] px-4 text-center text-xs text-white/70 lg:px-8">
              Está com dificuldade?{" "}
              <a href="/login?next=%2Fmembros%2Fwhatsapp" className="font-semibold text-[hsl(var(--brand-gold))] hover:opacity-90">
                Fale no WhatsApp →
              </a>
            </div>
          </div>

          <footer className="bg-[hsl(var(--premium-sidebar-from))] py-10 text-white">
            <div className="mx-auto max-w-[1100px] px-4 text-center lg:px-8">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/75">
                <span>Fernanda</span>
                <Leaf className="h-4 w-4 text-accent" />
                <span>Sklovsky</span>
              </div>
              <p className="mt-3 text-xs text-white/60">© 2026 Comunidade ArtesanatoInteligente • Fernanda Sklovsky • Todos os direitos reservados.</p>
              <p className="mt-1 text-xs text-white/60">Termos de uso • Privacidade</p>
            </div>
          </footer>
        </section>
      </main>

      <a
        href="/login?next=%2Fmembros%2Fwhatsapp"
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--brand-mint))] text-[hsl(var(--brand-ink))] shadow-premium ring-1 ring-black/5 transition hover:opacity-90"
        aria-label="WhatsApp"
      >
        <MessageCircleHeart className="h-6 w-6" />
      </a>
    </div>
  );
}
