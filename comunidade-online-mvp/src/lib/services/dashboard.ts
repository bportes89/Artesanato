import { safeServerApiFetch } from "@/lib/api/server";
export type DashboardData = { onboarding?: { step?: string; completedAt?: string | null } | null; continueWatching: Array<{ lessonId: string; progressPercent: number; lastPositionSec: number; updatedAt: string; lesson: { id: string; title: string; module: { courseId: string; course: { title: string } }; video?: { pandaVideoId?: string; durationSec?: number | null } | null } }>; stats: { ebooksCount: number; postsCount: number } };
export const dashboardService = { get: () => safeServerApiFetch<DashboardData>("/dashboard") };

