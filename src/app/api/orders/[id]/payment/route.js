import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

export async function GET(_request,{params}){try{const user=await requireUser();const{id}=await params;const order=await prisma.order.findFirst({where:{id,userId:user.id},include:{payments:true}});if(!order)return NextResponse.json({error:"ไม่พบคำสั่งซื้อ"},{status:404});if(order.status!=="PENDING_PAYMENT"||!order.payments)return NextResponse.json({error:"คำสั่งซื้อนี้ไม่อยู่ในสถานะรอชำระ"},{status:409});if(!order.payments.expires_at||order.payments.expires_at<=new Date())return NextResponse.json({error:"QR Code หมดอายุแล้ว กรุณาสั่งซื้อใหม่"},{status:410});return NextResponse.json({data:{orderId:order.id,amount:order.total_amount,qrCodeUrl:order.payments.qr_code_url,expiresAt:order.payments.expires_at}})}catch(e){if(e instanceof HttpError)return NextResponse.json({error:e.message},{status:e.status});return NextResponse.json({error:"ไม่สามารถโหลดข้อมูลชำระเงินได้"},{status:500})}}
