import type { Me } from "@/lib/services/users";

export type WaitlistTopic = "GUARDIAS_DO_OFICIO" | "WORKSHOPS" | "LIVRO";

export const memberWhatsAppLink =
  process.env.NEXT_PUBLIC_MEMBER_WHATSAPP_LINK ?? "https://wa.me/5551991135987";

export const diagnosisCheckoutLink =
  process.env.NEXT_PUBLIC_DIAGNOSIS_CHECKOUT_URL ??
  "https://wa.me/5551991135987?text=Ol%C3%A1%2C%20quero%20agendar%20meu%20Diagn%C3%B3stico%20na%20Comunidade%20ArtesanatoInteligente%C2%AE.";

export const consultoriaCheckoutLink =
  process.env.NEXT_PUBLIC_CONSULTORIA_CHECKOUT_URL ??
  "https://wa.me/5551991135987?text=Ol%C3%A1%2C%20quero%20conhecer%20a%20Consultoria%20ArtesanatoInteligente%C2%AE%20Essencial.";

export const paidEbookCheckoutLink =
  process.env.NEXT_PUBLIC_EBOOK_MODA_CROCHE_CHECKOUT_URL ??
  "https://wa.me/5551991135987?text=Ol%C3%A1%2C%20quero%20comprar%20o%20ebook%20Moda%20%26%20Croch%C3%AA.";

export const welcomeVideoEmbedUrl =
  process.env.NEXT_PUBLIC_MEMBER_WELCOME_VIDEO_URL ?? "";

export function getMemberName(name?: string | null) {
  return name?.trim() || "artesã";
}

export function getWelcomeGreeting(user?: Pick<Me, "name"> | null) {
  const name = user?.name?.trim();
  return name ? `Olá, ${name}!` : "Olá, artesã!";
}

export function getDashboardGreeting(user?: Pick<Me, "name"> | null) {
  const name = user?.name?.trim();
  return name ? `Olá, ${name}! Bem-vinda à sua comunidade.` : "Olá, artesã! Bem-vinda à sua comunidade.";
}

export function isAdminUser(user?: Pick<Me, "roles"> | null) {
  return Boolean(user?.roles?.some((role) => role.key === "ADMIN"));
}

export function hasJoinedWaitlist(user: Pick<Me, "waitlists"> | null | undefined, topic: WaitlistTopic) {
  return Boolean(user?.waitlists?.some((item) => item.topic === topic));
}

export const waitlistTopicLabels: Record<WaitlistTopic, string> = {
  GUARDIAS_DO_OFICIO: "Guardiãs do Ofício",
  WORKSHOPS: "Workshops",
  LIVRO: "Livro",
};

export const curationCategories = [
  {
    id: "01",
    title: "Como Precificar",
    items: [
      {
        title: "Planilha simples de precificação artesanal",
        description: "Uma base prática para calcular custo, margem e preço final sem achismo.",
        href: "#",
        kind: "PDF",
      },
      {
        title: "Erros que fazem a artesã vender e não lucrar",
        description: "Pontos de atenção para sair do improviso e precificar com clareza.",
        href: "#",
        kind: "Leitura",
      },
    ],
  },
  {
    id: "02",
    title: "Técnicas de Vendas",
    items: [
      {
        title: "Como apresentar valor antes do preço",
        description: "Ajustes de discurso para vender com mais segurança e menos desconto.",
        href: "#",
        kind: "Vídeo",
      },
      {
        title: "Script acolhedor para responder clientes",
        description: "Mensagens simples para conduzir conversas e fechar pedidos com leveza.",
        href: "#",
        kind: "Modelo",
      },
    ],
  },
  {
    id: "03",
    title: "Como Usar o Canva",
    items: [
      {
        title: "Canva para divulgar peças com mais profissionalismo",
        description: "Passo a passo básico para criar artes bonitas e legíveis.",
        href: "#",
        kind: "Vídeo",
      },
      {
        title: "Template para posts de lançamento",
        description: "Modelo pronto para divulgar coleção, encomendas ou novidades.",
        href: "#",
        kind: "Template",
      },
    ],
  },
  {
    id: "04",
    title: "Legislação do Artesanato",
    items: [
      {
        title: "Panorama inicial sobre formalização",
        description: "Material introdutório para entender caminhos legais do negócio artesanal.",
        href: "#",
        kind: "Leitura",
      },
      {
        title: "Cuidados básicos para vender com mais segurança",
        description: "Checklist para organizar documentação e presença comercial.",
        href: "#",
        kind: "Checklist",
      },
    ],
  },
  {
    id: "05",
    title: "Aulas Gratuitas da Fernanda",
    items: [
      {
        title: "A artesã e o valor do que faz",
        description: "Reflexão prática sobre identidade, posicionamento e direção.",
        href: "#",
        kind: "Vídeo",
      },
      {
        title: "Como fortalecer o olhar estratégico no fazer manual",
        description: "Aula introdutória para sair da repetição e enxergar o negócio com mais nitidez.",
        href: "#",
        kind: "Vídeo",
      },
    ],
  },
  {
    id: "06",
    title: "Redes Sociais",
    items: [
      {
        title: "Conteúdo simples para quem não quer dançar nem aparecer demais",
        description: "Ideias de presença digital compatíveis com a rotina real da artesã.",
        href: "#",
        kind: "Leitura",
      },
      {
        title: "O que postar quando falta tempo e inspiração",
        description: "Uma lista prática para manter constância sem complicação.",
        href: "#",
        kind: "Guia",
      },
    ],
  },
  {
    id: "07",
    title: "Embalagem e Apresentação",
    items: [
      {
        title: "Detalhes que fazem a peça chegar com mais valor percebido",
        description: "Sugestões de acabamento, etiqueta e cuidado final.",
        href: "#",
        kind: "PDF",
      },
      {
        title: "Apresentação visual para encantar sem gastar demais",
        description: "Ajustes de baixo custo com alto impacto na experiência do cliente.",
        href: "#",
        kind: "Checklist",
      },
    ],
  },
  {
    id: "08",
    title: "Marketplaces e E-commerce",
    items: [
      {
        title: "Primeiros passos para vender fora do boca a boca",
        description: "Panorama de canais digitais para ampliar alcance com estratégia.",
        href: "#",
        kind: "Leitura",
      },
      {
        title: "Checklist de cadastro de produto para loja online",
        description: "Campos e cuidados para publicar peças com mais clareza e conversão.",
        href: "#",
        kind: "Checklist",
      },
    ],
  },
] as const;

export const videoLessons = [
  {
    id: "masterclass-1",
    title: "Masterclass Artesão em Foco — Parte 1",
    description: "Primeira parte da imersão para ampliar visão, posicionamento e direção do negócio artesanal.",
  },
  {
    id: "masterclass-2",
    title: "Masterclass Artesão em Foco — Parte 2",
    description: "Continuação da aula com aprofundamento prático sobre estratégia e tomada de decisão.",
  },
  {
    id: "colecao-produtos",
    title: "Coleção de Produtos Artesanais",
    description: "Como pensar coerência, narrativa e organização de coleção com intenção.",
  },
  {
    id: "produto-identitario",
    title: "Produto Artesanal Identitário",
    description: "Uma aula sobre identidade, diferenciação e valor simbólico do que é feito à mão.",
  },
] as const;

export const ebooksCatalog = [
  {
    id: "guia-fotografia",
    title: "Guia de Fotografia para Artesanato",
    description: "Material direto para melhorar fotos, valorizar detalhes e apresentar peças com mais profissionalismo.",
    badge: "GRATUITO",
    badgeTone: "free" as const,
    actionLabel: "Baixar agora",
    priceLabel: null,
  },
  {
    id: "moda-croche",
    title: "Moda & Crochê: 10 ideias inovadoras para crocheterias contemporâneas",
    description: "Um conteúdo para destravar repertório criativo e abrir novas possibilidades de coleção e posicionamento.",
    badge: null,
    badgeTone: "paid" as const,
    actionLabel: "Comprar",
    priceLabel: "R$ 29,90",
  },
] as const;
