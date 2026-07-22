"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpenText, Crown, MessageCircleHeart, Sparkles, Star, Tv2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommunitySignupForm, WHATSAPP_HELP_LINK } from "@/components/common/community-signup-form";

const immediateAccessCards = [
  {
    title: "Curadoria de Conteúdos",
    description: "Conteúdos selecionados em formato de vídeo e PDF das áreas fundamentais do negócio artesanal.",
    badge: "Gratuito",
    icon: Crown,
    chips: ["Precificação", "Vendas", "Canva", "Legislação", "Redes Sociais", "Embalagem", "Marketplaces"],
  },
  {
    title: "Videoaulas",
    description: "4 aulas completas da Fernanda, no seu ritmo.",
    badge: "Gratuito",
    icon: Tv2,
    list: ["Masterclass Artesão em Foco", "Coleção de Produtos Artesanais", "Produto Artesanal Identitário", "Branding no Artesanato"],
  },
  {
    title: "Ebooks",
    description: "2 materiais para baixar e aplicar.",
    badge: "Gratuito",
    icon: BookOpenText,
    list: ["Moda & Crochê: 10 ideias inovadoras para crocheterias contemporâneas", "Guia de Fotografia para Artesanato"],
  },
  {
    title: "Comunidade no WhatsApp",
    description:
      "O grupo onde tudo acontece. É aqui que as artesãs se encontram, trocam, se apoiam e crescem juntas. Novidades, conteúdos e oportunidades chegam primeiro aqui.",
    badge: "Gratuito",
    icon: MessageCircleHeart,
  },
] as const;

const tickerTopics = [
  "Aprendizado",
  "Comunidade",
  "Curadoria",
  "Pertencimento",
  "ArtesanatoInteligente®",
  "Guardiãs do Ofício",
  "Workshops",
] as const;

const beginnersBullets = [
  "Você se sente perdida, confusa, insegura em relação ao seu artesanato e não sabe por onde começar.",
  "Você sente que o seu trabalho vale muito mais do que consegue cobrar, mas ainda não encontrou um caminho claro para mudar isso.",
  "Você vê outras artesãs crescendo, sendo reconhecidas e vendendo mais, e quer entender o que elas estão fazendo de diferente.",
  "Você já tentou buscar conteúdo por conta própria, mas pouca coisa está organizada para quem faz artesanato de verdade.",
  "Você quer parar de empreender sozinha e ter, finalmente, um espaço seguro para aprender, crescer e se conectar.",
] as const;

const alumniBullets = [
  "Você quer dar continuidade no desenvolvimento de cada etapa do Método ArtesanatoInteligente®.",
  "Você quer se conectar com outras artesãs de todo o Brasil que viveram a mesma experiência.",
  "Você quer continuar aplicando o método no dia a dia, com conteúdo e apoio à disposição.",
] as const;

const featureCards = [
  {
    title: "Workshops online em pequenas turmas",
    description:
      "Os workshops da Fernanda são abertos ao longo do ano. Cada turma é pequena por escolha: para que cada artesã seja vista, ouvida e acompanhada de verdade. Entre na lista de espera, pois quando abrem, enchem rápido.",
    badge: "Em breve — disponível para compra",
    icon: Star,
    cta: { label: "Quero entrar na lista de espera →", href: "#cadastro", style: "button" as const },
    fullWidth: true,
  },
  {
    title: "Curadoria de Conteúdos",
    description:
      "Acesso gratuito a conteúdos selecionados em vídeo e PDF das áreas fundamentais do negócio artesanal: precificação, vendas, Canva, legislação, redes sociais, embalagem e marketplaces. Avaliado, testado e escolhido a dedo.",
    badge: "Gratuito",
    badgeClass: "bg-[hsl(var(--brand-mint)/0.2)] text-[hsl(var(--brand-mint))]",
    icon: Crown,
  },
  {
    title: "Videoaulas",
    description: "Aulas da Fernanda sobre design, branding, fotografia e valorização do artesanato, no seu ritmo, do básico ao avançado.",
    badge: "Gratuito",
    badgeClass: "bg-[hsl(var(--brand-mint)/0.2)] text-[hsl(var(--brand-mint))]",
    icon: Tv2,
  },
  {
    title: "Comunidade no WhatsApp",
    description: "Assim que você entrar, recebe o link do grupo. Um espaço para trocar, perguntar, divulgar o seu trabalho e se inspirar.",
    badge: "Gratuito",
    badgeClass: "bg-[hsl(var(--brand-mint)/0.2)] text-[hsl(var(--brand-mint))]",
    icon: MessageCircleHeart,
  },
  {
    title: "Guardiãs do Ofício",
    description:
      "Projeto criado especialmente para promover artesãs detentoras de saberes tradicionais e técnicas cheias de valor. Artesãs são convidadas a ensinar suas técnicas em videoaulas produzidas pela Fernanda.",
    badge: "Em breve — disponível para compra",
    icon: UsersRound,
    ctas: [
      { label: "Quero ser avisada", href: "#cadastro" },
      { label: "Quero me candidatar como professora", href: "#cadastro" },
    ],
  },
  {
    title: "Mentoria de Diagnóstico com a Fernanda",
    description: "Uma hora dedicada a entender sua realidade a fundo e te entregar um panorama com orientações e caminhos para os próximos passos.",
    badge: "Disponível para compra",
    badgeClass: "bg-[hsl(var(--brand-mint)/0.2)] text-[hsl(var(--brand-mint))]",
    icon: Sparkles,
    cta: { label: "Disponível para compra →", href: "#cadastro", style: "link" as const },
  },
  {
    title: "Livro — Objeto & Cura",
    description: "O livro da Fernanda Sklovsky. Uma obra sobre o artesanato, o objeto e o que ele carrega. Em breve disponível aqui.",
    badge: "Em breve — disponível para compra",
    icon: BookOpenText,
    cta: { label: "Quero ser avisada →", href: "#cadastro", style: "link" as const },
    fullWidth: true,
  },
] as const;

const socialProofSlides = [
  {
    id: "print-1",
    src: "/prova-social-crop/prova-1.jpg",
    alt: "Depoimento em áudio transcrito no WhatsApp sobre resultados e agradecimento pelo trabalho da Fernanda.",
    width: 1160,
    height: 1470,
    imageClass: "h-[240px] w-auto sm:h-[280px]",
  },
  {
    id: "print-2",
    src: "/prova-social-crop/prova-2.jpg",
    alt: "Mensagens no WhatsApp elogiando as videoaulas, a didática e o conteúdo oferecido.",
    width: 740,
    height: 740,
    imageClass: "h-[150px] w-auto sm:h-[180px]",
  },
  {
    id: "print-3",
    src: "/prova-social/prova-3.png.jpeg",
    alt: "Mensagens no WhatsApp relatando que as aulas trouxeram informações úteis e resultados práticos no negócio artesanal.",
    width: 740,
    height: 1600,
    imageClass: "h-[280px] w-auto sm:h-[340px]",
  },
  {
    id: "print-4",
    src: "/prova-social-crop/prova-4.jpg",
    alt: "Comentário em rede social descrevendo o workshop como transformador para a forma de pensar o trabalho artesanal.",
    width: 600,
    height: 430,
    imageClass: "h-[120px] w-auto sm:h-[148px]",
  },
  {
    id: "print-5",
    src: "/prova-social-crop/prova-5.jpg",
    alt: "Mensagem agradecendo as orientações da Fernanda e contando resultados obtidos após aplicar o aprendizado.",
    width: 600,
    height: 700,
    imageClass: "h-[170px] w-auto sm:h-[210px]",
  },
  {
    id: "print-6",
    src: "/prova-social-crop/prova-6.jpg",
    alt: "Mensagem no WhatsApp dizendo que as aulas foram fantásticas e que o ensinamento da Fernanda fica marcado.",
    width: 580,
    height: 620,
    imageClass: "h-[160px] w-auto sm:h-[190px]",
  },
] as const;

const upcomingCards = [
  {
    title: "Guardiãs do Ofício",
    badges: ["Em produção", "Em breve"],
    description:
      "Espaço criado para o resgate e repasse do conhecimento artesanal tradicional e geração de renda. A Fernanda e equipe ficam responsáveis pela produção e comercialização. A artesã entra como especialista, tem seu trabalho divulgado e recebe pelas vendas. A primeira aula é de frivolité, uma técnica delicada e rara que corre o risco de se perder.",
    cta: "Quero ser avisada →",
  },
  {
    title: "Mais conteúdo, mais conexões, mais possibilidades",
    badges: ["Em breve"],
    description:
      "Novas categorias de curadoria, novas artesãs convidadas, novos formatos de aprendizado. A comunidade cresce com quem faz parte dela, e você, que está entrando agora, ajuda a construir o que vem pela frente.",
  },
] as const;

const authorityStats = [
  { value: 25, suffix: " anos", label: "Anos de atuação" },
  { value: 3000, prefix: "+", label: "Artesãs capacitadas" },
  { value: 100, prefix: "+", label: "Municípios pelo Brasil" },
  { value: 12, label: "Estados" },
] as const;

function AnimatedCounter({ value, label, prefix = "", suffix = "", divider = false }: { value: number; label: string; prefix?: string; suffix?: string; divider?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frameId = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplayValue(Math.round(progress * value));
          if (progress < 1) frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <div ref={ref} className={`px-4 text-center ${divider ? "counter-divider" : ""}`}>
      <div className="font-display text-4xl font-extrabold text-[hsl(var(--brand-tan))] sm:text-5xl">
        {prefix}
        {displayValue.toLocaleString("pt-BR")}
        {suffix}
      </div>
      <p className="font-display mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[hsl(var(--brand-ink)/0.65)]">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const proofRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const updateActiveSlide = (container: HTMLDivElement) => {
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(childCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveSlide(closestIndex);
  };

  const scrollToSlide = (index: number) => {
    const container = proofRef.current;
    const target = container?.children.item(index) as HTMLElement | null;
    if (!container || !target) return;
    container.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="landing-section-cream">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1B2A3B] text-[hsl(var(--brand-sand))]">
        <div className="landing-shell flex min-h-[80px] items-center justify-between gap-4 py-4">
          <Link href="/" className="min-w-0">
            <div className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
              <span>Fernanda</span>
              <Star className="h-5 w-5 fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]" />
              <span>Sklovsky</span>
            </div>
            <div className="font-serif-accent text-sm italic text-[hsl(var(--brand-sand)/0.84)]">ArtesanatoInteligente®</div>
          </Link>

          <Button asChild className="font-display min-h-11 rounded-full bg-[hsl(var(--brand-gold))] px-5 text-base font-bold text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]">
            <Link href="/login">
              Quero entrar <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="landing-section-dark">
          <div className="landing-shell px-0 py-16 sm:py-20">
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">O QUE VOCÊ TERÁ ACESSO IMEDIATO</p>
              <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.04] text-[hsl(var(--brand-sand))] sm:text-5xl lg:text-7xl">
                Bem-vinda à Comunidade ArtesanatoInteligente®.
                <br />
                <span className="font-serif-accent italic text-[hsl(var(--brand-gold))]">Você chegou ao lugar certo.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
                Você não está mais sozinha. Aqui você, artesã, vai fazer parte de um espaço seguro, feito especialmente para apoiar a jornada da artesã que quer crescer o seu trabalho,
                ser reconhecida e valorizada, vender mais e dar os passos para se tornar uma empreendedora criativa que irá viver do seu artesanato.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild className="font-display min-h-11 rounded-full bg-[hsl(var(--brand-tan))] px-6 text-base font-bold text-white hover:bg-[hsl(var(--brand-tan)/0.92)]">
                  <a href="#cadastro">
                    Quero fazer parte <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="font-display min-h-11 rounded-full border-[hsl(var(--brand-sand)/0.3)] bg-[hsl(var(--brand-sand))] px-6 text-base font-bold text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-sand)/0.92)]"
                >
                  <Link href="/login">Já tenho acesso</Link>
                </Button>
              </div>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {immediateAccessCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-premium">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--brand-gold)/0.12)] text-[hsl(var(--brand-gold))]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge className="font-display bg-[hsl(var(--brand-mint)/0.2)] px-3 py-1 text-[hsl(var(--brand-mint))]">{card.badge}</Badge>
                    </div>
                    <h2 className="font-display mt-5 text-2xl font-bold text-[hsl(var(--brand-sand))]">{card.title}</h2>
                    <p className="mt-3 text-base leading-7 text-white/74">{card.description}</p>
                    {"chips" in card ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {card.chips.map((chip) => (
                          <span key={chip} className="font-display rounded-full bg-[hsl(var(--brand-gold)/0.12)] px-3 py-1 text-sm font-semibold text-[hsl(var(--brand-gold))]">
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {"list" in card ? (
                      <ul className="mt-5 space-y-3">
                        {card.list.map((item) => (
                          <li key={item} className="flex gap-3 text-base leading-7 text-white/84">
                            <span className="font-display mt-1 text-[hsl(var(--brand-mint))]">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#203244] py-5 text-[hsl(var(--brand-sand))]">
          <div className="ticker-track gap-6 whitespace-nowrap text-base font-semibold uppercase tracking-[0.18em] opacity-90">
            {[...tickerTopics, ...tickerTopics].map((item, index) => (
              <span key={`${item}-${index}`} className="font-display inline-flex items-center gap-6">
                {item}
                <span className="text-[hsl(var(--brand-gold))]">·</span>
              </span>
            ))}
          </div>
        </section>

        <section className="landing-section-cream py-16 sm:py-20">
          <div className="landing-shell">
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-display text-base font-extrabold uppercase tracking-[0.22em] text-[hsl(var(--brand-tan))]">ESTE ESPAÇO É PARA VOCÊ</p>
              <h2 className="font-display mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Aqui trabalhamos o artesanato
                <br />
                de forma <span className="font-serif-accent italic font-bold text-[hsl(var(--brand-tan))]">inteligente e estratégica.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[hsl(var(--brand-ink)/0.72)] sm:text-lg">
                Esta comunidade foi criada para quem trabalha com artesanato e está pronta para dar os próximos passos na sua jornada empreendedora criativa, independentemente de onde você
                se encontra hoje.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <article className="rounded-[30px] border border-[hsl(var(--brand-tan)/0.15)] bg-[hsl(var(--brand-tan)/0.08)] p-7 shadow-premium">
                <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[hsl(var(--brand-tan))]">VOCÊ ESTÁ CHEGANDO AGORA</p>
                <ul className="mt-6 space-y-4 text-base leading-7 text-[hsl(var(--brand-ink)/0.82)]">
                  {beginnersBullets.map((bullet, index) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--brand-tan))]" />
                      <span className={index === 0 ? "font-semibold text-[hsl(var(--brand-ink))]" : ""}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-[30px] border border-[hsl(var(--brand-ink)/0.08)] bg-white p-7 shadow-premium">
                <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-[hsl(var(--brand-ink))]">VOCÊ JÁ PASSOU POR UMA CAPACITAÇÃO COMIGO</p>
                <ul className="mt-6 space-y-4 text-base leading-7 text-[hsl(var(--brand-ink)/0.82)]">
                  {alumniBullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[hsl(var(--brand-gold))]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section-dark py-16 sm:py-20">
          <div className="landing-shell">
            <div className="max-w-4xl">
              <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">O QUE VOCÊ ENCONTRA AQUI</p>
              <h2 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Tudo em <span className="font-serif-accent italic text-[hsl(var(--brand-gold))]">um só lugar.</span>
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
                Chega de garimpar na internet, de dar voltas e voltas atrás de conteúdos e continuar se sentindo perdida como se não saísse do lugar. Tudo que está aqui foi escolhido a dedo
                e com carinho para te ajudar a crescer.
              </p>
              <p className="mt-4 text-base leading-8 text-white/78">
                <strong className="font-display text-[hsl(var(--brand-gold))]">Fazer parte é gratuito</strong> e já te dá acesso à curadoria de conteúdos, videoaulas, ebooks e ao grupo do
                WhatsApp. Workshops, mentoria, aulas das artesãs e o livro estão disponíveis para compra.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {featureCards.map((card) => {
                const Icon = card.icon;
                const isFullWidth = "fullWidth" in card && card.fullWidth;
                const badgeClass = "badgeClass" in card ? card.badgeClass : undefined;
                return (
                  <article
                    key={card.title}
                    className={`rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-premium ${isFullWidth ? "lg:col-span-2" : ""}`}
                  >
                    <Badge className={`font-display px-4 py-1.5 text-sm font-bold ${badgeClass ?? "bg-[hsl(var(--brand-gold)/0.15)] text-[hsl(var(--brand-gold))]"}`}>{card.badge}</Badge>
                    <div className="mt-5 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-[hsl(var(--brand-gold))]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[hsl(var(--brand-sand))]">{card.title}</h3>
                        <p className="mt-3 text-base leading-7 text-white/76">{card.description}</p>
                      </div>
                    </div>
                    {"cta" in card && card.cta?.style === "button" ? (
                      <div className="mt-6">
                        <Button asChild className="font-display min-h-11 rounded-full bg-[hsl(var(--brand-gold))] px-6 text-base font-bold text-[hsl(var(--brand-ink))] hover:bg-[hsl(var(--brand-gold)/0.92)]">
                          <a href={card.cta.href}>{card.cta.label}</a>
                        </Button>
                      </div>
                    ) : null}
                    {"cta" in card && card.cta?.style === "link" ? (
                      <div className="mt-6">
                        <a href={card.cta.href} className="font-display text-base font-bold text-[hsl(var(--brand-gold))] hover:opacity-90">
                          {card.cta.label}
                        </a>
                      </div>
                    ) : null}
                    {"ctas" in card && card.ctas ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {card.ctas.map((cta) => (
                          <a
                            key={cta.label}
                            href={cta.href}
                            className="font-display inline-flex min-h-11 items-center rounded-full border border-white/18 px-5 py-2 text-base font-semibold text-[hsl(var(--brand-sand))] hover:bg-white/10"
                          >
                            {cta.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-section-cream py-16 sm:py-20">
          <div className="landing-shell">
            <div className="text-center">
              <p className="font-display text-sm font-extrabold uppercase tracking-[0.24em] text-[hsl(var(--brand-tan))]">QUEM JÁ VIVEU ESSA TRANSFORMAÇÃO</p>
              <h2 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">O que as artesãs estão dizendo</h2>
            </div>

            <div ref={proofRef} className="mt-10 flex items-start gap-5 overflow-x-auto pb-4" onScroll={(event) => updateActiveSlide(event.currentTarget)}>
              {socialProofSlides.map((slide) => (
                <button key={slide.id} type="button" onClick={() => scrollToSlide(socialProofSlides.findIndex((item) => item.id === slide.id))} className="shrink-0 text-left">
                  <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_10px_24px_rgba(27,42,59,0.10)]">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={slide.width}
                      height={slide.height}
                      className={`block ${slide.imageClass}`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 28vw, 18vw"
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              {socialProofSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  className={`h-3 w-3 rounded-full transition ${activeSlide === index ? "bg-[hsl(var(--brand-tan))]" : "bg-[hsl(var(--brand-ink)/0.16)]"}`}
                  aria-label={`Ir para o depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section-dark py-16 sm:py-20">
          <div className="landing-shell">
            <div className="max-w-4xl">
              <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">O QUE ESTÁ POR VIR</p>
              <h2 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                A comunidade que <span className="font-serif-accent italic text-[hsl(var(--brand-gold))]">cresce com você.</span>
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
                Quem entra agora entra no começo de algo que vai muito além. Cada nova etapa foi pensada para dar ainda mais valor ao que você sabe e ao que você faz.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {upcomingCards.map((card) => (
                <article key={card.title} className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-premium">
                  <div className="flex flex-wrap gap-2">
                    {card.badges.map((badge) => (
                      <Badge
                        key={badge}
                        className={`font-display px-4 py-1.5 text-sm font-bold ${badge === "Em produção" ? "bg-[hsl(var(--brand-blush)/0.18)] text-[hsl(var(--brand-blush))]" : "bg-[hsl(var(--brand-gold)/0.15)] text-[hsl(var(--brand-gold))]"}`}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-display mt-5 text-2xl font-bold text-[hsl(var(--brand-sand))]">{card.title}</h3>
                  <p className="mt-4 text-base leading-7 text-white/76">{card.description}</p>
                  {"cta" in card && card.cta ? (
                    <div className="mt-6">
                      <a href="#cadastro" className="font-display text-base font-bold text-[hsl(var(--brand-gold))] hover:opacity-90">
                        {card.cta}
                      </a>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section-cream py-16 sm:py-20">
          <div className="landing-shell">
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.24em] text-[hsl(var(--brand-tan))]">QUEM CRIOU ESTA COMUNIDADE</p>
            <div className="mt-8 grid gap-5 rounded-[30px] border border-[hsl(var(--brand-ink)/0.08)] bg-white px-4 py-7 shadow-premium sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
              {authorityStats.map((stat, index) => {
                const prefix = "prefix" in stat ? stat.prefix : "";
                const suffix = "suffix" in stat ? stat.suffix : "";
                return <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} prefix={prefix} suffix={suffix} divider={index !== authorityStats.length - 1} />;
              })}
            </div>

            <div className="mt-12 grid gap-7 lg:grid-cols-2">
              <div className="rounded-[30px] border border-[hsl(var(--brand-ink)/0.08)] bg-white p-7 shadow-premium">
                <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                  Fernanda
                  <br />
                  <span className="font-serif-accent italic text-[hsl(var(--brand-tan))]">Sklovsky</span>
                </h2>
                <p className="mt-5 text-base leading-8 text-[hsl(var(--brand-ink)/0.78)]">
                  Há mais de 25 anos, Fernanda Sklovsky percorre o Brasil ao lado de artesãs e artesãos, trabalhando onde o design e o artesanato se encontram com a identidade cultural e a
                  geração de renda. Mestre em Design Estratégico, criou o Método ArtesanatoInteligente® a partir de uma convicção simples e profunda: a pessoa vem antes do produto.
                </p>
              </div>

              <div className="rounded-[30px] border border-[hsl(var(--brand-ink)/0.08)] bg-white p-7 shadow-premium">
                <p className="font-serif-accent border-l-4 border-[hsl(var(--brand-tan))] pl-5 text-3xl italic leading-[1.3] text-[hsl(var(--brand-ink))]">
                  “O que falta nesses produtos não é técnica. É identidade. É história. E essas são coisas que cada uma já tem, só ainda não sabe que tem.”
                </p>
                <p className="mt-6 text-base leading-8 text-[hsl(var(--brand-ink)/0.78)]">
                  O Método ArtesanatoInteligente® é validado e utilizado em capacitações exclusivas, com propriedade intelectual reconhecida, pelo Sebrae, pelo Governo do Estado do Rio Grande do Sul,
                  diretamente com municípios, associações e instituições. Em mais de 25 anos, percorreu mais de 100 municípios pelo Brasil, atuou em 12 estados e alcançou mais de 3.000 artesãs capacitadas diretamente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cadastro" className="landing-section-dark py-16 sm:py-20">
          <div className="landing-shell">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-[hsl(var(--brand-gold))]">CADASTRO GRATUITO</p>
              <h2 className="font-display mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Entre para a
                <br />
                <span className="font-serif-accent italic text-[hsl(var(--brand-gold))]">Comunidade AI</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-white/78 sm:text-lg">
                Preencha os campos abaixo para criar a sua conta na Comunidade ArtesanatoInteligente®. É gratuito, simples e rápido. Se precisar de ajuda, é só chamar no WhatsApp.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-2xl">
              <CommunitySignupForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#203244] py-12 text-[hsl(var(--brand-sand))]">
        <div className="landing-shell text-center">
          <div className="inline-flex flex-col items-center justify-center gap-1">
            <div className="font-display flex items-center gap-2 text-lg font-semibold">
              <span>Fernanda</span>
              <Star className="h-5 w-5 fill-[hsl(var(--brand-gold))] text-[hsl(var(--brand-gold))]" />
              <span>Sklovsky</span>
            </div>
            <div className="font-serif-accent italic">ArtesanatoInteligente®</div>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/72">© 2026 Comunidade ArtesanatoInteligente® · Fernanda Sklovsky · Todos os direitos reservados.</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/72">
            <Link href="/termos" className="font-display font-semibold hover:text-[hsl(var(--brand-gold))]">
              Termos de uso
            </Link>
            <Link href="/privacidade" className="font-display font-semibold hover:text-[hsl(var(--brand-gold))]">
              Privacidade
            </Link>
          </div>
          <p className="mt-3 text-sm text-white/56">CNPJ: a confirmar</p>
        </div>
      </footer>

      <a
        href={WHATSAPP_HELP_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[hsl(var(--brand-gold))] p-4 text-[hsl(var(--brand-ink))] shadow-premium hover:opacity-90"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircleHeart className="h-6 w-6" />
      </a>
    </div>
  );
}
