import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/dal';
import { HttpError } from '@/lib/http';

// โหลด cart items แล้ว join product เอง (CartItem ไม่มี relation product ใน schema)
async function loadCartItems(cartId) {
  const items = await prisma.cartItem.findMany({ where: { cartId } });
  if (items.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  return items
    .map((i) => {
      const p = byId.get(i.productId);
      return p
        ? { id: p.id, name: p.name, price: p.price, image: p.images?.[0] ?? null, quantity: i.quantity }
        : null;
    })
    .filter(Boolean);
}

// GET /api/cart — ตะกร้าของ user ที่ login
export async function GET(request) {
  try {
    const me = await requireUser();

    const cart = await prisma.cart.findUnique({
      where: { userId: me.id },
    });
    if (!cart) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json({ data: await loadCartItems(cart.id) });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('GET /api/cart:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/cart — เพิ่มสินค้าเข้าตะกร้า
export async function POST(request) {
  try {
    const me = await requireUser();

    const body = await request.json();
    const productId = Number(body.productId);
    const quantity = parseInt(body.quantity, 10) || 1;
    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({ where: { userId: me.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: me.id } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return NextResponse.json({ data: await loadCartItems(cart.id) }, { status: 201 });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('POST /api/cart:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/cart — ล้างตะกร้าทั้งหมด
export async function DELETE(request) {
  try {
    const me = await requireUser();

    const cart = await prisma.cart.findUnique({ where: { userId: me.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ data: [] });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('DELETE /api/cart:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
