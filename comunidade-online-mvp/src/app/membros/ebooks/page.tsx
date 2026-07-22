import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ebooksCatalog, memberWhatsAppLink, paidEbookCheckoutLink } from "@/lib/member-area";

export default async function EbooksPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Ebooks</h1>
        <p className="max-w-3xl text-base leading-8 text-[#1B2A3B]/80">Materiais para baixar, ler e aplicar no seu negócio.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {ebooksCatalog.map((ebook) => (
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
              {ebook.id === "guia-fotografia" ? (
                <Button asChild className="min-h-11 w-full">
                  <Link href={memberWhatsAppLink} target="_blank" rel="noreferrer">
                    Baixar agora
                  </Link>
                </Button>
              ) : (
                <Button asChild className="min-h-11 w-full">
                  <Link href={paidEbookCheckoutLink} target="_blank" rel="noreferrer">
                    Comprar
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

