import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";  
import { cache } from "react";     
import { HttpError } from "@/lib/http"; 


// อ่าน cookie token แล้ว verify — คืน payload{userId, role}
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { role: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
    avatar: user.avatar,
    role: user.role?.name,
    isSeller: user.isSeller
  };
}
// ไว้ตรวจว่าเป็นคนขายไหม ตรวจผ่าน token จำใน cache
export const getSessionUser = cache(async () => {
  const token = (await cookies()).get("token")?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return null;
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true },
  });
});
// ตรวจสิทธิ์และนำไปส่งหน้าที่ควรไป
export async function requireUserPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
// ตรวจสิทธิ์และส่ง error
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new HttpError(401, "Unauthorized");
  return user;
}