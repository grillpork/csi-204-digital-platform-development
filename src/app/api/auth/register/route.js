import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSessionResponse } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";
import { isSameOrigin } from "@/lib/auth/csrf";
import { Prisma } from "@prisma/client";

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const hashedPassword = await hashPassword(password);
  let user;
  try {
    user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      include: { role: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }
    throw error;
  }

  return createSessionResponse(user, 201);
  
}