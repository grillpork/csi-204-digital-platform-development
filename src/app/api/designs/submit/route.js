import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

export async function POST(request){try{const u=await requireUser(),{id}=await request.json();const p=await prisma.product.findFirst({where:{id:Number(id),sellerId:u.id,is_custom:true}});if(!p)return NextResponse.json({error:"ไม่พบแบบเสื้อ"},{status:404});if(!["DRAFT","REJECTED"].includes(p.approvalStatus))return NextResponse.json({error:"สถานะปัจจุบันไม่สามารถส่งตรวจได้"},{status:409});const data=await prisma.product.update({where:{id:p.id},data:{approvalStatus:"PENDING",submittedAt:new Date(),reviewedAt:null,reviewedById:null,rejectionReason:null,is_public:false}});return NextResponse.json({data});}catch(e){if(e instanceof HttpError)return NextResponse.json({error:e.message},{status:e.status});return NextResponse.json({error:"ส่งคำขอไม่สำเร็จ"},{status:500})}}

export async function DELETE(request){try{const u=await requireUser(),{id}=await request.json();const p=await prisma.product.findFirst({where:{id:Number(id),sellerId:u.id,is_custom:true,approvalStatus:"PENDING"}});if(!p)return NextResponse.json({error:"ไม่พบคำขอที่ถอนได้"},{status:404});const data=await prisma.product.update({where:{id:p.id},data:{approvalStatus:"DRAFT",submittedAt:null}});return NextResponse.json({data});}catch(e){if(e instanceof HttpError)return NextResponse.json({error:e.message},{status:e.status});return NextResponse.json({error:"ถอนคำขอไม่สำเร็จ"},{status:500})}}
