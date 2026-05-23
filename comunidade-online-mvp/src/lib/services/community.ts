import { apiFetch } from "@/lib/api/http";
export type CommunitySpace = { id: string; name: string; description?: string | null; myRole?: "MEMBER" | "MODERATOR" | "ADMIN" | null };
export type CommunityAttachment = { r2Key: string; mimeType?: string | null } | null;
export type CommunityAuthor = { id: string; name?: string | null };
export type CommunityPost = {
  id: string;
  spaceId: string;
  title: string;
  body: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  pinnedAt?: string | null;
  attachmentFileId?: string | null;
  attachment?: CommunityAttachment;
  author?: CommunityAuthor;
  space?: { id: string; name: string };
  likeCount?: number;
  commentCount?: number;
  viewerHasLiked?: boolean;
};

export type CommunityComment = {
  id: string;
  body: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  parentCommentId?: string | null;
  attachmentFileId?: string | null;
  attachment?: CommunityAttachment;
  authorId?: string;
  author?: CommunityAuthor;
  likeCount?: number;
  viewerHasLiked?: boolean;
  replies?: CommunityComment[];
};

export type CommunityFeedResponse = { items: CommunityPost[]; nextCursor: string | null };
export type CommunityPostDetail = {
  id: string;
  spaceId: string;
  title: string;
  body: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  pinnedAt?: string | null;
  attachmentFileId?: string | null;
  attachment?: CommunityAttachment;
  author?: CommunityAuthor;
  likeCount?: number;
  viewerHasLiked?: boolean;
  comments?: CommunityComment[];
};

export type NotificationItem = {
  id: string;
  type: string;
  title?: string | null;
  body?: string | null;
  payload?: unknown;
  status: string;
  createdAt: string;
  readAt?: string | null;
};

export const communityService = {
  spaces: () => apiFetch<CommunitySpace[]>({ path: "/community/spaces" }),
  feed: (params?: { spaceId?: string; cursor?: string | null; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.spaceId) query.set("spaceId", params.spaceId);
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit) query.set("limit", String(params.limit));
    return apiFetch<CommunityFeedResponse>({ path: `/community/feed?${query.toString()}` });
  },
  myPosts: (params?: { status?: string; cursor?: string | null; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.cursor) query.set("cursor", params.cursor);
    if (params?.limit) query.set("limit", String(params.limit));
    return apiFetch<CommunityFeedResponse>({ path: `/community/my/posts?${query.toString()}` });
  },
  listPosts: (spaceId: string, page = 1, limit = 20) =>
    apiFetch<{ items: CommunityPost[]; total: number; page: number; limit: number }>({ path: `/community/spaces/${spaceId}/posts?page=${page}&limit=${limit}` }),
  post: (postId: string) => apiFetch<CommunityPostDetail>({ path: `/community/posts/${postId}` }),
  create: (payload: { spaceId: string; title: string; body: string; attachmentFileId?: string | null }) =>
    apiFetch<CommunityPostDetail>({ path: "/community/posts", method: "POST", body: JSON.stringify(payload), csrf: true }),
  comment: (postId: string, payload: { body: string; parentCommentId?: string | null; attachmentFileId?: string | null }) =>
    apiFetch<{ ok: true; id: string }>({ path: `/community/posts/${postId}/comments`, method: "POST", body: JSON.stringify(payload), csrf: true }),
  react: (postId: string) => apiFetch<{ reacted: boolean }>({ path: `/community/posts/${postId}/react`, method: "POST", body: JSON.stringify({ kind: "LIKE" }), csrf: true }),
  reactComment: (commentId: string) =>
    apiFetch<{ reacted: boolean }>({ path: `/community/comments/${commentId}/react`, method: "POST", body: JSON.stringify({ kind: "LIKE" }), csrf: true }),
  reportPost: (postId: string, payload: { reason: string; details?: string }) =>
    apiFetch<{ ok: true }>({ path: `/community/posts/${postId}/report`, method: "POST", body: JSON.stringify(payload), csrf: true }),
  reportComment: (commentId: string, payload: { reason: string; details?: string }) =>
    apiFetch<{ ok: true }>({ path: `/community/comments/${commentId}/report`, method: "POST", body: JSON.stringify(payload), csrf: true }),
  moderatePost: (postId: string, payload: { action: string; reason?: string }) =>
    apiFetch({ path: `/community/posts/${postId}/moderate`, method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  moderateComment: (commentId: string, payload: { action: string; reason?: string }) =>
    apiFetch({ path: `/community/comments/${commentId}/moderate`, method: "PATCH", body: JSON.stringify(payload), csrf: true }),
  signedReadUrl: (r2Key: string) => apiFetch<{ url: string }>({ path: `/uploads/signed-read?r2Key=${encodeURIComponent(r2Key)}` }),
  notifications: () => apiFetch<NotificationItem[]>({ path: "/notifications" }),
  markNotificationRead: (notificationId: string) =>
    apiFetch({ path: "/notifications/read", method: "POST", body: JSON.stringify({ notificationId }), csrf: true }),
};
