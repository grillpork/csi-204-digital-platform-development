import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

export async function POST(_request,{params}){try{const user=await requireUser();const{id}=await params;const order=await prisma.order.findFirst({where:{id,userId:user.id,status:"PENDING_PAYMENT"},include:{items:true,payments:true}});if(!order)return NextResponse.json({error:"ยกเลิกได้เฉพาะออเดอร์ที่รอชำระเงิน"},{status:409});await prisma.$transaction(async tx=>{const changed=await tx.order.updateMany({where:{id:order.id,status:"PENDING_PAYMENT"},data:{status:"CANCELLED"}});if(!changed.count)throw new HttpError(409,"สถานะออเดอร์เปลี่ยนแปลงแล้ว");for(const item of order.items)await tx.product.update({where:{id:item.productId},data:{stock:{increment:item.quantity}}});if(order.payments)await tx.payments.update({where:{order_id:order.id},data:{status:"cancelled"}})});return NextResponse.json({success:true,status:"CANCELLED"})}catch(e){if(e instanceof HttpError)return NextResponse.json({error:e.message},{status:e.status});return NextResponse.json({error:"ยกเลิกคำสั่งซื้อไม่สำเร็จ"},{status:500})}}
