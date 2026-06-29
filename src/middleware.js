import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  const isAuthPath = pathname === "/login" || pathname === "/register";
  
  const isProtectedPath = 
    pathname.startsWith("/account") || 
    pathname.startsWith("/cart") || 
    pathname.startsWith("/checkout") || 
    pathname.startsWith("/seller");

  if (payload) {
    if (isAuthPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
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
  ],
};
