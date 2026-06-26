import { isSameOrigin } from "@/lib/auth/csrf";

// logout: ล้าง cookie token (Max-Age=0) — JWT เป็น stateless ฝั่ง server แค่สั่งลบ cookie
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  const response = Response.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );
  return response;
}