"use client";
import { useEffect, useRef } from "react";
import { videosService } from "@/lib/services/videos";
export function PandaPlayer({ videoId, lessonId }: { videoId: string; lessonId: string }) {
  const watchStartedAt = useRef<number | null>(null);
  useEffect(() => {
    watchStartedAt.current = Date.now();
    return () => {
      if (!watchStartedAt.current) return;
      const secondsWatched = Math.max(5, Math.round((Date.now() - watchStartedAt.current) / 1000));
      void videosService.watchTime(lessonId, { secondsWatched });
    };
  }, [lessonId]);
  return <div className="overflow-hidden rounded-[28px] border border-border/70 bg-black shadow-premium"><iframe title="Player Panda Video" src={`https://player-vz-4b9d89b5-8f1.tv.pandavideo.com.br/embed/?v=${videoId}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full" /></div>;
}

