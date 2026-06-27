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

// DELETE /api/cart/:productId — เอาสินค้าชิ้นนี้ออกจากตะกร้า
export async function DELETE(request, { params }) {
  try {
    const me = await requireUser();
    const { productId: rawProductId } = await params;
    const productId = Number(rawProductId);
    if (!Number.isInteger(productId)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: me.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    }

    const items = cart ? await loadCartItems(cart.id) : [];
    return NextResponse.json({ data: items });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('DELETE /api/cart/[productId]:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
