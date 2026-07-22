"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSessionStore } from "@/lib/stores/session-store";
import { analyticsService } from "@/lib/services/analytics";
import type { Me } from "@/lib/services/users";

type ProvidersProps = { children: React.ReactNode; user?: Me | null };

function AnalyticsTracker() {
  const user = useSessionStore((state) => state.user);
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = pathname || "/";
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;
    void analyticsService
      .trackPageview({ path, title: typeof document !== "undefined" ? document.title : undefined, authenticated: Boolean(user?.id) })
      .catch(() => undefined);
    if (path === "/membros") {
      void analyticsService.trackEvent({ name: "engagement.member_home_viewed", authenticated: Boolean(user?.id) }).catch(() => undefined);
    }
  }, [pathname, user?.id]);

  return null;
}

export function Providers({ children, user }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } } }));
  const setUser = useSessionStore((state) => state.setUser);
  const hydrated = useSessionStore((state) => state.hydrated);
  const markHydrated = useSessionStore((state) => state.markHydrated);
  if (!hydrated) { setUser(user ?? null); markHydrated(); }
  return <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}><QueryClientProvider client={queryClient}><AnalyticsTracker />{children}<ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider></ThemeProvider>;
}
