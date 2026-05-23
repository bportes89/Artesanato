"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  generateToken,
  hashPassword,
  requireUser,
  sha256Hex,
  verifyPassword,
} from "@/lib/auth";

const emailSchema = z.string().trim().email();

export async function captureLead(formData: FormData) {
  const email = emailSchema.parse(formData.get("email"));
  await prisma.lead.upsert({
    where: { email },
    update: {},
    create: { email },
  });
  redirect("/?lead=ok");
}

export async function registerUser(_prevState: { error?: string } | null, formData: FormData) {
  const schema = z.object({
    name: z.string().trim().min(2).max(80).optional().or(z.literal("")),
    email: emailSchema,
    password: z.string().min(8).max(128),
  });

  const parsedResult = schema.safeParse({
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  });
  if (!parsedResult.success) return { error: "Dados invÃ¡lidos" };
  const parsed = parsedResult.data;

  const passwordHash = await hashPassword(parsed.password);

  let userId: string;
  try {
    const user = await prisma.user.create({
      data: {
        email: parsed.email.toLowerCase(),
        name: parsed.name ? parsed.name : null,
        passwordHash,
      },
      select: { id: true },
    });
    userId = user.id;
  } catch (err: unknown) {
    const anyErr = err as { code?: string };
    if (anyErr?.code === "P2002") return { error: "E-mail jÃ¡ cadastrado" };
    throw err;
  }

  await createSession(userId);
  redirect("/membros/mentoria?primeiro=1");
}

export async function loginUser(_prevState: { error?: string } | null, formData: FormData) {
  const schema = z.object({
    email: emailSchema,
    password: z.string().min(1).max(128),
  });

  const parsedResult = schema.safeParse({
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  });
  if (!parsedResult.success) return { error: "Dados invÃ¡lidos" };
  const parsed = parsedResult.data;

  const user = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
    select: { id: true, passwordHash: true },
  });

  if (!user) return { error: "Credenciais invÃ¡lidas" };

  const ok = await verifyPassword(parsed.password, user.passwordHash);
  if (!ok) return { error: "Credenciais invÃ¡lidas" };

  await createSession(user.id);
  redirect("/membros");
}

export async function logoutUser() {
  await destroySession();
  redirect("/");
}

export async function requestPasswordReset(
  _prevState: { resetUrl: string | null } | null,
  formData: FormData,
) {
  const email = emailSchema.parse(formData.get("email")).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return { resetUrl: null as string | null };

  const token = generateToken();
  const tokenHash = sha256Hex(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
    select: { id: true },
  });

  return { resetUrl: `/redefinir-senha?token=${token}` };
}

export async function resetPassword(_prevState: { error?: string } | null, formData: FormData) {
  const schema = z.object({
    token: z.string().min(10),
    password: z.string().min(8).max(128),
  });

  const parsedResult = schema.safeParse({
    token: formData.get("token")?.toString(),
    password: formData.get("password")?.toString(),
  });
  if (!parsedResult.success) return { error: "Dados invÃ¡lidos" };
  const parsed = parsedResult.data;

  const tokenHash = sha256Hex(parsed.token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  });

  if (!resetToken) return { error: "Token invÃ¡lido" };
  if (resetToken.usedAt) return { error: "Token jÃ¡ utilizado" };
  if (resetToken.expiresAt.getTime() < Date.now()) return { error: "Token expirado" };

  const passwordHash = await hashPassword(parsed.password);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  await createSession(resetToken.userId);
  redirect("/membros");
}

export async function createMentoriaCheckout() {
  const user = await requireUser();

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY nÃ£o configurado");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const amountCents = Number(process.env.MENTORIA_PRICE_CENTS ?? "19900");
  const currency = (process.env.MENTORIA_CURRENCY ?? "brl").toLowerCase();
  const productName = process.env.MENTORIA_PRODUCT_NAME ?? "Mentoria - Primeiro Acesso";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: user.id,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/membros/mentoria?status=sucesso`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/membros/mentoria?status=cancelado`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: amountCents,
          product_data: { name: productName },
        },
      },
    ],
    metadata: {
      userId: user.id,
      purpose: "mentoria_primeiro_acesso",
    },
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      provider: "stripe",
      providerSessionId: session.id,
      status: session.status ?? "created",
      amountCents,
      currency,
    },
    select: { id: true },
  });

  if (!session.url) throw new Error("NÃ£o foi possÃ­vel iniciar o checkout");
  redirect(session.url);
}

