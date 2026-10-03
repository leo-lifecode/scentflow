import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "scentflow_access_token";
const REFRESH_COOKIE = "scentflow_refresh_token";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  if (path.startsWith("/admin") && path !== "/admin/login" && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (path.startsWith("/checkout") && !hasSession) {
    return NextResponse.redirect(new URL("/login?redirect=/checkout", request.url));
  }

  if (path.startsWith("/orders") && !hasSession) {
    return NextResponse.redirect(new URL("/login?redirect=/orders", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*"],
};
