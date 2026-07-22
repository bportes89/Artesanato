import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildWhatsAppIntentLink, ebooksCatalog, paidEbookCheckoutLink } from "@/lib/member-area";
import { ebooksService } from "@/lib/services/ebooks";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default async function EbooksPage() {
  const [publishedEbooks, libraryItems] = await Promise.all([ebooksService.list(), ebooksService.my()]);
  const published = publishedEbooks ?? [];
  const library = libraryItems ?? [];

  const catalog = ebooksCatalog.map((editorialEbook) => {
    const publishedMatch =
      published.find((item) => normalizeText(item.title) === normalizeText(editorialEbook.title)) ??
      published.find((item) => normalizeText(item.title).includes(normalizeText(editorialEbook.title))) ??
      published.find((item) => normalizeText(editorialEbook.title).includes(normalizeText(item.title)));

    const libraryMatch = library.find((item) => item.ebook.id === publishedMatch?.id);
    const isFree = editorialEbook.id === "guia-fotografia";

    return {
      ...editorialEbook,
      title: publishedMatch?.title ?? editorialEbook.title,
      description: publishedMatch?.description?.trim() || editorialEbook.description,
      publishedId: publishedMatch?.id ?? null,
      hasLibraryAccess: Boolean(libraryMatch),
      action:
        isFree && libraryMatch
          ? {
              href: `/api/ebooks/${libraryMatch.ebook.id}`,
              label: "Baixar agora",
              external: false,
            }
          : isFree
            ? {
                href: buildWhatsAppIntentLink(
                  `Olá, quero liberar o download do ebook "${publishedMatch?.title ?? editorialEbook.title}" na Comunidade ArtesanatoInteligente®.`,
                ),
                label: "Solicitar liberação do PDF",
                external: true,
              }
            : {
                href: paidEbookCheckoutLink,
                label: "Comprar",
                external: true,
              },
    };
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Ebooks</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">Materiais para baixar, ler e aplicar no seu negócio.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {catalog.map((ebook) => (
          <Card key={ebook.id} className="border border-[#1B2A3B]/10 bg-white/85">
            <div className="h-56 rounded-t-[28px] bg-[linear-gradient(135deg,rgba(27,42,59,0.9),rgba(245,166,35,0.6))]" />
            <CardHeader className="space-y-3">
              <CardTitle className="font-display text-2xl text-[#1B2A3B]">{ebook.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-base leading-8 text-[#1B2A3B]/80">{ebook.description}</p>
              <div className="flex items-center justify-between gap-4">
                {ebook.badge ? (
                  <span className="rounded-full bg-[#9DD4B5]/30 px-4 py-2 text-sm font-semibold text-[#1B2A3B]">{ebook.badge}</span>
                ) : (
                  <span className="text-2xl font-semibold text-[#D4542A]">{ebook.priceLabel}</span>
                )}
              </div>
              <p className="text-sm text-[#1B2A3B]/70">
                {ebook.hasLibraryAccess
                  ? "Seu acesso já está liberado para este arquivo."
                  : ebook.id === "guia-fotografia"
                    ? "O download é liberado assim que o arquivo estiver disponível na sua biblioteca."
                    : "A compra segue para o checkout configurado da oferta."}
              </p>
              <Button asChild className="min-h-11 w-full">
                <Link
                  href={ebook.action.href}
                  {...(ebook.action.external ? { target: "_blank", rel: "noreferrer" } : { prefetch: false })}
                >
                  {ebook.action.label}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
