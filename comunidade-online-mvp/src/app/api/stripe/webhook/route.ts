import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw?.trim()) return raw.replace(/\/$/, "");
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === "production") {
    throw new Error("BACKEND_API_BASE_URL nao configurado");
  }
  return "http://localhost:3005";
}

export async function POST(req: NextRequest) {
  try {
    const backendBaseUrl = getBackendBaseUrl();
    const target = new URL(`${backendBaseUrl}/api/webhooks/stripe`);

    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");

    const upstream = await fetch(target, {
      method: "POST",
      headers,
      redirect: "manual",
      body: await req.arrayBuffer(),
    });

    const res = new NextResponse(await upstream.arrayBuffer(), { status: upstream.status });
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") return;
      res.headers.set(key, value);
    });
    const setCookieFallback = upstream.headers.get("set-cookie");
    const setCookies =
      (upstream.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ??
      (setCookieFallback ? [setCookieFallback] : []);
    for (const cookie of setCookies) res.headers.append("set-cookie", cookie);
    return res;
  } catch (error) {
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
}

