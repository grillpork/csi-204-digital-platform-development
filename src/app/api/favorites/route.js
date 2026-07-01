import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
const fail=e=>e instanceof HttpError?NextResponse.json({error:e.message},{status:e.status}):NextResponse.json({error:"เกิดข้อผิดพลาด"},{status:500});
export async function GET(){try{const u=await requireUser();const rows=await prisma.favorite.findMany({where:{userId:u.id},include:{product:true},orderBy:{createdAt:"desc"}});return NextResponse.json({data:rows.map(x=>x.product)});}catch(e){return fail(e)}}
export async function POST(request){try{const u=await requireUser(),{productId}=await request.json(),id=Number(productId);const p=await prisma.product.findFirst({where:{id,is_public:true,approvalStatus:"APPROVED"}});if(!p)return NextResponse.json({error:"ไม่พบสินค้าที่เปิดขาย"},{status:404});await prisma.favorite.upsert({where:{userId_productId:{userId:u.id,productId:id}},update:{},create:{userId:u.id,productId:id}});return NextResponse.json({favorite:true},{status:201});}catch(e){return fail(e)}}
export async function DELETE(request){try{const u=await requireUser(),{productId}=await request.json();await prisma.favorite.deleteMany({where:{userId:u.id,productId:Number(productId)}});return NextResponse.json({favorite:false});}catch(e){return fail(e)}}
