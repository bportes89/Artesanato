import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { appConfig, apiUrl } from "@/lib/config";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();

  const response = await fetch(apiUrl(`/ebooks/${id}/download`), {
    headers: {
      accept: "application/json",
      cookie: cookieStore.toString(),
      "x-tenant-slug": appConfig.tenantSlug,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Nao foi possivel liberar o download." }, { status: response.status });
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) {
    return NextResponse.json({ message: "Arquivo indisponivel." }, { status: 404 });
  }

  return NextResponse.redirect(payload.url);
}
