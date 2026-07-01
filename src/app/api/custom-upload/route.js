import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";
import { uploadImage } from "@/lib/storage";

export async function POST(request) {
  try {
    await requireUser();
    const data = await request.formData();
    const file = data.get("designImage");
    const uploaded = await uploadImage(file, "designs");
    return NextResponse.json({ imageUrl:uploaded.url, key:uploaded.key, provider:uploaded.provider }, { status:201 });
  } catch (e) {
    if (e instanceof HttpError) return NextResponse.json({ error:e.message }, { status:e.status });
    return NextResponse.json({ error:e.message || "อัปโหลดไม่สำเร็จ" }, { status:400 });
  }
}
