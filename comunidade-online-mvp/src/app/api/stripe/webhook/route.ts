import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_API_BASE_URL ?? "http://localhost:3005";
  return raw.replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
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
}

