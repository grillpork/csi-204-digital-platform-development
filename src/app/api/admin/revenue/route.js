import { prisma } from "@/lib/db/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED']
          }
        }
      },
      include: {
        product: {
          include: {
            seller: true
          }
        }
      }
    });

    const revenueBySeller = {};

    for (const item of orderItems) {
      const seller = item.product.seller;
      if (!seller) continue;

      if (!revenueBySeller[seller.id]) {
        revenueBySeller[seller.id] = {
          sellerId: seller.id,
          name: seller.name,
          email: seller.email,
          shopName: seller.shopName || seller.name,
          itemsSold: 0,
          grossRevenue: 0,
          designerRevenue: 0
        };
      }

      revenueBySeller[seller.id].itemsSold += item.quantity;
      const totalSale = item.quantity * item.price;
      revenueBySeller[seller.id].grossRevenue += totalSale;
      // Default: Designer gets 20% of the sale price
      revenueBySeller[seller.id].designerRevenue += totalSale * 0.20;
    }

    const data = Object.values(revenueBySeller);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Revenue Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch revenue' }, { status: 500 });
  }
}
