import { apiFetch } from "@/lib/api/http";
export type Playback = { pandaVideoId: string };
export type ProgressPayload = { positionSec?: number; progressPercent?: number; completed?: boolean };
export type WatchTimePayload = { secondsWatched: number; positionSec?: number };
export const videosService = {
  playback: (lessonId: string) => apiFetch<Playback>({ path: `/videos/lessons/${lessonId}/playback` }),
  progress: (lessonId: string, payload: ProgressPayload) => apiFetch({ path: `/videos/lessons/${lessonId}/progress`, method: "POST", body: JSON.stringify(payload), csrf: true }),
  watchTime: (lessonId: string, payload: WatchTimePayload) => apiFetch({ path: `/videos/lessons/${lessonId}/watch-time`, method: "POST", body: JSON.stringify(payload), csrf: true }),
  pandaInitUpload: (lessonId: string, payload: { filename: string; contentType: string; sizeBytes: number; folderId?: string }) => apiFetch<{ pandaVideoId: string; uploadUrl: string; tus: { resumable: string; patchHeaders: Record<string, string> } }>({ path: `/videos/lessons/${lessonId}/panda/init-upload`, method: "POST", body: JSON.stringify(payload), csrf: true }),
  pandaLink: (lessonId: string, payload: { pandaVideoId: string; durationSec?: number; metadata?: unknown }) => apiFetch({ path: `/videos/lessons/${lessonId}/panda/link`, method: "POST", body: JSON.stringify(payload), csrf: true }),
};

