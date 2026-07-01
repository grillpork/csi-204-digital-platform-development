import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
import { deleteImage, storageKeyFromUrl } from "@/lib/storage";

const categories = new Set(["TSHIRT","POLO","HOODIE","LONG_SLEEVE","TANK_TOP"]);
const sizes = new Set(["XS","S","M","L","XL","XXL"]);
const fail=e=>e instanceof HttpError?NextResponse.json({error:e.message},{status:e.status}):NextResponse.json({error:e.message||"เกิดข้อผิดพลาด"},{status:500});
const text=(v,n=500)=>String(v||"").trim().slice(0,n);

export async function GET(){try{const u=await requireUser();const data=await prisma.product.findMany({where:{sellerId:u.id,is_custom:true},orderBy:{updatedAt:"desc"}});return NextResponse.json({data});}catch(e){return fail(e)}}

export async function POST(request){try{
 const u=await requireUser(), b=await request.json();
 const name=text(b.name,120), description=text(b.description,2000), image=text(b.image,1000);
 if(name.length<3||!image)return NextResponse.json({error:"กรุณาระบุชื่อและรูปตัวอย่างงานออกแบบ"},{status:400});
 const category=categories.has(b.category)?b.category:"TSHIRT";
 const selectedSizes=Array.isArray(b.sizes)?b.sizes.filter(x=>sizes.has(x)):[];
 const data=await prisma.product.create({data:{name,description,price:0,category,images:[image],colors:[text(b.color,30)||"White"],sizes:selectedSizes.length?selectedSizes:["M"],stock:0,sellerId:u.id,is_custom:true,overlay_image:image,print_side:text(b.printSide,20)||"front",screen_size:text(b.screenSize,20)||"A4",print_technique:text(b.printTechnique,30)||"DFT",is_public:false,approvalStatus:"DRAFT"}});
 return NextResponse.json({data},{status:201});
}catch(e){return fail(e)}}

export async function PATCH(request){try{
 const u=await requireUser(),b=await request.json(),id=Number(b.id);const current=await prisma.product.findFirst({where:{id,sellerId:u.id,is_custom:true}});
 if(!current)return NextResponse.json({error:"ไม่พบแบบเสื้อ"},{status:404});
 if(!["DRAFT","REJECTED"].includes(current.approvalStatus))return NextResponse.json({error:"แก้ไขได้เฉพาะแบบร่างหรือแบบที่ถูกปฏิเสธ"},{status:409});
 const nextImage=b.image?text(b.image,1000):null;
 const data=await prisma.product.update({where:{id},data:{name:text(b.name,120)||current.name,description:b.description===undefined?current.description:text(b.description,2000),...(nextImage&&{images:[nextImage],overlay_image:nextImage}),approvalStatus:"DRAFT",rejectionReason:null}});
 if(nextImage&&current.images[0]!==nextImage)for(const url of current.images){await deleteImage(storageKeyFromUrl(url))}return NextResponse.json({data});
}catch(e){return fail(e)}}

export async function DELETE(request){try{
 const u=await requireUser(),{id}=await request.json(),current=await prisma.product.findFirst({where:{id:Number(id),sellerId:u.id,is_custom:true},include:{_count:{select:{orderItems:true}}}});
 if(!current)return NextResponse.json({error:"ไม่พบแบบเสื้อ"},{status:404});
 if(current._count.orderItems>0)return NextResponse.json({error:"ลบสินค้าที่เคยมีคำสั่งซื้อไม่ได้ สามารถขอให้ผู้ดูแลระงับการขายได้"},{status:409});
 if(current.approvalStatus==="PENDING")return NextResponse.json({error:"กรุณาถอนคำขอตรวจก่อนลบ"},{status:409});
 await prisma.product.delete({where:{id:current.id}});for(const url of current.images){await deleteImage(storageKeyFromUrl(url))}return NextResponse.json({success:true});
}catch(e){return fail(e)}}
