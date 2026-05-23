import { create } from "zustand";

type SessionUser = { id: string; email: string; name?: string | null; status?: string; createdAt?: string } | null;
type SessionState = { user: SessionUser; hydrated: boolean; setUser: (user: SessionUser) => void; markHydrated: () => void };
export const useSessionStore = create<SessionState>((set) => ({ user: null, hydrated: false, setUser: (user) => set({ user }), markHydrated: () => set({ hydrated: true }) }));

