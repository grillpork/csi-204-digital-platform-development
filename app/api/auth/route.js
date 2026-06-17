import { NextResponse } from "next/server";
import prisma from "@/config/prisma";
import bcrypt from "bcrypt";

const secretJWT = process.env.JWT_SECRET;

//example api auth
export async function POST(request) {
    return NextResponse.json({ message: 'Hello from /api/auth' });
}
