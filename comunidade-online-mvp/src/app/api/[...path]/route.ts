"use server";

import { NextRequest, NextResponse } from "next/server";

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_API_BASE_URL ?? "http://localhost:3005";
  return raw.replace(/\/$/, "");
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
  const { path } = await context.params;
  const backendBase = getBackendBaseUrl();
  const url = new URL(request.url);
  const target = new URL(`${backendBase}/api/${path.join("/")}${url.search}`);

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

  const upstream = await fetch(target, init);

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
