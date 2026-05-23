import { apiFetch } from "@/lib/api/http";
export type Me = { id: string; email: string; name?: string | null; status?: string; createdAt?: string };
export const usersService = {
  meClient: () => apiFetch<Me>({ path: "/users/me" }),
  updateMe: (payload: { name: string }) => apiFetch<Me>({ path: "/users/me", method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  waitlist: (payload: { email: string; name?: string }) => apiFetch({ path: "/users/waitlist", method: "POST", body: JSON.stringify(payload) }),
};
