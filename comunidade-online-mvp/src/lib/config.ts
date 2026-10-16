const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const appConfig = {
  appName: "Fernanda Sklovsky",
  apiPrefix: process.env.NEXT_PUBLIC_API_PREFIX ?? "api",
  apiBaseUrl: publicApiBaseUrl.replace(/\/$/, ""),
  tenantSlug: process.env.NEXT_PUBLIC_TENANT_SLUG ?? "default",
};
export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const apiPath = `/${appConfig.apiPrefix}${normalizedPath}`;
  if (typeof window !== "undefined") return apiPath;

  const appOrigin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    process.env.APP_PUBLIC_URL?.replace(/\/$/, "") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  // No servidor (Vercel), usar o proxy /api do próprio app para enviar os cookies de sessão.
  if (appOrigin) {
    return `${appOrigin}${apiPath}`;
  }

  if (appConfig.apiBaseUrl) return `${appConfig.apiBaseUrl}/${appConfig.apiPrefix}${normalizedPath}`;
  return `http://localhost:3001${apiPath}`;
}
