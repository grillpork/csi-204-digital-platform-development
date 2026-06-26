import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

// อ่าน cookie token แล้ว verify — คืน payload {userId, role} หรือ null ถ้าไม่มี/ไม่ผ่าน
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ด่านจริง: ดึง user เต็มจาก DB ตาม session (null ถ้ายังไม่ได้ login)
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { role: true },
  });
  if (!user) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role?.name };
}