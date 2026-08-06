import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { curationCategories } from "@/lib/member-area";
import { contentService, type CurationItem } from "@/lib/services/content";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function inferKind(url: string) {
  const href = url.toLowerCase();
  if (href.includes(".pdf")) return "PDF";
  if (href.includes("youtube") || href.includes("youtu.be") || href.includes("vimeo")) return "Vídeo";
  if (href.includes("canva")) return "Template";
  if (href.includes("drive.google")) return "Material";
  return "Link";
}

function resolveCategoryId(item: Pick<CurationItem, "tag" | "title">) {
  const source = normalizeText(item.tag || item.title);
  const aliases: Array<[string, string]> = [
    ["como precificar", "01"],
    ["precificacao", "01"],
    ["tecnicas de vendas", "02"],
    ["vendas", "02"],
    ["como usar o canva", "03"],
    ["canva", "03"],
    ["legislacao do artesanato", "04"],
    ["legislacao", "04"],
    ["aulas gratuitas da fernanda", "05"],
    ["fernanda", "05"],
    ["redes sociais", "06"],
    ["embalagem e apresentacao", "07"],
    ["embalagem", "07"],
    ["marketplaces e e-commerce", "08"],
    ["marketplaces", "08"],
    ["e-commerce", "08"],
  ];

  for (const [term, categoryId] of aliases) {
    if (source.includes(term)) return categoryId;
  }

  return null;
}

function matchPublishedItem(editorialTitle: string, published: CurationItem[]) {
  const editorial = normalizeText(editorialTitle);
  return (
    published.find((item) => normalizeText(item.title) === editorial) ??
    published.find((item) => normalizeText(item.title).includes(editorial)) ??
    published.find((item) => editorial.includes(normalizeText(item.title)))
  );
}

type CuratedCard = {
  key: string;
  title: string;
  description: string;
  kind: string;
  href: string | null;
  actionLabel: string;
};

export default async function CuradoriaPage() {
  const publishedItems = (await contentService.curation()) ?? [];
  const groupedPublishedItems = new Map<string, CurationItem[]>();

  for (const item of publishedItems) {
    const categoryId = resolveCategoryId(item);
    if (!categoryId) continue;
    const current = groupedPublishedItems.get(categoryId) ?? [];
    current.push(item);
    groupedPublishedItems.set(categoryId, current);
  }

  const categories = curationCategories.map((category) => {
    const publishedCategoryItems = groupedPublishedItems.get(category.id) ?? [];
    const matchedPublishedIds = new Set<string>();
    const items: CuratedCard[] = [];

    for (const item of category.items) {
      const published = matchPublishedItem(item.title, publishedCategoryItems);
      if (published) matchedPublishedIds.add(published.id);

      if (published?.url) {
        items.push({
          key: published.id,
          title: published.title,
          description: published.description?.trim() || item.description,
          href: published.url,
          kind: inferKind(published.url),
          actionLabel: "Abrir conteúdo",
        });
        continue;
      }

      items.push({
        key: item.title,
        title: item.title,
        description: item.description,
        href: null,
        kind: item.kind,
        actionLabel: "Em breve",
      });
    }

    for (const item of publishedCategoryItems) {
      if (matchedPublishedIds.has(item.id)) continue;
      items.push({
        key: item.id,
        title: item.title,
        description: item.description?.trim() || "Conteúdo publicado na curadoria da Fernanda para consulta imediata.",
        href: item.url,
        kind: inferKind(item.url),
        actionLabel: "Abrir conteúdo",
      });
    }

    const availableCount = items.filter((item) => item.href).length;

    return {
      ...category,
      items,
      availableCount,
    };
  });

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
        {categories.map((category) => (
          <Card key={category.id} className="border border-[#1B2A3B]/10 bg-white/85">
            <CardHeader className="space-y-3">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">{category.id}</p>
              <CardTitle className="font-display text-2xl text-[#1B2A3B]">{category.title}</CardTitle>
              <p className="text-sm text-[#1B2A3B]/70">
                {category.availableCount > 0
                  ? `${category.availableCount} conteúdo${category.availableCount === 1 ? "" : "s"} disponível${category.availableCount === 1 ? "" : "is"} para abrir agora.`
                  : "Esta categoria será liberada em breve na biblioteca."}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              {category.items.map((item) => (
                <div key={item.key} className="rounded-[24px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#1B2A3B]">{item.title}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#D4542A]">{item.kind}</span>
                  </div>
                  <p className="mt-3 text-base leading-8 text-[#1B2A3B]/80">{item.description}</p>
                  {item.href ? (
                    <Link href={item.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-[#D4542A]">
                      {item.actionLabel}
                    </Link>
                  ) : (
                    <span className="mt-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#1B2A3B]/60">
                      {item.actionLabel}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
