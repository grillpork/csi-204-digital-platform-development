import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
import { deleteImage, storageKeyFromUrl } from "@/lib/storage";

const categories = new Set(["TSHIRT","POLO","HOODIE","LONG_SLEEVE","TANK_TOP"]);
const sizes = new Set(["XS","S","M","L","XL","XXL"]);
const fail=e=>{
  console.error("API Route Error:", e);
  return e instanceof HttpError?NextResponse.json({error:e.message},{status:e.status}):NextResponse.json({error:e.message||"เกิดข้อผิดพลาด"},{status:500});
};
const text=(v,n=500)=>String(v||"").trim().slice(0,n);

export async function GET(request){try{
  const u=await requireUser();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    const data = await prisma.product.findFirst({where:{id:Number(id),sellerId:u.id,is_custom:true}});
    return NextResponse.json({data});
  }
  const data=await prisma.product.findMany({where:{sellerId:u.id,is_custom:true},orderBy:{updatedAt:"desc"}});
  return NextResponse.json({data});
}catch(e){return fail(e)}}

export async function POST(request){try{
 const u=await requireUser(), b=await request.json();
 const name=text(b.name,120), description=text(b.description,2000);
 const images=Array.isArray(b.images)?b.images.map(x=>text(x,1000)):(b.image?[text(b.image,1000)]:[]);
 if(name.length<3||!images.length)return NextResponse.json({error:"กรุณาระบุชื่อและรูปตัวอย่างงานออกแบบ"},{status:400});
 const category=categories.has(b.category)?b.category:"TSHIRT";
 const selectedSizes=Array.isArray(b.sizes)?b.sizes.filter(x=>sizes.has(x)):[];
 const data=await prisma.product.create({data:{
    name,
    description,
    price:0,
    category,
    images,
    colors:[text(b.color,30)||"White"],
    sizes:selectedSizes.length?selectedSizes:["M"],
    stock:0,
    sellerId:u.id,
    is_custom:true,
    base_product_id:b.baseProductId?Number(b.baseProductId):null,
    overlay_image:b.overlay_image?text(b.overlay_image,1000):null,
    overlay_position_x:b.overlay_position_x!==undefined&&b.overlay_position_x!==null?Number(b.overlay_position_x):null,
    overlay_position_y:b.overlay_position_y!==undefined&&b.overlay_position_y!==null?Number(b.overlay_position_y):null,
    overlay_size:b.overlay_size!==undefined&&b.overlay_size!==null?Number(b.overlay_size):null,
    overlay_image_back:b.overlay_image_back?text(b.overlay_image_back,1000):null,
    overlay_position_x_back:b.overlay_position_x_back!==undefined&&b.overlay_position_x_back!==null?Number(b.overlay_position_x_back):null,
    overlay_position_y_back:b.overlay_position_y_back!==undefined&&b.overlay_position_y_back!==null?Number(b.overlay_position_y_back):null,
    overlay_size_back:b.overlay_size_back!==undefined&&b.overlay_size_back!==null?Number(b.overlay_size_back):null,
    print_side:text(b.printSide,20)||"front",
    screen_size:text(b.screenSize,20)||"A4",
    print_technique:text(b.printTechnique,30)||"DFT",
    is_public:false,
    approvalStatus:"DRAFT"
  }});
 return NextResponse.json({data},{status:201});
}catch(e){return fail(e)}}

export async function PATCH(request){try{
  const u=await requireUser(),b=await request.json(),id=Number(b.id);const current=await prisma.product.findFirst({where:{id,sellerId:u.id,is_custom:true}});
  if(!current)return NextResponse.json({error:"ไม่พบแบบเสื้อ"},{status:404});
  if(!["DRAFT","REJECTED"].includes(current.approvalStatus))return NextResponse.json({error:"แก้ไขได้เฉพาะแบบร่างหรือแบบที่ถูกปฏิเสธ"},{status:409});
  const nextImages=Array.isArray(b.images)?b.images.map(x=>text(x,1000)):(b.image?[text(b.image,1000)]:null);
  const data=await prisma.product.update({
    where:{id},
    data:{
      name:text(b.name,120)||current.name,
      description:b.description===undefined?current.description:text(b.description,2000),
      ...(nextImages&&{images:nextImages}),
      overlay_image: b.overlay_image !== undefined ? (b.overlay_image ? text(b.overlay_image, 1000) : null) : current.overlay_image,
      overlay_position_x:b.overlay_position_x!==undefined&&b.overlay_position_x!==null?Number(b.overlay_position_x):current.overlay_position_x,
      overlay_position_y:b.overlay_position_y!==undefined&&b.overlay_position_y!==null?Number(b.overlay_position_y):current.overlay_position_y,
      overlay_size:b.overlay_size!==undefined&&b.overlay_size!==null?Number(b.overlay_size):current.overlay_size,
      overlay_image_back: b.overlay_image_back !== undefined ? (b.overlay_image_back ? text(b.overlay_image_back, 1000) : null) : current.overlay_image_back,
      overlay_position_x_back:b.overlay_position_x_back!==undefined&&b.overlay_position_x_back!==null?Number(b.overlay_position_x_back):current.overlay_position_x_back,
      overlay_position_y_back:b.overlay_position_y_back!==undefined&&b.overlay_position_y_back!==null?Number(b.overlay_position_y_back):current.overlay_position_y_back,
      overlay_size_back:b.overlay_size_back!==undefined&&b.overlay_size_back!==null?Number(b.overlay_size_back):current.overlay_size_back,
      colors: b.color ? [text(b.color,30)] : current.colors,
      sizes: b.sizes ? (Array.isArray(b.sizes) ? b.sizes.filter(x=>sizes.has(x)) : [b.sizes]) : current.sizes,
      print_side: b.printSide ? text(b.printSide,20) : current.print_side,
      screen_size: b.screenSize ? text(b.screenSize,20) : current.screen_size,
      print_technique: b.printTechnique ? text(b.printTechnique,30) : current.print_technique,
      approvalStatus:"DRAFT",
      rejectionReason:null
    }
  });
  if(nextImages&&current.images){
    for(const url of current.images){
      if(!nextImages.includes(url)){
        try{await deleteImage(storageKeyFromUrl(url))}catch(err){console.error("Delete old image err:",err)}
      }
    }
  }
  return NextResponse.json({data});
}catch(e){return fail(e)}}

export async function DELETE(request){try{
 const u=await requireUser(),{id}=await request.json(),current=await prisma.product.findFirst({where:{id:Number(id),sellerId:u.id,is_custom:true},include:{_count:{select:{orderItems:true}}}});
 if(!current)return NextResponse.json({error:"ไม่พบแบบเสื้อ"},{status:404});
 if(current._count.orderItems>0)return NextResponse.json({error:"ลบสินค้าที่เคยมีคำสั่งซื้อไม่ได้ สามารถขอให้ผู้ดูแลระงับการขายได้"},{status:409});
 if(current.approvalStatus==="PENDING")return NextResponse.json({error:"กรุณาถอนคำขอตรวจก่อนลบ"},{status:409});
 await prisma.product.delete({where:{id:current.id}});for(const url of current.images){try{await deleteImage(storageKeyFromUrl(url))}catch(err){console.error("Delete image err:",err)}}return NextResponse.json({success:true});
}catch(e){return fail(e)}}
