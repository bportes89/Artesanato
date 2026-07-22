"use server";

import { NextRequest, NextResponse } from "next/server";

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw?.trim()) return raw.replace(/\/$/, "");
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === "production") {
    throw new Error("BACKEND_API_BASE_URL nao configurado");
  }
  return "http://localhost:3005";
}

function buildProxyErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Falha ao conectar ao backend";
  const isConfigError = /BACKEND_API_BASE_URL/i.test(message);
  return NextResponse.json(
    {
      message: isConfigError
        ? "Integracao com o backend nao configurada. Defina BACKEND_API_BASE_URL no deploy do frontend."
        : "Backend indisponivel no momento. Verifique a URL e a disponibilidade da API.",
    },
    { status: isConfigError ? 500 : 503 },
  );
}

async function forwardRequest(request: NextRequest, target: URL) {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) init.body = await request.text();
    else init.body = await request.arrayBuffer();
  }

  return fetch(target, init);
}

async function createProxyResponse(upstream: Response) {
  const responseHeaders = new Headers(upstream.headers);
  const setCookieFallback = upstream.headers.get("set-cookie");
  const setCookies = (upstream.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ?? (setCookieFallback ? [setCookieFallback] : []);
  const status = upstream.status;
  const body = await upstream.arrayBuffer();

  const res = new NextResponse(body, { status });

  const excluded = new Set(["content-encoding", "transfer-encoding", "content-length", "connection", "keep-alive"]);
  for (const [key, value] of responseHeaders.entries()) {
    if (excluded.has(key.toLowerCase())) continue;
    if (key.toLowerCase() === "set-cookie") continue;
    res.headers.set(key, value);
  }

  for (const cookie of setCookies) {
    res.headers.append("set-cookie", cookie);
  }

  return res;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, context);
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params;
    const backendBase = getBackendBaseUrl();
    const url = new URL(request.url);
    const target = new URL(`${backendBase}/api/${path.join("/")}${url.search}`);
    const upstream = await forwardRequest(request, target);
    return createProxyResponse(upstream);
  } catch (error) {
    return buildProxyErrorResponse(error);
  }
}
