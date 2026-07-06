import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

const allowed = new Set(["PENDING", "PENDING_PAYMENT", "PAYMENT_EXPIRED", "PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]);
const fail = (e) => e instanceof HttpError
  ? NextResponse.json({ error: e.message }, { status: e.status })
  : NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });

export async function GET() {
  try {
    await requireAdmin();
    const data = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, items: { include: { product: true } }, payments: true } });
    return NextResponse.json({ data });
  } catch (e) { return fail(e); }
}

const allowedTransitions = {
  PENDING: ["PENDING", "PENDING_PAYMENT", "CANCELLED"],
  PENDING_PAYMENT: ["PENDING_PAYMENT", "PAID", "PAYMENT_EXPIRED", "CANCELLED"],
  PAYMENT_EXPIRED: ["PAYMENT_EXPIRED"],
  PAID: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"],
  PROCESSING: ["PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"],
  SHIPPED: ["SHIPPED", "COMPLETED", "CANCELLED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED"]
};

export async function PATCH(request) {
  try {
    await requireAdmin();
    const { id, status } = await request.json();
    if (!id || !allowed.has(status)) return NextResponse.json({ error: "ข้อมูลสถานะไม่ถูกต้อง" }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });

    const validNextStates = allowedTransitions[order.status];
    if (!validNextStates || !validNextStates.includes(status)) {
      return NextResponse.json({ error: "ไม่สามารถเปลี่ยนสถานะไปยังสถานะที่เลือกได้" }, { status: 400 });
    }

    const data = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json({ data });
  } catch (e) { return fail(e); }
}
