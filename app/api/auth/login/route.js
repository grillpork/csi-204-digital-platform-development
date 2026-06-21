import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionResponse } from "@/lib/auth/session";

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
  return Response.json({ error: "Invalid email or password" }, { status: 401 });
}


  const isValid = await verifyPassword(password, user.password)
   
  if (!isValid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

return createSessionResponse(user, 200);

}
