import { appConfig, apiUrl } from "@/lib/config";

type ApiRequestInit = RequestInit & { path: string; csrf?: boolean; next?: NextFetchRequestConfig };

async function readCsrfToken() {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  await fetch(apiUrl("/auth/csrf"), { method: "GET", credentials: "include", headers: { "x-tenant-slug": appConfig.tenantSlug } });
  const refreshed = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return refreshed?.[1] ? decodeURIComponent(refreshed[1]) : undefined;
}

export async function apiFetch<T>({ path, headers, csrf, ...init }: ApiRequestInit): Promise<T> {
  const finalHeaders = new Headers(headers ?? {});
  finalHeaders.set("Accept", "application/json");
  finalHeaders.set("x-tenant-slug", appConfig.tenantSlug);
  if (init.body && !finalHeaders.has("Content-Type") && !(init.body instanceof FormData)) finalHeaders.set("Content-Type", "application/json");
  const method = (init.method ?? "GET").toUpperCase();
  if (csrf && method !== "GET" && method !== "HEAD") {
    const token = await readCsrfToken();
    if (token) finalHeaders.set("x-csrf-token", token);
  }
  const response = await fetch(apiUrl(path), { ...init, credentials: "include", headers: finalHeaders });
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === "object" && payload && "message" in payload ? (Array.isArray((payload as { message?: unknown }).message) ? ((payload as { message?: string[] }).message?.join(", ") ?? "Erro inesperado") : ((payload as { message?: string }).message ?? "Erro inesperado")) : (typeof payload === "string" ? payload : "Erro inesperado");
    throw new Error(message);
  }
  return payload as T;
}

