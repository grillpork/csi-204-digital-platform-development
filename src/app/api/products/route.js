import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { productSchema } from "@/lib/validation/product";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
import { saveImages } from "@/lib/uploads";



//ตัวอย่าง api all product
export async function GET(request) {
  try {
    const products = await prisma.product.findMany({ where: { is_public: true, approvalStatus: 'APPROVED' }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('GET /api/products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const me = await requireUser();

    const form = await req.formData();
    const files = form.getAll("images").filter((f) => typeof f !== "string");
    if (files.length < 1 || files.length > 5) {
      return NextResponse.json({ errors: { images: ["at least 1, at most 5 images"] } }, { status: 400 });
    }
    const body = {
      name: form.get("name"),
      description: form.get("description"),
      price: form.get("price"),
      category: form.get("category"),
      colors: form.getAll("colors"),
      sizes: form.getAll("sizes"),
      stock: form.get("stock"),
    };
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const images = await saveImages(files);
    const product = await prisma.product.create({
      data: { ...result.data, images, sellerId: me.id, is_public: false, approvalStatus: 'PENDING', submittedAt: new Date() },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/products:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
