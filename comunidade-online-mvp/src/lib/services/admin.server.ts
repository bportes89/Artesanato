import { safeServerApiFetch } from "@/lib/api/server";
import type {
  AdminAnalyticsFunnel,
  AdminAnalyticsOverview,
  AdminAnalyticsTimeseries,
  AdminCarouselItem,
  AdminCourse,
  AdminEbook,
  AdminMetrics,
  AdminOrder,
  AdminSearchResults,
  AdminUpload,
  AdminUser,
  PagedResult,
} from "@/lib/services/admin";

export const adminServer = {
  metrics: () => safeServerApiFetch<AdminMetrics>("/admin/metrics"),
  analyticsOverview: (days = 30) => safeServerApiFetch<AdminAnalyticsOverview>(`/admin/analytics/overview?days=${encodeURIComponent(String(days))}`),
  analyticsTimeseries: (metric: string, days = 30) =>
    safeServerApiFetch<AdminAnalyticsTimeseries>(`/admin/analytics/timeseries?metric=${encodeURIComponent(metric)}&days=${encodeURIComponent(String(days))}`),
  analyticsFunnel: (name: string, days = 30) =>
    safeServerApiFetch<AdminAnalyticsFunnel>(`/admin/analytics/funnel?name=${encodeURIComponent(name)}&days=${encodeURIComponent(String(days))}`),
  search: (query: string) => safeServerApiFetch<AdminSearchResults>(`/admin/search?query=${encodeURIComponent(query)}`),
  users: (params: { page?: number; limit?: number; query?: string; status?: string; roleKey?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    if (params.roleKey) search.set("roleKey", params.roleKey);
    return safeServerApiFetch<PagedResult<AdminUser>>(`/admin/users?${search.toString()}`);
  },
  courses: (params: { page?: number; limit?: number; query?: string; status?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    return safeServerApiFetch<PagedResult<AdminCourse>>(`/admin/content/courses?${search.toString()}`);
  },
  ebooks: (params: { page?: number; limit?: number; query?: string; status?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    return safeServerApiFetch<PagedResult<AdminEbook>>(`/admin/ebooks?${search.toString()}`);
  },
  orders: (params: { page?: number; limit?: number; query?: string; status?: string; provider?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    if (params.provider) search.set("provider", params.provider);
    return safeServerApiFetch<PagedResult<AdminOrder>>(`/admin/orders?${search.toString()}`);
  },
  uploads: (params: { page?: number; limit?: number; query?: string; status?: string; purpose?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    if (params.purpose) search.set("purpose", params.purpose);
    return safeServerApiFetch<PagedResult<AdminUpload>>(`/admin/uploads?${search.toString()}`);
  },
  carousel: (params: { page?: number; limit?: number; query?: string; status?: string }) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.query) search.set("query", params.query);
    if (params.status) search.set("status", params.status);
    return safeServerApiFetch<PagedResult<AdminCarouselItem>>(`/admin/carousel?${search.toString()}`);
  },
};
