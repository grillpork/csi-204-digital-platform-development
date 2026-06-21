import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
//ตัวอย่าง api product By id
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
