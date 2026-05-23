import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const loginPath = "/admin/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === loginPath || pathname.startsWith(`${loginPath}/`)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token?.role === "admin") {
    return NextResponse.next();
  }

  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
