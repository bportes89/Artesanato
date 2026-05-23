"use client";
import { useSessionStore } from "@/lib/stores/session-store";
export function useSession() { return useSessionStore((state) => state.user); }

