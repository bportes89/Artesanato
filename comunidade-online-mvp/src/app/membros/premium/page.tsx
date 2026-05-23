"use client";
import { useState } from "react";
import { purchasesService } from "@/lib/services/purchases";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const premiumPriceId = process.env.NEXT_PUBLIC_PREMIUM_PRICE_ID;
const mentorshipPriceId = process.env.NEXT_PUBLIC_MENTORIA_PRICE_ID;
export default function PremiumPage() {
  const [message, setMessage] = useState<string | null>(null);
  async function handleCheckout(priceId?: string, provider?: string) {
    if (!priceId) { setMessage('Configure o NEXT_PUBLIC_*_PRICE_ID para habilitar o checkout.'); return; }
    const response = await purchasesService.checkout(priceId, provider);
    if (response.checkoutUrl) window.location.href = response.checkoutUrl;
    else setMessage(`Pedido criado com sucesso: ${response.orderId}`);
  }
  return <div className="space-y-6"><PageHeader eyebrow="Premium" title="Assinaturas, mentorias e upgrades" description="Acesse os produtos premium e dispare o checkout conectado ao backend." /><div className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle>Assinatura premium</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Desbloqueia curadoria avançada, comunidade completa, conteúdos exclusivos e recorrência SaaS.</p><Button className="w-full" onClick={() => handleCheckout(premiumPriceId, 'STRIPE')}>Assinar com Stripe</Button><Button variant="outline" className="w-full" onClick={() => handleCheckout(premiumPriceId, 'MERCADOPAGO')}>Assinar com Mercado Pago</Button></CardContent></Card><Card><CardHeader><CardTitle>Mentoria paga</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Fluxo de primeiro acesso com compra pontual para destravar agenda e acompanhamento.</p><Button className="w-full" variant="accent" onClick={() => handleCheckout(mentorshipPriceId, 'STRIPE')}>Comprar mentoria</Button>{message ? <p className="text-sm text-muted-foreground">{message}</p> : null}</CardContent></Card></div></div>;
}

