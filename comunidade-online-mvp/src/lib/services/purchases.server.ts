import { safeServerApiFetch } from "@/lib/api/server";
import type { Order } from "@/lib/services/purchases";
export const purchasesServerService = { list: () => safeServerApiFetch<Order[]>("/purchases/me") };
