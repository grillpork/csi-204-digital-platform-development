import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
import { isValidThaiPhone, phoneDigits } from "@/lib/phone";

const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY;

// Helper to call Omise API
async function callOmiseAPI(endpoint, data) {
  const auth = Buffer.from(`${OMISE_SECRET_KEY}:`).toString("base64");
  const response = await fetch(`https://api.omise.co${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Omise API Error");
  }
  return result;
}

export async function POST(request) {
  try {
    const me = await requireUser();

    const {
      paymentMethod,
      shippingName,
      shippingAddress,
      shippingPhone,
      cardToken,
    } = await request.json();

    if (!shippingName || !shippingAddress || !shippingPhone) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน" },
        { status: 400 }
      );
    }
    if (!isValidThaiPhone(shippingPhone)) {
      return NextResponse.json({ error: "เบอร์โทรศัพท์ต้องอยู่ในรูปแบบ 095-807-2692" }, { status: 400 });
    }

    // 1. ดึงสินค้าในตะกร้าของ User
    const cart = await prisma.cart.findUnique({
      where: { userId: me.id },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "ไม่มีสินค้าในตะกร้า" },
        { status: 400 }
      );
    }

    // 2. ดึงข้อมูล Product เพื่อคำนวณราคาจริงและตรวจสอบ stock
    const productIds = cart.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productsMap = new Map(products.map((p) => [p.id, p]));
    let grandTotal = 0;
    const orderItemsData = [];

    for (const item of cart.items) {
      const product = productsMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `ไม่พบสินค้า ID: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `สินค้า ${product.name} มีสินค้าไม่พอ (เหลือในคลัง ${product.stock} ชิ้น)` },
          { status: 400 }
        );
      }
      grandTotal += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: product.price,
      });
    }

    // 3. เริ่มทำรายการชำระเงินตามช่องทาง
    let omiseChargeId = null;
    let paymentStatus = "UNPAID";
    let orderStatus = "PENDING";
    let qrCodeUrl = null;
    let authorizeUri = null;
    let paymentExpiresAt = null;

    if (paymentMethod === "card") {
      if (!cardToken) {
        return NextResponse.json(
          { error: "ไม่พบข้อมูลบัตรเครดิต (Token)" },
          { status: 400 }
        );
      }

      // หักเงินผ่านบัตรเครดิต
      try {
        const charge = await callOmiseAPI("/charges", {
          amount: grandTotal * 100, // แปลงเป็นสตางค์
          currency: "thb",
          card: cardToken,
          // หากต้องการรองรับ 3D Secure (3DS) ให้ใส่ return_uri ด้วย
          return_uri: `${request.nextUrl.origin}/profile/orders`,
        });

        omiseChargeId = charge.id;
        
        if (charge.status === "successful") {
          paymentStatus = "PAID";
          orderStatus = "PAID";
        } else if (charge.status === "pending" && charge.authorize_uri) {
          // กรณีต้องผ่าน 3D Secure
          authorizeUri = charge.authorize_uri;
        } else {
          return NextResponse.json(
            { error: `การชำระเงินไม่สำเร็จ: ${charge.failure_message || "ปฏิเสธการชำระเงิน"}` },
            { status: 400 }
          );
        }
      } catch (err) {
        return NextResponse.json(
          { error: `Omise Error: ${err.message}` },
          { status: 400 }
        );
      }
    } else if (paymentMethod === "transfer") {
      // สแกนจ่าย PromptPay
      try {
        const charge = await callOmiseAPI("/charges", {
          amount: grandTotal * 100,
          currency: "thb",
          source: {
            type: "promptpay",
          },
        });

        omiseChargeId = charge.id;
        qrCodeUrl = charge.source?.scannable_code?.image?.download_uri || null;
        orderStatus = "PENDING_PAYMENT";
        paymentExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      } catch (err) {
        return NextResponse.json(
          { error: `ไม่สามารถสร้างรายการ PromptPay ได้: ${err.message}` },
          { status: 400 }
        );
      }
    } else if (paymentMethod === "cod") {
      // เก็บเงินปลายทาง ไม่ต้องทำธุรกรรมผ่าน Omise
      paymentStatus = "UNPAID";
      orderStatus = "PENDING";
    } else {
      return NextResponse.json(
        { error: "ช่องทางการชำระเงินไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // 4. สร้าง Order ใน Database (ใช้ transaction เพื่อความปลอดภัย)
    const order = await prisma.$transaction(async (tx) => {
      // ลด stock ของสินค้า
      for (const item of cart.items) {
        const changed = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (changed.count !== 1) throw new HttpError(409, "สินค้าเพิ่งหมดหรือมีจำนวนไม่เพียงพอ กรุณาตรวจสอบตะกร้าอีกครั้ง");
      }

      // สร้างออเดอร์
      const newOrder = await tx.order.create({
        data: {
          userId: me.id,
          status: orderStatus,
          total_amount: grandTotal,
          shippingAddress: `${shippingName}\n${shippingAddress}`,
          phone: phoneDigits(shippingPhone),
          items: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.priceAtOrder,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // หากมีรายการชำระเงินผ่าน Omise ให้บันทึกข้อมูลไว้ด้วย
      if (omiseChargeId) {
        await tx.payments.create({
          data: {
            id: omiseChargeId,
            order_id: newOrder.id,
            amount: grandTotal,
            method: paymentMethod,
            status: paymentMethod === "card" && paymentStatus === "PAID" ? "successful" : "pending",
            qr_code_url: qrCodeUrl,
            expires_at: paymentExpiresAt,
          },
        });
      }

      // ล้างตะกร้าสินค้า
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentStatus: orderStatus === "PAID" ? "PAID" : "UNPAID",
      qrCodeUrl,
      expiresAt: paymentExpiresAt,
      authorizeUri,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/checkout error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ" },
      { status: 500 }
    );
  }
}
