import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { productSchema } from '@/lib/validation/product';
import { requireUser } from '@/lib/auth/dal';
import { HttpError } from '@/lib/http';
import { saveImages } from '@/lib/uploads';

// GET /api/products/:id — public, รายละเอียดสินค้า 1 ตัว (รวม images)
export async function GET(request, { params }) {
  const { id } = await params;
  const productId = Number(id); // URL ส่ง string มา แต่ Product.id เป็น Int
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('GET /api/products/[id]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/products/:id — seller แก้สินค้าตัวเอง (login + เจ้าของ)
export async function PATCH(request, { params }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const me = await requireUser(); // 401 ถ้าไม่ login

    const form = await request.formData();
    const files = form.getAll('images').filter((f) => typeof f !== 'string');
    if (files.length > 5) {
      return NextResponse.json({ errors: { images: ['at most 5 images'] } }, { status: 400 });
    }
    // Save original transparent overlay file if uploaded during update
    let overlayImagePath = undefined;
    const overlayFile = form.get("overlayFile");
    if (overlayFile && typeof overlayFile !== "string") {
      const savedPaths = await saveImages([overlayFile]);
      if (savedPaths.length > 0) {
        overlayImagePath = savedPaths[0];
      }
    }

    const body = {
      name: form.get('name'),
      description: form.get('description'),
      price: form.get('price'),
      category: form.get('category'),
      colors: form.getAll('colors'),
      sizes: form.getAll('sizes'),
      stock: form.get('stock'),
      isCustom: form.get("isCustom"),
      baseProductId: form.get("baseProductId"),
      overlayImage: overlayImagePath || form.get("overlayImage"),
      overlayPositionX: form.get("overlayPositionX"),
      overlayPositionY: form.get("overlayPositionY"),
      overlaySize: form.get("overlaySize"),
      printSide: form.get("printSide"),
      screenSize: form.get("screenSize"),
      printTechnique: form.get("printTechnique"),
      isPublic: form.get("isPublic"),
    };
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
    }

    // 0 ไฟล์ = เก็บรูปเดิมไว้ (ไม่แตะ images); 1–5 ไฟล์ = อัปโหลดแล้วเปลี่ยนรูป
    const images = files.length > 0 ? await saveImages(files) : undefined;
    const product = await prisma.product.update({
      where: { id_sellerId: { id: productId, sellerId: me.id } }, // E: ownership ฝังใน where
      data: { ...result.data, ...(images && { images }) },
    });
    return NextResponse.json({ data: product });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err.code === 'P2025') {
      // ไม่เจอ หรือไม่ใช่ของเรา → 404 (ไม่บอกใบ้ว่าสินค้าคนอื่นมีอยู่)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('PATCH /api/products/[id]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/products/:id — seller ลบสินค้าตัวเอง (login + เจ้าของ)
export async function DELETE(request, { params }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const me = await requireUser();

    await prisma.product.delete({
      where: { id_sellerId: { id: productId, sellerId: me.id } },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('DELETE /api/products/[id]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}