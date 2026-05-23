import Stripe from "stripe";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe nÃ£o configurado" }, { status: 500 });
  }

  const stripe = new Stripe(secret);

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura invÃ¡lida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const purpose = session.metadata?.purpose;

    if (purpose === "mentoria_primeiro_acesso") {
      const userId =
        session.metadata?.userId ??
        (typeof session.client_reference_id === "string" ? session.client_reference_id : null);

      if (userId) {
        await prisma.$transaction([
          prisma.payment.updateMany({
            where: { provider: "stripe", providerSessionId: session.id },
            data: {
              status: "completed",
              providerPaymentIntent:
                typeof session.payment_intent === "string" ? session.payment_intent : null,
            },
          }),
          prisma.user.update({
            where: { id: userId },
            data: { mentorshipPaidAt: new Date() },
          }),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}

