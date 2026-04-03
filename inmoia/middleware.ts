import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/recuperar-password"];

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => /sb-.*-auth-token/.test(cookie.name));
}

function isSuperAdmin(request: NextRequest): boolean {
  const role = request.cookies.get("inmoia_role")?.value;
  const email = request.cookies.get("inmoia_email")?.value;

  return role === "super_admin" || email === process.env.SUPER_ADMIN_EMAIL;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && !isAuthenticated(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isSuperAdmin(request)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/registro", "/recuperar-password", "/"],
};
