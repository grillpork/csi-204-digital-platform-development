import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
import { uploadImage, deleteImage, storageKeyFromUrl } from "@/lib/storage";

const fail=e=>e instanceof HttpError?NextResponse.json({error:e.message},{status:e.status}):NextResponse.json({error:e.message||"จัดการรูปไม่สำเร็จ"},{status:400});
export async function POST(request){try{const me=await requireUser();const old=await prisma.user.findUnique({where:{id:me.id},select:{avatarUrl:true}});const form=await request.formData();const uploaded=await uploadImage(form.get("avatar"),"avatars");const user=await prisma.user.update({where:{id:me.id},data:{avatarUrl:uploaded.url},select:{avatarUrl:true}});if(old?.avatarUrl)await deleteImage(storageKeyFromUrl(old.avatarUrl));return NextResponse.json({avatarUrl:user.avatarUrl},{status:201});}catch(e){return fail(e)}}
export async function DELETE(){try{const me=await requireUser();const old=await prisma.user.findUnique({where:{id:me.id},select:{avatarUrl:true}});await prisma.user.update({where:{id:me.id},data:{avatarUrl:null}});if(old?.avatarUrl)await deleteImage(storageKeyFromUrl(old.avatarUrl));return NextResponse.json({avatarUrl:null});}catch(e){return fail(e)}}
