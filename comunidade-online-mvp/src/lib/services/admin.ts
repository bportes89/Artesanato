import { apiFetch } from "@/lib/api/http";

export type AdminMetrics = { users?: number; ordersPaid?: number; ordersPending?: number; posts?: number; downloads?: number; webhooksFailed?: number };
export type PagedResult<T> = { page: number; limit: number; total: number; items: T[] };
export type AdminAnalyticsOverview = {
  days: number;
  since: string;
  kpis: {
    activeUsers: number;
    newUsers: number;
    onboardingCompleted: number;
    onboardingCompletionRate: number;
    ordersPaid: number;
    downloads: number;
    communityPosts: number;
    communityComments: number;
    retentionD1: number;
    retentionD7: number;
  };
  topEvents: Array<{ name: string; count: number }>;
};

export type AdminAnalyticsTimeseries = { metric: string; days: number; since: string; items: Array<{ date: string; value: number }> };
export type AdminAnalyticsFunnel = { name: string; days: number; since: string; steps: Array<{ step: string; users: number }> };

export type AdminUser = { id: string; email: string; name?: string | null; status: string; createdAt: string; roles: Array<{ key: string; name: string }> };
export type AdminCourse = { id: string; title: string; description?: string | null; status: string; visibility: string; publishedAt?: string | null; updatedAt?: string; modulesCount?: number };
export type AdminEbook = { id: string; title: string; description?: string | null; status: string; publishedAt?: string | null; coverFileId?: string | null; fileId?: string | null };
export type AdminOrder = { id: string; status: string; totalCents: number; currency: string; createdAt: string; user: { id: string; email: string; name?: string | null }; items: Array<{ quantity: number; product: { name: string; type: string } }>; payments: Array<{ provider: string; status: string; createdAt: string }> };
export type AdminUpload = { id: string; status: string; filePurpose: string; originalFilename?: string | null; expectedSizeBytes?: string | null; createdAt: string; completedAt?: string | null; user?: { id: string; email: string } | null; file?: { id: string; r2Key: string; mimeType?: string | null; sizeBytes?: string | null } | null };
export type AdminCarouselItem = { id: string; title: string; subtitle?: string | null; ctaLabel?: string | null; ctaUrl?: string | null; status: string; sortOrder: number; publishedAt?: string | null; imageFileId?: string | null; mobileImageFileId?: string | null; backgroundColor?: string | null; updatedAt?: string };

export type AdminSearchUser = { id: string; email: string; name?: string | null; status: string };
export type AdminSearchCourse = { id: string; title: string; status: string };
export type AdminSearchEbook = { id: string; title: string; status: string };
export type AdminSearchOrder = { id: string; status: string; totalCents: number; currency: string; user: { email: string } };
export type AdminSearchPost = { id: string; title: string; status: string; author: { email: string; name?: string | null } };
export type AdminSearchResults = { users: AdminSearchUser[]; courses: AdminSearchCourse[]; ebooks: AdminSearchEbook[]; orders: AdminSearchOrder[]; posts: AdminSearchPost[] };

export const adminClient = {
  metrics: () => apiFetch<AdminMetrics>({ path: "/admin/metrics" }),
  carousel: (params: { page?: number; limit?: number; query?: string; status?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    return apiFetch<PagedResult<AdminCarouselItem>>({ path: `/admin/carousel?${search.toString()}` });
  },
  updateUser: (id: string, payload: { name?: string; status?: string }) => apiFetch({ path: `/admin/users/${id}`, method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  setUserRoles: (id: string, roleKeys: string[]) => apiFetch({ path: `/admin/users/${id}/roles`, method: "POST", body: JSON.stringify({ roleKeys }), csrf: true }),
  createCourse: (payload: { title: string; description?: string; status?: string; visibility?: string; coverFileId?: string }) => apiFetch({ path: "/admin/content/courses", method: "POST", body: JSON.stringify(payload), csrf: true }),
  updateCourse: (id: string, payload: { title: string; description?: string; status?: string; visibility?: string; coverFileId?: string }) => apiFetch({ path: `/admin/content/courses/${id}`, method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  publishCourse: (id: string, published: boolean) => apiFetch({ path: `/admin/content/courses/${id}/publish`, method: "POST", body: JSON.stringify({ published: String(published) }), csrf: true }),
  createEbook: (payload: { title: string; description?: string; status?: string; coverFileId?: string; fileId?: string }) => apiFetch({ path: "/admin/ebooks", method: "POST", body: JSON.stringify(payload), csrf: true }),
  updateEbook: (id: string, payload: { title: string; description?: string; status?: string; coverFileId?: string; fileId?: string }) => apiFetch({ path: `/admin/ebooks/${id}`, method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  publishEbook: (id: string, published: boolean) => apiFetch({ path: `/admin/ebooks/${id}/publish`, method: "POST", body: JSON.stringify({ published: String(published) }), csrf: true }),
  createCarousel: (payload: Partial<AdminCarouselItem> & { title: string }) => apiFetch({ path: "/admin/carousel", method: "POST", body: JSON.stringify(payload), csrf: true }),
  updateCarousel: (id: string, payload: Partial<AdminCarouselItem> & { title: string }) => apiFetch({ path: `/admin/carousel/${id}`, method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  deleteCarousel: (id: string) => apiFetch({ path: `/admin/carousel/${id}`, method: "DELETE", csrf: true }),
};
