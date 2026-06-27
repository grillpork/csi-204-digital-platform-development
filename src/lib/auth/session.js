import { signToken } from "@/lib/auth/jwt";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 วัน ตรงกับอายุ JWT ที่ตั้งไว้

export async function createSessionResponse(user, status) {
  const token = await signToken({ userId: user.id, role: user.role?.name });

  const response = Response.json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role?.name } },
    { status },
  );

  response.headers.set(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  );

  return response;
}
