import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  const isProtectedPath = 
    pathname.startsWith("/account") || 
    pathname.startsWith("/cart") || 
    pathname.startsWith("/checkout") || 
    pathname.startsWith("/seller") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard");

  if (pathname.startsWith("/dashboard") && payload?.role !== "admin") {
    return NextResponse.redirect(new URL(payload ? "/" : "/login", request.url));
  }

  if (!payload) {
    if (isProtectedPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/account/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/seller/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
};
