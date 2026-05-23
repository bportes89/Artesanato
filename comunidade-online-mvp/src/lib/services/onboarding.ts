import { apiFetch } from "@/lib/api/http";
export type OnboardingState = { step?: number; completedAt?: string | null; data?: unknown };

function normalizeStep(step: number | string) {
  if (typeof step === "number") return Math.max(0, Math.floor(step));
  const value = step.trim().toLowerCase();
  const map: Record<string, number> = { profile: 0, start: 0, initial: 0, goal: 1, goals: 1 };
  const mapped = map[value];
  if (typeof mapped === "number") return mapped;
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? Math.max(0, Math.floor(asNumber)) : 0;
}

export const onboardingService = {
  get: () => apiFetch<OnboardingState>({ path: "/onboarding" }),
  progress: (payload: { step: number | string; data?: unknown }) =>
    apiFetch({ path: "/onboarding/progress", method: "POST", body: JSON.stringify({ ...payload, step: normalizeStep(payload.step) }), csrf: true }),
  complete: () => apiFetch({ path: "/onboarding/complete", method: "POST", csrf: true }),
};
