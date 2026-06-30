"use client";

import React, { useState } from 'react';
import { Database, Table, Key, Link2, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

const schemas = [
  {
    name: "Role (กลุ่มสิทธิ์ผู้ใช้งาน)",
    dbTable: "roles",
    fields: [
      { name: "id", type: "Int", desc: "รหัสกลุ่มสิทธิ์ (Primary Key, Auto-increment)" },
      { name: "name", type: "String", desc: "ชื่อสิทธิ์ผู้ใช้ เช่น Customer, Creator, Admin (Unique)" }
    ]
  },
  {
    name: "User (ข้อมูลบัญชีผู้ใช้)",
    dbTable: "users",
    fields: [
      { name: "id", type: "String", desc: "รหัสผู้ใช้หลัก (Primary Key, CUID)" },
      { name: "name", type: "String", desc: "ชื่อ-นามสกุลจริง" },
      { name: "email", type: "String", desc: "ที่อยู่อีเมลเข้าสู่ระบบ (Unique)" },
      { name: "password", type: "String", desc: "รหัสผ่านที่เข้ารหัสผ่าน bcrypt" },
      { name: "address", type: "String (Nullable)", desc: "ที่อยู่จัดส่งของลูกค้า" },
      { name: "phone", type: "String (Nullable)", desc: "เบอร์โทรศัพท์ติดต่อ" },
      { name: "roleId", type: "Int", desc: "เชื่อมโยงรหัสสิทธิ์ผู้ใช้ (Foreign Key -> Role.id)" },
      { name: "isSeller", type: "Boolean", desc: "สถานะเป็นผู้ขาย/นักออกแบบ (Default: false)" },
      { name: "shopName", type: "String (Nullable)", desc: "ชื่อร้านค้าสำหรับแสดงในหน้าร้าน" },
      { name: "createdAt", type: "DateTime", desc: "วันที่และเวลาที่สมัครสมาชิก" }
    ]
  },
  {
    name: "Product (ข้อมูลสินค้า)",
    dbTable: "products",
    fields: [
      { name: "id", type: "Int", desc: "รหัสสินค้าหลัก (Primary Key, Auto-increment)" },
      { name: "name", type: "String", desc: "ชื่อลายเสื้อสกรีน / สินค้าเสื้อยืด" },
      { name: "description", type: "String", desc: "คำอธิบายรายละเอียดลายเสื้อและข้อมูลสินค้า" },
      { name: "price", type: "Int", desc: "ราคาขายสินค้า (หน่วยบาท)" },
      { name: "category", type: "Category (Enum)", desc: "หมวดหมู่ประเภทเสื้อ เช่น TSHIRT, POLO, HOODIE" },
      { name: "images", type: "String[]", desc: "อาร์เรย์รายการลิงก์รูปภาพสินค้า/Mockup" },
      { name: "colors", type: "String[]", desc: "อาร์เรย์รหัสสีเสื้อที่รองรับการสกรีน (เช่น #ffffff)" },
      { name: "sizes", type: "Size[] (Enum)", desc: "อาร์เรย์ขนาดเสื้อที่รองรับ (XS, S, M, L, XL, XXL)" },
      { name: "stock", type: "Int", desc: "จำนวนสินค้าคงเหลือ (Default: 0)" },
      { name: "sellerId", type: "String", desc: "รหัสร้านผู้ขาย (Foreign Key -> User.id)" },
      { name: "createdAt", type: "DateTime", desc: "วันที่เริ่มวางขายสินค้า" }
    ]
  },
  {
    name: "Cart (ข้อมูลตะกร้าหลัก)",
    dbTable: "carts",
    fields: [
      { name: "id", type: "Int", desc: "รหัสตะกร้าหลัก (Primary Key, Auto-increment)" },
      { name: "userId", type: "String", desc: "รหัสผู้ใช้เจ้าของตะกร้า (Foreign Key -> User.id, Unique)" },
      { name: "createdAt", type: "DateTime", desc: "วันที่ริเริ่มตะกร้าสินค้า" },
      { name: "updatedAt", type: "DateTime", desc: "เวลาอัปเดตตะกร้าสินค้าล่าสุด" }
    ]
  },
  {
    name: "CartItem (รายการย่อยในตะกร้า)",
    dbTable: "cart_items",
    fields: [
      { name: "id", type: "Int", desc: "รหัสรายการย่อยในตะกร้า (Primary Key)" },
      { name: "cartId", type: "Int", desc: "เชื่อมโยงตะกร้าหลัก (Foreign Key -> Cart.id)" },
      { name: "productId", type: "Int", desc: "รหัสสินค้าที่เลือกสกรีน" },
      { name: "quantity", type: "Int", desc: "จำนวนสินค้าที่กดสั่งซื้อในตะกร้า" },
      { name: "addedAt", type: "DateTime", desc: "วันที่นำสินค้าชิ้นนี้ลงตะกร้า" }
    ]
  },
  {
    name: "Favorite (รายการสินค้าที่ถูกใจ)",
    dbTable: "favorites",
    fields: [
      { name: "id", type: "Int", desc: "รหัสรายการที่ถูกใจ (Primary Key, Auto-increment)" },
      { name: "userId", type: "String", desc: "รหัสผู้ใช้ที่กดไลก์สินค้า (Foreign Key -> User.id)" },
      { name: "productId", type: "Int", desc: "รหัสสินค้าที่ถูกใจ (Foreign Key -> Product.id)" },
      { name: "createdAt", type: "DateTime", desc: "วันที่กดเพิ่มเป็นสินค้าที่ถูกใจ" }
    ]
  },
  {
    name: "Shipping (ข้อมูลการจัดส่งและพัสดุ)",
    dbTable: "shippings",
    fields: [
      { name: "id", type: "Int", desc: "รหัสรายการขนส่งพัสดุ (Primary Key, Auto-increment)" },
      { name: "orderId", type: "String", desc: "รหัสอ้างอิงคำสั่งซื้อ (Order ID / Order CUID)" },
      { name: "carrier", type: "String", desc: "บริษัทผู้ให้บริการขนส่ง เช่น Flash Express, Kerry, TH Post" },
      { name: "trackingNumber", type: "String", desc: "เลขพัสดุสำหรับใช้ติดตามสถานะจัดส่ง" },
      { name: "status", type: "String", desc: "สถานะการจัดส่งปัจจุบัน เช่น PENDING, SHIPPED, DELIVERED" },
      { name: "updatedAt", type: "DateTime", desc: "วันเวลาที่ปรับปรุงสถานะขนส่งล่าสุด" }
    ]
  }
];

const rawPrisma = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Role {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  users User[]

  @@map("roles")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  address   String?
  phone     String?
  roleId    Int      @default(1)
  role      Role     @relation(fields: [roleId], references: [id])
  isSeller  Boolean  @default(false) @map("is_seller")
  shopName  String?  @map("shop_name")
  products  Product[]
  cart      Cart?
  favorites Favorite[]
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}

model Cart {
  id        Int        @id @default(autoincrement())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@map("carts")
}

model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId Int
  quantity  Int
  addedAt   DateTime @default(now())

  @@map("cart_items")
}

enum Size {
  XS
  S
  M
  L
  XL
  XXL
}

enum Category {
  TSHIRT
  POLO
  HOODIE
  LONG_SLEEVE
  TANK_TOP
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Int
  category    Category
  images      String[]
  colors      String[]
  sizes       Size[]
  stock       Int      @default(0)
  sellerId    String
  seller      User     @relation(fields: [sellerId], references: [id])
  favorites   Favorite[]
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@unique([id, sellerId])
  @@map("products")
}

model Favorite {
  id        Int      @id @default(autoincrement())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId Int      @map("product_id")
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, productId])
  @@map("favorites")
}

model Shipping {
  id             Int      @id @default(autoincrement())
  orderId        String   @unique @map("order_id")
  carrier        String
  trackingNumber String   @map("tracking_number")
  status         String   @default("PENDING")
  updatedAt      DateTime @updatedAt @map("updated_at")

  @@map("shippings")
}
`;

export default function SchemaDocsPage() {
  const [selectedTable, setSelectedTable] = useState("User (ข้อมูลบัญชีผู้ใช้)");
  const [showRaw, setShowRaw] = useState(false);

  const activeTable = schemas.find(s => s.name === selectedTable);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-9 h-9 text-blue-600" />
            โครงสร้างฐานข้อมูล (Database Schema)
          </h1>
          <p className="text-[15px] leading-7 text-slate-500 max-w-2xl">
            โครงสร้างเชิงสัมพันธ์ (Relational Model) ของ PostgreSQL บนแพลตฟอร์ม The Shirtsy จัดการสคีมาโดยใช้ Prisma ORM
          </p>
        </div>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="px-4 py-2 text-xs font-semibold border rounded-xl shadow-sm transition-all shrink-0 bg-slate-50 hover:bg-slate-100 border-slate-200"
        >
          {showRaw ? "ดูตารางอธิบายข้อมูล (GUI)" : "ดูไฟล์ดิบ Prisma Schema (.prisma)"}
        </button>
      </div>

      {showRaw ? (
        /* Raw Prisma File View */
        <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-inner border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <span className="font-mono text-xs text-slate-400">prisma/schema.prisma</span>
            <span className="text-[10px] text-green-400 bg-green-950/50 border border-green-900/50 px-2 py-0.5 rounded font-mono">Read Only</span>
          </div>
          <pre className="text-xs text-blue-400 font-mono leading-relaxed">
            {rawPrisma}
          </pre>
        </div>
      ) : (
        /* GUI Explanatory Table View */
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Table Selector */}
          <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-4 lg:pb-0">
            {schemas.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelectedTable(s.name)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all text-left w-full border ${
                  selectedTable === s.name
                    ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <Table className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-60 font-mono mt-0.5">@@map("{s.dbTable}")</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Field Details Table */}
          <div className="flex-1 w-full border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">{activeTable.name}</h3>
                <span className="text-xs text-slate-400 font-mono">Database Table: {activeTable.dbTable}</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {activeTable.fields.length} Columns
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
                <thead className="bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">Column Name</th>
                    <th scope="col" className="px-6 py-3">Prisma Type</th>
                    <th scope="col" className="px-6 py-3">Description (คำอธิบาย)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeTable.fields.map((field, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        {idx === 0 && <Key className="w-3 h-3 text-amber-500 shrink-0" />}
                        {field.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 font-mono rounded text-slate-700 text-[10px]">
                          {field.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500">
                        {field.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
