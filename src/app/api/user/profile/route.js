import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ user });
}

export async function PATCH(request) {
 try {
  const me = await requireUser();
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "ข้อมูลคำขอไม่ถูกต้อง" }, { status: 400 });
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim() || null;
  const address = String(body.address || "").trim() || null;
  const bio = String(body.bio || "").trim().slice(0, 500) || null;
  if (name.length < 2 || name.length > 100) return Response.json({ error: "กรุณากรอกชื่อ 2–100 ตัวอักษร" }, { status: 400 });
  const normalizedPhone = phone?.replace(/[-\s]/g, "") || null;
  if (normalizedPhone && !/^0\d{9}$/.test(normalizedPhone)) return Response.json({ error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0" }, { status: 400 });
  const user = await prisma.user.update({ where: { id: me.id }, data: { name, phone: normalizedPhone, address, bio }, include: { role: true } });
  return Response.json({ user: { id:user.id,name:user.name,email:user.email,phone:user.phone,address:user.address,bio:user.bio,avatarUrl:user.avatarUrl,role:user.role?.name } });
 } catch (error) {
  if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status });
  console.error("PATCH /api/user/profile", error);
  return Response.json({ error: "ไม่สามารถบันทึกโปรไฟล์ได้ กรุณาลองใหม่" }, { status: 500 });
 }
}
