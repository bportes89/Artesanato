import { safeServerApiFetch } from "@/lib/api/server";
export type Course = { id: string; title: string; description?: string | null; publishedAt?: string | null; visibility?: string };
export type CourseDetail = Course & { modules: Array<{ id: string; title: string; sortOrder: number; lessons: Array<{ id: string; title: string; type: string; sortOrder: number }> }> };
export const contentService = { list: () => safeServerApiFetch<Course[]>("/content/courses"), detail: (id: string) => safeServerApiFetch<CourseDetail>(`/content/courses/${id}`) };

