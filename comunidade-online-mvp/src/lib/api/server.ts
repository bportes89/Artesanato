import { cookies } from "next/headers";
import { appConfig, apiUrl } from "@/lib/config";

export async function serverApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const headers = new Headers(init?.headers ?? {});
  headers.set("accept", "application/json");
  headers.set("x-tenant-slug", appConfig.tenantSlug);
  const cookieHeader = cookieStore.toString();
  if (cookieHeader) headers.set("cookie", cookieHeader);

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    cache: init?.cache ?? "no-store",
  });

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(typeof payload === "string" ? payload : ((payload as { message?: string }).message ?? "Erro inesperado"));
  return payload as T;
}

export async function safeServerApiFetch<T>(path: string, init?: RequestInit) {
  try {
    return await serverApiFetch<T>(path, init);
  } catch {
    return null;
  }
}

