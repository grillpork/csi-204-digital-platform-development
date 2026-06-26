import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

// ด่านแรก (optimistic): หน้า protected ต้องมี cookie token ที่ valid
// ไม่งั้น redirect ไป /login — ด่านจริงอยู่ที่ DAL/route handler ตามคำแนะนำ Next.js
export async function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/cart/:path*", "/checkout/:path*"],
};