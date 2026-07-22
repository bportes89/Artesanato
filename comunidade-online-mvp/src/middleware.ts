import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicAuthRoutes = new Set(["/login", "/cadastro", "/esqueci-senha", "/redefinir-senha"]);
const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "default";

async function userIsAdmin(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  try {
    const response = await fetch(new URL("/api/users/me", request.url), {
      method: "GET",
      headers: {
        cookie: cookieHeader,
        accept: "application/json",
        "x-tenant-slug": tenantSlug,
      },
      cache: "no-store",
    });

    if (!response.ok) return false;
    const user = (await response.json()) as { roles?: Array<{ key?: string }> };
    return Boolean(user.roles?.some((role) => role.key === "ADMIN"));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/membros") && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/membros") loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }
  if (pathname.startsWith("/membros/admin") && accessToken) {
    const isAdmin = await userIsAdmin(request);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/membros", request.url));
    }
  }
  if (publicAuthRoutes.has(pathname) && accessToken) return NextResponse.redirect(new URL("/membros", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/membros/:path*", "/login", "/cadastro", "/esqueci-senha", "/redefinir-senha"] };

