import { apiFetch } from "@/lib/api/http";
import { safeServerApiFetch } from "@/lib/api/server";
export type MentorshipOffer = { id: string; name: string; description?: string | null; status?: string };
export const mentorshipService = {
  offers: () => safeServerApiFetch<MentorshipOffer[]>("/mentorship/offers"),
  my: () => safeServerApiFetch<unknown[]>("/mentorship/me"),
  schedule: (payload: { offerId: string; scheduledAt: string; meetingUrl?: string }) => apiFetch({ path: "/mentorship/schedule", method: "POST", body: JSON.stringify(payload), csrf: true }),
};

