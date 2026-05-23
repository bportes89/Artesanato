import { safeServerApiFetch, serverApiFetch } from "@/lib/api/server";
import type { Me } from "@/lib/services/users";
export const usersServerService = { me: () => safeServerApiFetch<Me>("/users/me"), requireMe: () => serverApiFetch<Me>("/users/me") };
