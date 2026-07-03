import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/dal";

// Default seed data
const DEFAULT_TYPES = [
  { name: "เสื้อยืด", code: "TSHIRT", description: "เสื้อยืดคอกลมคลาสสิก" },
  { name: "เสื้อโปโล", code: "POLO", description: "เสื้อโปโลคอปกเป็นทางการ" },
  { name: "เสื้อฮู้ด", code: "HOODIE", description: "เสื้อกันหนาวมีฮู้ดทรงโอเวอร์ไซซ์" },
  { name: "เสื้อแขนยาว", code: "LONG_SLEEVE", description: "เสื้อยืดแขนยาวสำหรับอากาศเย็น" },
  { name: "เสื้อกล้าม", code: "TANK_TOP", description: "เสื้อกล้ามสวมใส่สบายสำหรับออกกำลังกาย" },
];

const DEFAULT_SIZES = [
  { name: "S", code: "S", chestSize: "อก 34\"" },
  { name: "M", code: "M", chestSize: "อก 38\"" },
  { name: "L", code: "L", chestSize: "อก 42\"" },
  { name: "XL", code: "XL", chestSize: "อก 46\"" },
  { name: "2XL", code: "2XL", chestSize: "อก 50\"" },
];

const DEFAULT_QUALITIES = [
  { name: "Cotton 100% (เกรดมาตรฐาน)", description: "ผ้านุ่ม ใส่สบาย ระบายอากาศได้ดีเยี่ยม", price: 0 },
  { name: "Semi-Premium (เกรดหนาหนุ่ม)", description: "ผ้าหนาคงรูป ทนทานต่อการซัก ไม่ย้วยง่าย", price: 50 },
  { name: "Premium (เกรดพรีเมียมส่งออก)", description: "ใช้เส้นด้ายละเอียดพิเศษ สัมผัสนุ่มลื่นระดับแบรนด์ดัง", price: 100 },
];

export async function GET() {
  try {
    await requireAdmin();

    // 1. Fetch data
    let types = await prisma.shirtType.findMany({ orderBy: { id: "asc" } });
    let sizes = await prisma.shirtSize.findMany({ orderBy: { id: "asc" } });
    let qualities = await prisma.shirtQuality.findMany({ orderBy: { id: "asc" } });

    // 2. Auto-seed if empty (developer and initial setup friendly)
    let seeded = false;
    if (types.length === 0) {
      await prisma.shirtType.createMany({ data: DEFAULT_TYPES });
      types = await prisma.shirtType.findMany({ orderBy: { id: "asc" } });
      seeded = true;
    }
    if (sizes.length === 0) {
      await prisma.shirtSize.createMany({ data: DEFAULT_SIZES });
      sizes = await prisma.shirtSize.findMany({ orderBy: { id: "asc" } });
      seeded = true;
    }
    if (qualities.length === 0) {
      await prisma.shirtQuality.createMany({ data: DEFAULT_QUALITIES });
      qualities = await prisma.shirtQuality.findMany({ orderBy: { id: "asc" } });
      seeded = true;
    }

    return NextResponse.json({ success: true, data: { types, sizes, qualities }, seeded });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch catalog specs" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    await requireAdmin();
    const { target, data } = await req.json();

    if (!target || !data) {
      return NextResponse.json({ success: false, error: "Target and data are required" }, { status: 400 });
    }

    let result;
    if (target === "type") {
      if (!data.name || !data.code) {
        return NextResponse.json({ success: false, error: "Name and Code are required for shirt type" }, { status: 400 });
      }
      result = await prisma.shirtType.create({
        data: {
          name: data.name,
          code: data.code.toUpperCase().replace(/\s+/g, "_"),
          description: data.description || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      });
    } else if (target === "size") {
      if (!data.name || !data.code) {
        return NextResponse.json({ success: false, error: "Name and Code are required for size" }, { status: 400 });
      }
      result = await prisma.shirtSize.create({
        data: {
          name: data.name,
          code: data.code.toUpperCase().replace(/\s+/g, "_"),
          chestSize: data.chestSize || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      });
    } else if (target === "quality") {
      if (!data.name) {
        return NextResponse.json({ success: false, error: "Name is required for quality" }, { status: 400 });
      }
      result = await prisma.shirtQuality.create({
        data: {
          name: data.name,
          description: data.description || "",
          price: parseInt(data.price) || 0,
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid target" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // Handle unique constraint violations gracefully
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Code already exists. Please use a unique value." }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create catalog spec" },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await requireAdmin();
    const { target, id, data } = await req.json();

    if (!target || id === undefined || !data) {
      return NextResponse.json({ success: false, error: "Target, ID, and data are required" }, { status: 400 });
    }

    const numericId = parseInt(id);
    let result;

    if (target === "type") {
      result = await prisma.shirtType.update({
        where: { id: numericId },
        data: {
          name: data.name,
          code: data.code ? data.code.toUpperCase().replace(/\s+/g, "_") : undefined,
          description: data.description,
          isActive: data.isActive,
        },
      });
    } else if (target === "size") {
      result = await prisma.shirtSize.update({
        where: { id: numericId },
        data: {
          name: data.name,
          code: data.code ? data.code.toUpperCase().replace(/\s+/g, "_") : undefined,
          chestSize: data.chestSize,
          isActive: data.isActive,
        },
      });
    } else if (target === "quality") {
      result = await prisma.shirtQuality.update({
        where: { id: numericId },
        data: {
          name: data.name,
          description: data.description,
          price: data.price !== undefined ? parseInt(data.price) : undefined,
          isActive: data.isActive,
        },
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid target" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Code already exists. Please use a unique value." }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update catalog spec" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("target");
    const id = searchParams.get("id");

    if (!target || !id) {
      return NextResponse.json({ success: false, error: "Target and ID are required" }, { status: 400 });
    }

    const numericId = parseInt(id);
    let result;

    if (target === "type") {
      result = await prisma.shirtType.delete({ where: { id: numericId } });
    } else if (target === "size") {
      result = await prisma.shirtSize.delete({ where: { id: numericId } });
    } else if (target === "quality") {
      result = await prisma.shirtQuality.delete({ where: { id: numericId } });
    } else {
      return NextResponse.json({ success: false, error: "Invalid target" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete catalog spec" },
      { status: error.status || 500 }
    );
  }
}
