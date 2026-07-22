import { apiFetch } from "@/lib/api/http";
import type { WaitlistTopic } from "@/lib/member-area";

export type SessionRole = { key: string; name: string };
export type UserWaitlist = { topic: WaitlistTopic; createdAt: string };
export type Me = {
  id: string;
  email: string;
  name?: string | null;
  status?: string;
  createdAt?: string;
  roles: SessionRole[];
  waitlists: UserWaitlist[];
};
export const usersService = {
  meClient: () => apiFetch<Me>({ path: "/users/me" }),
  updateMe: (payload: { name: string }) => apiFetch<Me>({ path: "/users/me", method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  waitlist: (payload: { email: string; name?: string }) => apiFetch({ path: "/users/waitlist", method: "POST", body: JSON.stringify(payload) }),
  myWaitlists: () => apiFetch<UserWaitlist[]>({ path: "/users/me/waitlists" }),
  joinMemberWaitlist: (payload: { topic: WaitlistTopic }) =>
    apiFetch<{ ok: true; alreadyJoined: boolean; waitlists: UserWaitlist[] }>({
      path: "/users/me/waitlists",
      method: "POST",
      body: JSON.stringify(payload),
      csrf: true,
    }),
  createTeacherApplication: (payload: {
    name: string;
    city: string;
    technique: string;
    experience: string;
    whatsapp: string;
  }) =>
    apiFetch({
      path: "/users/me/teacher-application",
      method: "POST",
      body: JSON.stringify(payload),
      csrf: true,
    }),
};
