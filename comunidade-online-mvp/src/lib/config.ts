const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const appConfig = {
  appName: "Fernanda Sklovsky",
  apiPrefix: process.env.NEXT_PUBLIC_API_PREFIX ?? "api",
  apiBaseUrl: publicApiBaseUrl.replace(/\/$/, ""),
  tenantSlug: process.env.NEXT_PUBLIC_TENANT_SLUG ?? "default",
};
export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (appConfig.apiBaseUrl) return `${appConfig.apiBaseUrl}/${appConfig.apiPrefix}${normalizedPath}`;
  const apiPath = `/${appConfig.apiPrefix}${normalizedPath}`;
  if (typeof window !== "undefined") return apiPath;
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_PUBLIC_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");
  return `${origin.replace(/\/$/, "")}${apiPath}`;
}
