import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const adminToken = request.cookies.get("admin_token")?.value;

  // Jika mencoba mengakses halaman admin (kecuali halaman login) tanpa token
  if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Jika sudah login lalu mencoba buka halaman /admin/login lagi
  if (path === "/admin/login" && adminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
