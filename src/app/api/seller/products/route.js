import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

// GET /api/seller/products — สินค้าของฉัน (login required)
export async function GET() {
  try {
    const me = await requireUser();
    const products = await prisma.product.findMany({ where: { sellerId: me.id, is_custom: false } });
    return NextResponse.json({ data: products });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("GET /api/seller/products:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
