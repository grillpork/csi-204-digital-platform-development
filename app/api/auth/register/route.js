import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSessionResponse } from "@/lib/auth/session";
import { Prisma } from "@prisma/client";


export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json(
     { error: "name, email, and password are required" },
     { status: 400 }, 
    )
  }

  const hashedPassword = await hashPassword(password);
  let user;
  try {
    user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "Email already registered" }, { status: 409 });
    }
    throw error;
  }

  return createSessionResponse(user, 201);
  
}