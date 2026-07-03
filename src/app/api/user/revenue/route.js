import { prisma } from "@/lib/db/prisma";
import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/auth/dal";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED']
          }
        },
        product: {
          sellerId: user.id
        }
      },
      include: {
        product: true,
        order: true
      }
    });

    let totalItemsSold = 0;
    let grossRevenue = 0;

    const productSales = {};

    for (const item of orderItems) {
      const pId = item.product.id;
      if (!productSales[pId]) {
        productSales[pId] = {
          id: pId,
          name: item.product.name,
          image: item.product.images?.[0] || null,
          itemsSold: 0,
          grossRevenue: 0,
          designerRevenue: 0
        };
      }

      productSales[pId].itemsSold += item.quantity;
      const totalSale = item.quantity * item.price;
      productSales[pId].grossRevenue += totalSale;
      productSales[pId].designerRevenue += totalSale * 0.20;

      totalItemsSold += item.quantity;
      grossRevenue += totalSale;
    }

    const data = {
      totalItemsSold,
      grossRevenue,
      designerRevenue: grossRevenue * 0.20,
      products: Object.values(productSales)
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('User Revenue Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch revenue' }, { status: 500 });
  }
}
