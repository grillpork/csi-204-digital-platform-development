import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

export async function GET() {
  try {
    const user = await requireUser();
    const expired = await prisma.order.findMany({
      where: { userId: user.id, status: "PENDING_PAYMENT", payments: { expires_at: { lte: new Date() } } },
      include: { items: true },
    });
    for (const order of expired) {
      await prisma.$transaction(async (tx) => {
        const changed = await tx.order.updateMany({ where: { id: order.id, status: "PENDING_PAYMENT" }, data: { status: "PAYMENT_EXPIRED" } });
        if (changed.count) {
          for (const item of order.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
          await tx.payments.update({ where: { order_id: order.id }, data: { status: "expired" } });
        }
      });
    }
    const orders = await prisma.order.findMany({
      where: { userId: user.id }, orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } }, payments: true },
    });
    return NextResponse.json({ data: orders });
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "ไม่สามารถโหลดคำสั่งซื้อได้" }, { status: 500 });
  }
}
