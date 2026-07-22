import { safeServerApiFetch } from "@/lib/api/server";
export type Course = { id: string; title: string; description?: string | null; publishedAt?: string | null; visibility?: string };
export type CurationItem = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  tag?: string | null;
  publishedAt?: string | null;
};
export type CourseDetail = Course & {
  modules: Array<{
    id: string;
    title: string;
    sortOrder: number;
    lessons: Array<{
      id: string;
      title: string;
      type: string;
      sortOrder: number;
      video?: { pandaVideoId?: string | null; durationSec?: number | null } | null;
    }>;
  }>;
};
export const contentService = {
  curation: () => safeServerApiFetch<CurationItem[]>("/content/curation"),
  list: () => safeServerApiFetch<Course[]>("/content/courses"),
  detail: (id: string) => safeServerApiFetch<CourseDetail>(`/content/courses/${id}`),
};

