import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { consultoriaCheckoutLink, diagnosisCheckoutLink } from "@/lib/member-area";
import { purchasesServerService } from "@/lib/services/purchases.server";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DiagnosticoConsultoriaPage() {
  const orders = (await purchasesServerService.list()) ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-[#1B2A3B] md:text-5xl">Diagnóstico & Consultoria</h1>
        <p className="max-w-4xl text-base leading-8 text-[#1B2A3B]/80">
          Antes de avançar, é preciso entender onde você está. Por isso criamos dois caminhos — que podem andar juntos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-[#D4542A]/20 bg-white/85">
          <CardHeader className="space-y-4">
            <CardTitle className="font-display text-3xl text-[#1B2A3B]">Diagnóstico com a Fernanda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-base leading-8 text-[#1B2A3B]/80">
              Uma hora dedicada a entender sua realidade a fundo. Ao final você recebe um panorama claro com orientações e
              caminhos para atingir seus próximos passos e conquistas.
            </p>
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-[#D4542A]">R$ 99,00</p>
              <p className="text-sm font-semibold text-[#1B2A3B]/75">Preço especial de lançamento da plataforma</p>
            </div>
            <Button asChild className="min-h-11 w-full">
              <Link href={diagnosisCheckoutLink} target="_blank" rel="noreferrer">
                Quero agendar meu Diagnóstico
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-[#1B2A3B]/10 bg-white/85">
          <CardHeader>
            <CardTitle className="font-display text-3xl text-[#1B2A3B]">Consultoria ArtesanatoInteligente® Essencial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-base leading-8 text-[#1B2A3B]/80">
              Quatro encontros que transformam o que foi diagnosticado em ação concreta. Cada sessão aprofunda uma etapa do
              seu negócio artesanal — com método, direção e acompanhamento da Fernanda.
            </p>
            <p className="text-3xl font-semibold text-[#D4542A]">R$ 1.200,00</p>
            <Button asChild className="min-h-11 w-full">
              <Link href={consultoriaCheckoutLink} target="_blank" rel="noreferrer">
                Quero conhecer a Consultoria
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[#1B2A3B]/10 bg-white/85">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-[#1B2A3B]">Histórico de compras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.length ? (
            orders.map((order) => (
              <div key={order.id} className="rounded-[24px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-5 py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#1B2A3B]">{order.items.map((item) => item.product.name).join(", ")}</p>
                    <p className="mt-2 text-base text-[#1B2A3B]/75">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-[#D4542A]">{formatCurrency(order.totalCents, order.currency)}</p>
                    <p className="text-sm text-[#1B2A3B]/75">{order.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-base leading-8 text-[#1B2A3B]/80">Você ainda não realizou nenhuma compra.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
