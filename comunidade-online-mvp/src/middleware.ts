import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicAuthRoutes = new Set(["/login", "/cadastro", "/esqueci-senha", "/redefinir-senha"]);
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/membros") && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/membros") loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }
  if (publicAuthRoutes.has(pathname) && accessToken) return NextResponse.redirect(new URL("/membros", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/membros/:path*", "/login", "/cadastro", "/esqueci-senha", "/redefinir-senha"] };

