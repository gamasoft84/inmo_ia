import { NextRequest, NextResponse } from "next/server";

const PUBLIC_EXACT_PATHS = [
  "/",
  "/login",
  "/registro",
  "/recuperar-password",
  "/terminos",
  "/privacidad",
  "/aviso-lfpdppp",
];

const PUBLIC_PREFIX_PATHS = ["/p/"];

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

  const isPublicPath = PUBLIC_EXACT_PATHS.includes(pathname)
    || PUBLIC_PREFIX_PATHS.some((prefix) => pathname.startsWith(prefix));

  if (isPublicPath || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!isAuthenticated(request)) {
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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*\\.js|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)",
  ],
};
