import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { retrieveOmiseCharge, verifyOmiseWebhookSignature } from "@/lib/payment/omise-webhook";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.OMISE_WEBHOOK_SECRET;

    const isProd = process.env.NODE_ENV === "production";
    if (isProd && webhookSecret && !verifyOmiseWebhookSignature({
      rawBody,
      signatureHeader: request.headers.get("omise-signature"),
      timestampHeader: request.headers.get("omise-signature-timestamp"),
      secret: webhookSecret,
    })) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Event อื่นไม่เปลี่ยนสถานะออเดอร์ แต่ตอบ 200 เพื่อให้ Omise ไม่ส่งซ้ำ
    if (payload.key !== "charge.complete") {
      return NextResponse.json({ received: true });
    }

    const chargeId = payload.data?.id;
    if (!chargeId) return NextResponse.json({ error: "Missing charge ID" }, { status: 400 });

    const payment = await prisma.payments.findUnique({
      where: { id: chargeId },
      include: { orders: { select: { status: true } } },
    });
    // ไม่เปิดเผยข้อมูลภายใน และตอบรับ event ที่ไม่เกี่ยวข้องกับระบบนี้
    if (!payment) return NextResponse.json({ received: true });

    // ตรวจสถานะกับ Omise API โดยตรง ไม่เชื่อข้อมูลจาก webhook เพียงอย่างเดียว
    const charge = await retrieveOmiseCharge(chargeId);
    const expectedSatang = Math.round(Number(payment.amount) * 100);
    if (charge.status !== "successful" || charge.currency?.toLowerCase() !== "thb" || charge.amount !== expectedSatang) {
      return NextResponse.json({ received: true, verified: false });
    }

    if (["CANCELLED", "PAYMENT_EXPIRED"].includes(payment.orders.status)) {
      await prisma.payments.update({
        where: { id: chargeId },
        data: { status: "paid_after_closed", paid_at: new Date() },
      });
      return NextResponse.json({ received: true, verified: true, requiresReview: true });
    }

    await prisma.$transaction([
      prisma.payments.update({
        where: { id: chargeId },
        data: { status: "successful", paid_at: new Date() },
      }),
      prisma.order.updateMany({
        where: { id: payment.order_id, status: { in: ["PENDING", "PENDING_PAYMENT"] } },
        data: { status: "PAID" },
      }),
    ]);

    return NextResponse.json({ received: true, verified: true });
  } catch (error) {
    console.error("Omise webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
