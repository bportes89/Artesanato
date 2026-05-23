import { apiFetch } from "@/lib/api/http";
export type AuthPayload = { email: string; password: string; name?: string; phone?: string };
export type PasswordResetConfirmPayload = { token: string; password: string };
export const authService = {
  csrf: () => apiFetch<{ token: string }>({ path: "/auth/csrf" }),
  login: (payload: AuthPayload) => apiFetch({ path: "/auth/login", method: "POST", body: JSON.stringify(payload), csrf: true }),
  register: (payload: AuthPayload) => apiFetch({ path: "/auth/register", method: "POST", body: JSON.stringify(payload), csrf: true }),
  logout: () => apiFetch({ path: "/auth/logout", method: "POST", csrf: true }),
  requestReset: (email: string) => apiFetch({ path: "/auth/password-reset/request", method: "POST", body: JSON.stringify({ email }), csrf: true }),
  resetPassword: (payload: PasswordResetConfirmPayload) => apiFetch({ path: "/auth/password-reset/confirm", method: "POST", body: JSON.stringify(payload), csrf: true }),
  refresh: () => apiFetch({ path: "/auth/refresh", method: "POST", csrf: true }),
};

