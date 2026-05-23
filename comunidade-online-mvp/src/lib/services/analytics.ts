import { apiFetch } from "@/lib/api/http";

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "analytics_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(key, created);
  return created;
}

export const analyticsService = {
  trackEvent: async (params: { name: string; properties?: unknown; authenticated?: boolean }) => {
    const sessionId = getSessionId();
    const referrerRaw = typeof document !== "undefined" ? document.referrer : "";
    const referrer = referrerRaw ? referrerRaw : undefined;
    const path = params.authenticated ? "/analytics/me/event" : "/analytics/event";
    return apiFetch({
      path,
      method: "POST",
      csrf: true,
      body: JSON.stringify({ name: params.name, properties: params.properties, sessionId, referrer }),
    });
  },
  trackPageview: async (params: { path: string; title?: string; authenticated?: boolean }) => {
    const sessionId = getSessionId();
    const referrerRaw = typeof document !== "undefined" ? document.referrer : "";
    const referrer = referrerRaw ? referrerRaw : undefined;
    const titleRaw = params.title ?? "";
    const title = titleRaw ? titleRaw : undefined;
    const path = params.authenticated ? "/analytics/me/pageview" : "/analytics/pageview";
    return apiFetch({
      path,
      method: "POST",
      csrf: true,
      body: JSON.stringify({ path: params.path, title, sessionId, referrer }),
    });
  },
};
