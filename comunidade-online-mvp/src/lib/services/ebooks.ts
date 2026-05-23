import { apiFetch } from "@/lib/api/http";
import { safeServerApiFetch } from "@/lib/api/server";
export type Ebook = { id: string; title: string; description?: string | null; publishedAt?: string | null; coverFileId?: string | null };
export type LibraryItem = { grantedAt: string; ebook: Ebook };
export const ebooksService = { list: () => safeServerApiFetch<Ebook[]>("/ebooks"), my: () => safeServerApiFetch<LibraryItem[]>("/ebooks/me"), download: (id: string) => apiFetch<{ url: string }>({ path: `/ebooks/${id}/download` }) };

