import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_request, { params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true, total_amount: true, shippingAddress: true, createdAt: true,
      items: { select: { id: true, quantity: true, price: true, product: { select: { name: true, images: true } } } },
    },
  });
  if (!order) return NextResponse.json({ error: "ไม่พบคำสั่งซื้อนี้" }, { status: 404 });
  return NextResponse.json({ data: order });
}
