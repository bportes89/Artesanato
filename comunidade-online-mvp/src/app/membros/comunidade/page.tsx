"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { communityService, type CommunityComment, type CommunityPost, type CommunityPostDetail, type CommunitySpace, type NotificationItem } from "@/lib/services/community";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/hooks/use-upload";
import { useSession } from "@/hooks/use-session";

function formatDate(value?: string | null) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return value;
  }
}

function getPostIdFromNotificationPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const postId = (payload as { postId?: unknown }).postId;
  return typeof postId === "string" ? postId : null;
}

function collectAttachmentKeysFromPost(post: CommunityPostDetail | null) {
  const keys = new Set<string>();
  if (post?.attachment?.r2Key) keys.add(post.attachment.r2Key);
  for (const c of post?.comments ?? []) {
    const stack: CommunityComment[] = [c];
    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      if (current.attachment?.r2Key) keys.add(current.attachment.r2Key);
      for (const reply of current.replies ?? []) stack.push(reply);
    }
  }
  return Array.from(keys);
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function AttachmentPreview(props: { r2Key: string; mimeType?: string | null; url?: string; onNeedUrl: (r2Key: string) => void }) {
  const { r2Key, mimeType, url, onNeedUrl } = props;
  useEffect(() => {
    if (!url) onNeedUrl(r2Key);
  }, [r2Key, url, onNeedUrl]);

  if (mimeType && !mimeType.startsWith("image/")) return null;
  if (!url) return <div className="mt-3 h-40 w-full rounded-[24px] bg-muted" />;
  return <img alt="" src={url} className="mt-3 h-auto w-full rounded-[24px] border border-border/70 object-cover" />;
}

function CommentNode(props: {
  node: CommunityComment;
  depth?: number;
  currentUserId?: string | null;
  signedUrlByKey: Record<string, string>;
  ensureSignedUrl: (r2Key: string) => void;
  onReply: (commentId: string, authorName: string | null | undefined) => void;
  onLike: (commentId: string) => Promise<void>;
  onReport: (commentId: string) => Promise<void>;
  onModerate: (commentId: string, action: string) => Promise<void>;
}) {
  const depth = props.depth ?? 0;
  const leftPad = Math.min(depth * 14, 42);
  const attachment = props.node.attachment?.r2Key ? props.node.attachment : null;

  return (
    <div style={{ paddingLeft: leftPad }} className="space-y-3">
      <div className="rounded-[22px] border border-border/70 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{props.node.author?.name ?? "Membro"}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{props.node.body}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{formatDate(props.node.createdAt)}</p>
          </div>
        </div>

        {attachment?.r2Key ? (
          <AttachmentPreview
            r2Key={attachment.r2Key}
            mimeType={attachment.mimeType}
            url={props.signedUrlByKey[attachment.r2Key]}
            onNeedUrl={props.ensureSignedUrl}
          />
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={props.node.viewerHasLiked ? "secondary" : "outline"}
            onClick={() => void props.onLike(props.node.id)}
          >
            Curtir{typeof props.node.likeCount === "number" ? ` (${props.node.likeCount})` : ""}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => props.onReply(props.node.id, props.node.author?.name)}>
            Responder
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void props.onReport(props.node.id)}>
            Reportar
          </Button>
          {props.currentUserId && props.node.authorId === props.currentUserId ? (
            <Button size="sm" variant="ghost" onClick={() => void props.onModerate(props.node.id, "delete")}>
              Excluir
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => void props.onModerate(props.node.id, "hide")}>
              Ocultar
            </Button>
          )}
        </div>
      </div>

      {(props.node.replies ?? []).length ? (
        <div className="space-y-3">
          {(props.node.replies ?? []).map((reply) => (
            <CommentNode
              key={reply.id}
              node={reply}
              depth={depth + 1}
              currentUserId={props.currentUserId}
              signedUrlByKey={props.signedUrlByKey}
              ensureSignedUrl={props.ensureSignedUrl}
              onReply={props.onReply}
              onLike={props.onLike}
              onReport={props.onReport}
              onModerate={props.onModerate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ComunidadePage() {
  const currentUser = useSession();
  const upload = useFileUpload();

  const [spaces, setSpaces] = useState<CommunitySpace[]>([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spaceId, setSpaceId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"feed" | "meus" | "notifs">("feed");

  const [feedItems, setFeedItems] = useState<CommunityPost[]>([]);
  const [feedCursor, setFeedCursor] = useState<string | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedLoadingMore, setFeedLoadingMore] = useState(false);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const feedSentinelRef = useRef<HTMLDivElement | null>(null);

  const [myStatus, setMyStatus] = useState<"ALL" | "PUBLISHED" | "ARCHIVED">("ALL");
  const [myItems, setMyItems] = useState<CommunityPost[]>([]);
  const [myCursor, setMyCursor] = useState<string | null>(null);
  const [myLoading, setMyLoading] = useState(false);
  const [myLoadingMore, setMyLoadingMore] = useState(false);
  const [myHasMore, setMyHasMore] = useState(true);
  const mySentinelRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<CommunityPostDetail | null>(null);
  const [postDetailLoading, setPostDetailLoading] = useState(false);
  const [postDetailError, setPostDetailError] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [commentFile, setCommentFile] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<{ commentId: string; authorName?: string | null } | null>(null);

  const [signedUrlByKey, setSignedUrlByKey] = useState<Record<string, string>>({});
  const inFlightSignedUrls = useRef(new Set<string>());

  const currentSpace = useMemo(() => spaces.find((space) => space.id === spaceId), [spaces, spaceId]);

  const ensureSignedUrl = (r2Key: string) => {
    if (signedUrlByKey[r2Key]) return;
    if (inFlightSignedUrls.current.has(r2Key)) return;
    inFlightSignedUrls.current.add(r2Key);
    void (async () => {
      try {
        const res = await communityService.signedReadUrl(r2Key);
        if (!res?.url) return;
        setSignedUrlByKey((prev) => ({ ...prev, [r2Key]: res.url }));
      } finally {
        inFlightSignedUrls.current.delete(r2Key);
      }
    })();
  };

  const loadFeed = async (mode: "reset" | "more") => {
    if (!spaceId) return;
    if (mode === "reset") {
      setFeedLoading(true);
      setFeedCursor(null);
      setFeedHasMore(true);
    } else {
      if (feedLoadingMore || !feedHasMore) return;
      setFeedLoadingMore(true);
    }

    try {
      const res = await communityService.feed({ spaceId, cursor: mode === "more" ? feedCursor : null, limit: 20 });
      const next = res?.nextCursor ?? null;
      const items = res?.items ?? [];
      setFeedItems((prev) => (mode === "reset" ? uniqueById(items) : uniqueById([...prev, ...items])));
      setFeedCursor(next);
      setFeedHasMore(Boolean(next));
    } finally {
      setFeedLoading(false);
      setFeedLoadingMore(false);
    }
  };

  const loadMyPosts = async (mode: "reset" | "more") => {
    if (mode === "reset") {
      setMyLoading(true);
      setMyCursor(null);
      setMyHasMore(true);
    } else {
      if (myLoadingMore || !myHasMore) return;
      setMyLoadingMore(true);
    }

    try {
      const res = await communityService.myPosts({ status: myStatus, cursor: mode === "more" ? myCursor : null, limit: 20 });
      const next = res?.nextCursor ?? null;
      const items = res?.items ?? [];
      setMyItems((prev) => (mode === "reset" ? uniqueById(items) : uniqueById([...prev, ...items])));
      setMyCursor(next);
      setMyHasMore(Boolean(next));
    } finally {
      setMyLoading(false);
      setMyLoadingMore(false);
    }
  };

  const openPost = (postId: string) => setSelectedPostId(postId);

  const refreshPostDetail = async (postId: string) => {
    setPostDetailLoading(true);
    setPostDetailError(null);
    try {
      const detail = await communityService.post(postId);
      setPostDetail(detail ?? null);
      for (const key of collectAttachmentKeysFromPost(detail ?? null)) ensureSignedUrl(key);
    } catch {
      setPostDetailError("Não foi possível carregar o post.");
      setPostDetail(null);
    } finally {
      setPostDetailLoading(false);
    }
  };

  const toggleLikePost = async (postId: string) => {
    const prevLiked = feedItems.find((p) => p.id === postId)?.viewerHasLiked ?? false;
    setFeedItems((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, viewerHasLiked: !prevLiked, likeCount: Math.max((p.likeCount ?? 0) + (prevLiked ? -1 : 1), 0) }
          : p,
      ),
    );

    if (selectedPostId === postId) {
      setPostDetail((prev) =>
        prev && prev.id === postId
          ? { ...prev, viewerHasLiked: !prevLiked, likeCount: Math.max((prev.likeCount ?? 0) + (prevLiked ? -1 : 1), 0) }
          : prev,
      );
    }

    try {
      await communityService.react(postId);
    } catch {
      await loadFeed("reset");
      if (selectedPostId === postId) await refreshPostDetail(postId);
    }
  };

  const toggleLikeComment = async (commentId: string) => {
    const mutateTree = (nodes: CommunityComment[]): CommunityComment[] =>
      nodes.map((n) => {
        const liked = Boolean(n.viewerHasLiked);
        if (n.id === commentId) {
          return { ...n, viewerHasLiked: !liked, likeCount: Math.max((n.likeCount ?? 0) + (liked ? -1 : 1), 0) };
        }
        return { ...n, replies: n.replies ? mutateTree(n.replies) : n.replies };
      });

    setPostDetail((prev) => (prev ? { ...prev, comments: mutateTree(prev.comments ?? []) } : prev));
    try {
      await communityService.reactComment(commentId);
    } catch {
      if (selectedPostId) await refreshPostDetail(selectedPostId);
    }
  };

  const reportPost = async (postId: string) => {
    const reason = window.prompt("Motivo do report (ex: spam, assédio, conteúdo impróprio):")?.trim();
    if (!reason) return;
    const details = window.prompt("Detalhes (opcional):")?.trim() || undefined;
    try {
      await communityService.reportPost(postId, { reason, details });
    } catch {
      if (selectedPostId === postId) setPostDetailError("Não foi possível enviar o report.");
      else setPostError("Não foi possível enviar o report.");
    }
  };

  const reportComment = async (commentId: string) => {
    const reason = window.prompt("Motivo do report (ex: spam, assédio, conteúdo impróprio):")?.trim();
    if (!reason) return;
    const details = window.prompt("Detalhes (opcional):")?.trim() || undefined;
    try {
      await communityService.reportComment(commentId, { reason, details });
    } catch {
      setPostDetailError("Não foi possível enviar o report.");
    }
  };

  const moderatePost = async (postId: string, action: string) => {
    const reason = window.prompt("Motivo (opcional):")?.trim() || undefined;
    try {
      await communityService.moderatePost(postId, { action, reason });
      await loadFeed("reset");
      await loadMyPosts("reset");
      if (selectedPostId === postId) await refreshPostDetail(postId);
    } catch {
      if (selectedPostId === postId) setPostDetailError("Ação não permitida ou falhou.");
      else setPostError("Ação não permitida ou falhou.");
    }
  };

  const moderateComment = async (commentId: string, action: string) => {
    const reason = window.prompt("Motivo (opcional):")?.trim() || undefined;
    try {
      await communityService.moderateComment(commentId, { action, reason });
      if (selectedPostId) await refreshPostDetail(selectedPostId);
    } catch {
      setPostDetailError("Ação não permitida ou falhou.");
    }
  };

  const submitNewPost = async () => {
    setPostError(null);
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle) {
      setPostError("Preencha o título do post.");
      return;
    }

    if (!trimmedBody) {
      setPostError("Escreva o conteúdo do post.");
      return;
    }

    let effectiveSpaceId = spaceId;
    if (!effectiveSpaceId) {
      try {
        setSpacesLoading(true);
        const fetchedSpaces = (await communityService.spaces()) ?? [];
        setSpaces(fetchedSpaces);
        effectiveSpaceId = fetchedSpaces[0]?.id ?? "";
        setSpaceId(effectiveSpaceId);
      } catch {
        effectiveSpaceId = "";
      } finally {
        setSpacesLoading(false);
      }
    }

    if (!effectiveSpaceId) {
      setPostError("Nenhum espaço de comunidade disponível. Recarregue a página e tente novamente.");
      return;
    }

    try {
      const attachmentFileId = postFile ? (await upload.mutateAsync({ file: postFile, purpose: "COMMUNITY_ATTACHMENT" })).fileObjectId : null;
      await communityService.create({ spaceId: effectiveSpaceId, title: trimmedTitle, body: trimmedBody, attachmentFileId });
      setTitle("");
      setBody("");
      setPostFile(null);
      await loadFeed("reset");
      await loadMyPosts("reset");
    } catch {
      setPostError("Não foi possível publicar. Tente novamente.");
    }
  };

  const submitComment = async () => {
    if (!selectedPostId) return;
    const trimmed = commentBody.trim();
    if (!trimmed) return;
    setPostDetailError(null);
    try {
      const attachmentFileId = commentFile
        ? (await upload.mutateAsync({ file: commentFile, purpose: "COMMUNITY_ATTACHMENT" })).fileObjectId
        : null;
      await communityService.comment(selectedPostId, { body: trimmed, parentCommentId: replyTo?.commentId ?? null, attachmentFileId });
      setCommentBody("");
      setCommentFile(null);
      setReplyTo(null);
      await refreshPostDetail(selectedPostId);
      await loadFeed("reset");
    } catch {
      setPostDetailError("Não foi possível enviar sua resposta.");
    }
  };

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationsError(null);
    try {
      const items = (await communityService.notifications()) ?? [];
      setNotifications(items);
    } catch {
      setNotificationsError("Não foi possível carregar notificações.");
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      setSpacesLoading(true);
      try {
        const fetchedSpaces = (await communityService.spaces()) ?? [];
        setSpaces(fetchedSpaces);
        const firstSpace = fetchedSpaces[0]?.id ?? "";
        setSpaceId(firstSpace);
        if (!fetchedSpaces.length) {
          setPostError("Nenhum espaço de comunidade disponível. Recarregue a página.");
        }
      } catch {
        setPostError("Não foi possível carregar os espaços da comunidade.");
      } finally {
        setSpacesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!spaceId) return;
    void loadFeed("reset");
  }, [spaceId]);

  useEffect(() => {
    if (activeTab !== "meus") return;
    void loadMyPosts("reset");
  }, [activeTab, myStatus]);

  useEffect(() => {
    if (activeTab !== "notifs") return;
    void loadNotifications();
  }, [activeTab]);

  useEffect(() => {
    if (!selectedPostId) return;
    void refreshPostDetail(selectedPostId);
  }, [selectedPostId]);

  useEffect(() => {
    const el = feedSentinelRef.current;
    if (!el) return;
    if (!feedHasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadFeed("more");
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [feedHasMore, feedCursor, feedLoadingMore, spaceId]);

  useEffect(() => {
    const el = mySentinelRef.current;
    if (!el) return;
    if (!myHasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadMyPosts("more");
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [myHasMore, myCursor, myLoadingMore, myStatus, activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comunidade"
        title="Conversas, trocas e apoio"
        description="Publique insights, dúvidas e aprendizados. Responda, curta, reporte e acompanhe notificações."
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value === "feed" || value === "meus" || value === "notifs") setActiveTab(value);
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="meus">Meus posts</TabsTrigger>
            <TabsTrigger value="notifs">Notificações</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            {spacesLoading ? <p className="text-sm text-muted-foreground">Carregando espaços...</p> : null}
            {!spacesLoading
              ? spaces.map((space) => (
                  <button
                    key={space.id}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm ${spaceId === space.id ? "border-primary bg-primary/5 text-primary" : "border-border/70"}`}
                    onClick={() => setSpaceId(space.id)}
                  >
                    {space.name}
                  </button>
                ))
              : null}
          </div>
        </div>

        <TabsContent value="feed" className="mt-4">
          <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
            <Card>
              <CardHeader>
                <CardTitle>Novo post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Título do post" value={title} onChange={(event) => setTitle(event.target.value)} />
                <Textarea
                  placeholder="Compartilhe uma conquista, dúvida ou reflexão"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                />
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setPostFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">Imagem opcional (upload rápido, otimizado para mobile).</p>
                </div>
                {postError ? <p className="text-sm text-red-600">{postError}</p> : null}
                <Button className="w-full" disabled={upload.isPending} onClick={() => void submitNewPost()}>
                  {upload.isPending ? "Enviando..." : "Publicar"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{currentSpace?.name ?? "Feed da comunidade"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}

                {feedItems.length ? (
                  feedItems.map((post) => {
                    const attachment = post.attachment?.r2Key ? post.attachment : null;
                    const canArchive = Boolean(currentUser?.id && post.author?.id && currentUser.id === post.author.id);
                    return (
                      <div key={post.id} className="rounded-[24px] border border-border/70 px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{post.title}</p>
                            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{post.body}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {post.pinnedAt ? <Badge variant="accent">Fixado</Badge> : null}
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                {post.author?.name ?? "Fernanda Sklovsky"} • {post.space?.name ?? currentSpace?.name ?? "Espaço"}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>

                        {attachment?.r2Key ? (
                          <AttachmentPreview
                            r2Key={attachment.r2Key}
                            mimeType={attachment.mimeType}
                            url={signedUrlByKey[attachment.r2Key]}
                            onNeedUrl={ensureSignedUrl}
                          />
                        ) : null}

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant={post.viewerHasLiked ? "secondary" : "outline"}
                            onClick={() => void toggleLikePost(post.id)}
                          >
                            Curtir{typeof post.likeCount === "number" ? ` (${post.likeCount})` : ""}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openPost(post.id)}>
                            Ver respostas{typeof post.commentCount === "number" ? ` (${post.commentCount})` : ""}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => void reportPost(post.id)}>
                            Reportar
                          </Button>
                          {canArchive ? (
                            <Button size="sm" variant="ghost" onClick={() => void moderatePost(post.id, "archive")}>
                              Arquivar
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : feedLoading ? null : (
                  <p className="text-sm text-muted-foreground">Ainda não há posts neste espaço.</p>
                )}

                <div ref={feedSentinelRef} />
                {feedLoadingMore ? <p className="text-sm text-muted-foreground">Carregando mais...</p> : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meus" className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Meus posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant={myStatus === "ALL" ? "secondary" : "outline"} onClick={() => setMyStatus("ALL")}>
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant={myStatus === "PUBLISHED" ? "secondary" : "outline"}
                    onClick={() => setMyStatus("PUBLISHED")}
                  >
                    Publicados
                  </Button>
                  <Button
                    size="sm"
                    variant={myStatus === "ARCHIVED" ? "secondary" : "outline"}
                    onClick={() => setMyStatus("ARCHIVED")}
                  >
                    Arquivados
                  </Button>
                </div>

                {myLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
                {myItems.length ? (
                  <div className="space-y-3">
                    {myItems.map((post) => (
                      <div key={post.id} className="rounded-[24px] border border-border/70 px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{post.title}</p>
                            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{post.body}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {post.status && post.status !== "PUBLISHED" ? <Badge variant="outline">{post.status}</Badge> : null}
                              {post.pinnedAt ? <Badge variant="accent">Fixado</Badge> : null}
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{post.space?.name ?? "Espaço"}</p>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{formatDate(post.createdAt)}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openPost(post.id)}>
                            Abrir
                          </Button>
                          {post.status === "ARCHIVED" ? (
                            <Button size="sm" variant="ghost" onClick={() => void moderatePost(post.id, "unarchive")}>
                              Desarquivar
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => void moderatePost(post.id, "archive")}>
                              Arquivar
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => void moderatePost(post.id, "pin")}>
                            Fixar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => void moderatePost(post.id, "unpin")}>
                            Desafixar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myLoading ? null : (
                  <p className="text-sm text-muted-foreground">Você ainda não publicou nenhum post.</p>
                )}

                <div ref={mySentinelRef} />
                {myLoadingMore ? <p className="text-sm text-muted-foreground">Carregando mais...</p> : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationsLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
              {notificationsError ? <p className="text-sm text-red-600">{notificationsError}</p> : null}
              {notifications.length ? (
                <div className="space-y-3">
                  {notifications.map((n) => {
                    const postId = getPostIdFromNotificationPayload(n.payload);
                    return (
                      <div key={n.id} className="rounded-[24px] border border-border/70 px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold">{n.title ?? "Notificação"}</p>
                            {n.body ? <p className="mt-2 text-sm text-muted-foreground">{n.body}</p> : null}
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {n.readAt ? <Badge variant="outline">Lida</Badge> : <Badge variant="default">Nova</Badge>}
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(n.createdAt)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {!n.readAt ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await communityService.markNotificationRead(n.id);
                                await loadNotifications();
                              }}
                            >
                              Marcar como lida
                            </Button>
                          ) : null}
                          {postId ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setActiveTab("feed");
                                openPost(postId);
                              }}
                            >
                              Abrir post
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : notificationsLoading ? null : (
                <p className="text-sm text-muted-foreground">Você não tem notificações por enquanto.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog.Root open={Boolean(selectedPostId)} onOpenChange={(open) => (open ? null : setSelectedPostId(null))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[calc(100%-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-border bg-background p-5 shadow-premium">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Dialog.Title className="truncate text-lg font-semibold">{postDetail?.title ?? "Post"}</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  {postDetail?.author?.name ?? "Membro"} • {formatDate(postDetail?.createdAt)}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button size="icon" variant="ghost" aria-label="Fechar">
                  ✕
                </Button>
              </Dialog.Close>
            </div>

            <div className="mt-4 space-y-4">
              {postDetailLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}
              {postDetailError ? <p className="text-sm text-red-600">{postDetailError}</p> : null}

              {postDetail ? (
                <div className="rounded-[24px] border border-border/70 px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{postDetail.body}</p>
                  {postDetail.attachment?.r2Key ? (
                    <AttachmentPreview
                      r2Key={postDetail.attachment.r2Key}
                      mimeType={postDetail.attachment.mimeType}
                      url={signedUrlByKey[postDetail.attachment.r2Key]}
                      onNeedUrl={ensureSignedUrl}
                    />
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant={postDetail.viewerHasLiked ? "secondary" : "outline"}
                      onClick={() => void toggleLikePost(postDetail.id)}
                    >
                      Curtir{typeof postDetail.likeCount === "number" ? ` (${postDetail.likeCount})` : ""}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => void reportPost(postDetail.id)}>
                      Reportar
                    </Button>
                    {currentUser?.id && postDetail.author?.id === currentUser.id ? (
                      postDetail.status === "ARCHIVED" ? (
                        <Button size="sm" variant="ghost" onClick={() => void moderatePost(postDetail.id, "unarchive")}>
                          Desarquivar
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => void moderatePost(postDetail.id, "archive")}>
                          Arquivar
                        </Button>
                      )
                    ) : null}
                    <Button size="sm" variant="ghost" onClick={() => void moderatePost(postDetail.id, "hide")}>
                      Ocultar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => void moderatePost(postDetail.id, "pin")}>
                      Fixar
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <p className="text-sm font-semibold">Respostas</p>
                {(postDetail?.comments ?? []).length ? (
                  <div className="space-y-4">
                    {(postDetail?.comments ?? []).map((c) => (
                      <CommentNode
                        key={c.id}
                        node={c}
                        currentUserId={currentUser?.id ?? null}
                        signedUrlByKey={signedUrlByKey}
                        ensureSignedUrl={ensureSignedUrl}
                        onReply={(commentId, authorName) => setReplyTo({ commentId, authorName })}
                        onLike={toggleLikeComment}
                        onReport={reportComment}
                        onModerate={moderateComment}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Ainda não há respostas.</p>
                )}
              </div>

              <div className="rounded-[24px] border border-border/70 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{replyTo ? `Respondendo a ${replyTo.authorName ?? "comentário"}` : "Nova resposta"}</p>
                  {replyTo ? (
                    <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                      Cancelar
                    </Button>
                  ) : null}
                </div>
                <Textarea
                  className="mt-3"
                  placeholder="Escreva sua resposta..."
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                />
                <div className="mt-3 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setCommentFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">Imagem opcional.</p>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCommentBody("")}>
                    Limpar
                  </Button>
                  <Button size="sm" disabled={upload.isPending} onClick={() => void submitComment()}>
                    {upload.isPending ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
