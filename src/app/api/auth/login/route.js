import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionResponse } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";
import { isSameOrigin } from "@/lib/auth/csrf";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  return createSessionResponse(user, 200);
}