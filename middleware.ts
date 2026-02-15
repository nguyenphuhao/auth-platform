import { NextRequest, NextResponse } from "next/server";

function getRole(request: NextRequest): string {
  return (
    request.headers.get("x-dev-role") ??
    request.cookies.get("dev_role")?.value ??
    "anonymous"
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const role = getRole(request);

  if (role === "admin") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
