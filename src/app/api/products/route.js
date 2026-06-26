import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
//ตัวอย่าง api all product
export async function GET(request) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ data: products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
