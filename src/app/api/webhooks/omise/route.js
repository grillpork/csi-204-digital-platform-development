import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request) {
  try {
    const webhookSecret = process.env.OMISE_WEBHOOK_SECRET;
    if (!webhookSecret || request.headers.get("authorization") !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
    }
    const payload = await request.json();

    console.log("Received Omise Webhook:", payload.key);

    // ตรวจสอบว่าเป็น Event ของการชำระเงินสำเร็จหรือไม่
    if (payload.key === "charge.complete") {
      const charge = payload.data;
      const chargeId = charge.id;
      const status = charge.status;

      if (status === "successful") {
        // ค้นหารายการชำระเงินในระบบของเรา
        const payment = await prisma.payments.findUnique({
          where: { id: chargeId },
        });

        if (payment) {
          const order = await prisma.order.findUnique({ where: { id: payment.order_id }, select: { status: true } });
          if (!order || ["CANCELLED", "PAYMENT_EXPIRED"].includes(order.status)) {
            await prisma.payments.update({ where: { id: chargeId }, data: { status: "paid_after_closed", paid_at: new Date() } });
            console.warn(`Payment ${chargeId} arrived after order ${payment.order_id} was closed; manual refund/review required`);
            return NextResponse.json({ received: true, requiresReview: true });
          }
          // ใช้ transaction เพื่ออัปเดตทั้งตาราง payments และ orders
          await prisma.$transaction([
            prisma.payments.update({
              where: { id: chargeId },
              data: {
                status: "successful",
                paid_at: new Date(),
              },
            }),
            prisma.order.update({
              where: { id: payment.order_id },
              data: {
                status: "PAID",
              },
            }),
          ]);
          console.log(`Order ${payment.order_id} marked as PAID via Omise Webhook`);
        } else {
          console.warn(`Payment ID ${chargeId} not found in our database`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Omise Webhook Error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
