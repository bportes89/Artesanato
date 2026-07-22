import { create } from "zustand";
import type { Me } from "@/lib/services/users";

type SessionUser = Me | null;
type SessionState = { user: SessionUser; hydrated: boolean; setUser: (user: SessionUser) => void; markHydrated: () => void };
export const useSessionStore = create<SessionState>((set) => ({ user: null, hydrated: false, setUser: (user) => set({ user }), markHydrated: () => set({ hydrated: true }) }));

