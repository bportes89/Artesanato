import { apiFetch } from "@/lib/api/http";
export type Order = { id: string; status: string; totalCents: number; currency: string; createdAt: string; items: Array<{ quantity: number; product: { name: string; type: string } }>; payments: Array<{ status: string; provider: string; createdAt: string }> };
export const purchasesService = { checkout: (priceId: string, provider?: string) => apiFetch<{ checkoutUrl?: string; orderId: string }>({ path: "/purchases/checkout", method: "POST", body: JSON.stringify({ priceId, provider }), csrf: true }) };
