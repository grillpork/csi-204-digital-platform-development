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
      { name: "bio", type: "String (Nullable)", desc: "ประวัติส่วนตัว/แนะนำตัว" },
      { name: "avatarUrl", type: "String (Nullable)", desc: "รูปโปรไฟล์ผู้ใช้งาน" },
      { name: "roleId", type: "Int", desc: "เชื่อมโยงรหัสสิทธิ์ผู้ใช้ (Foreign Key -> Role.id)" },
      { name: "isSeller", type: "Boolean", desc: "สถานะเป็นผู้ขาย/นักออกแบบ (Default: false)" },
      { name: "shopName", type: "String (Nullable)", desc: "ชื่อร้านค้าสำหรับแสดงในหน้าร้าน" },
      { name: "createdAt", type: "DateTime", desc: "วันที่และเวลาที่สมัครสมาชิก" }
    ]
  },
  {
    name: "Product (ข้อมูลสินค้า/ลายออกแบบ)",
    dbTable: "products",
    fields: [
      { name: "id", type: "Int", desc: "รหัสสินค้าหลัก (Primary Key, Auto-increment)" },
      { name: "name", type: "String", desc: "ชื่อลายเสื้อสกรีน / สินค้าเสื้อยืด" },
      { name: "description", type: "String", desc: "คำอธิบายรายละเอียดลายเสื้อและข้อมูลสินค้า" },
      { name: "price", type: "Int", desc: "ราคาขายสินค้า (หน่วยบาท)" },
      { name: "category", type: "Category (Enum)", desc: "หมวดหมู่ประเภทเสื้อ เช่น TSHIRT, POLO, HOODIE" },
      { name: "images", type: "String[]", desc: "อาร์เรย์รายการลิงก์รูปภาพสินค้า/Mockup" },
      { name: "colors", type: "String[]", desc: "อาร์เรย์รหัสสีเสื้อที่รองรับการสกรีน (เช่น White, Black)" },
      { name: "sizes", type: "Size[] (Enum)", desc: "อาร์เรย์ขนาดเสื้อที่รองรับ (XS, S, M, L, XL, XXL)" },
      { name: "stock", type: "Int", desc: "จำนวนสินค้าคงเหลือ (Default: 0)" },
      { name: "sellerId", type: "String", desc: "รหัสร้านผู้ขาย (Foreign Key -> User.id)" },
      { name: "createdAt", type: "DateTime", desc: "วันที่เริ่มต้นบันทึกข้อมูล" },
      { name: "is_custom", type: "Boolean", desc: "ระบุว่าเป็นลายที่ออกแบบเองหรือไม่ (Default: false)" },
      { name: "base_product_id", type: "Int (Nullable)", desc: "รหัสสินค้าตั้งต้นที่นำมาออกแบบ" },
      { name: "overlay_image", type: "String (Nullable)", desc: "รูปภาพสกรีนลายด้านหน้า" },
      { name: "overlay_position_x", type: "Float (Nullable)", desc: "ตำแหน่งพิกัด X ลายสกรีนหน้า" },
      { name: "overlay_position_y", type: "Float (Nullable)", desc: "ตำแหน่งพิกัด Y ลายสกรีนหน้า" },
      { name: "overlay_size", type: "Float (Nullable)", desc: "ขนาดของลายสกรีนหน้า" },
      { name: "overlay_image_back", type: "String (Nullable)", desc: "รูปภาพสกรีนลายด้านหลัง" },
      { name: "overlay_position_x_back", type: "Float (Nullable)", desc: "ตำแหน่งพิกัด X ลายสกรีนหลัง" },
      { name: "overlay_position_y_back", type: "Float (Nullable)", desc: "ตำแหน่งพิกัด Y ลายสกรีนหลัง" },
      { name: "overlay_size_back", type: "Float (Nullable)", desc: "ขนาดของลายสกรีนหลัง" },
      { name: "print_side", type: "String (Nullable)", desc: "ด้านของเสื้อที่สกรีน (front, back, both)" },
      { name: "screen_size", type: "String (Nullable)", desc: "ขนาดหน้าจอพิมพ์สกรีน (เช่น A4, A3)" },
      { name: "print_technique", type: "String (Nullable)", desc: "เทคนิคที่ใช้พิมพ์สกรีน (เช่น DFT, DTG)" },
      { name: "is_public", type: "Boolean", desc: "ระบุว่านำขึ้นแสดงบนหน้าร้านหลักหรือไม่" },
      { name: "approvalStatus", type: "ApprovalStatus (Enum)", desc: "สถานะการตรวจงาน (DRAFT, PENDING, APPROVED, REJECTED)" },
      { name: "rejectionReason", type: "String (Nullable)", desc: "เหตุผลกรณีถูกปฏิเสธแบบลายเสื้อ" }
    ]
  },
  {
    name: "Order (ข้อมูลคำสั่งซื้อ)",
    dbTable: "orders",
    fields: [
      { name: "id", type: "String", desc: "รหัสใบสั่งซื้อ (Primary Key, CUID)" },
      { name: "userId", type: "String", desc: "รหัสผู้สั่งซื้อ (Foreign Key -> User.id)" },
      { name: "status", type: "OrderStatus (Enum)", desc: "สถานะสั่งซื้อ (เช่น PENDING, PAID, SHIPPED, CANCELLED)" },
      { name: "total_amount", type: "Int", desc: "ยอดสุทธิที่ต้องชำระ (บาท)" },
      { name: "shippingAddress", type: "String", desc: "ที่อยู่จัดส่งสินค้า" },
      { name: "phone", type: "String (Nullable)", desc: "เบอร์โทรผู้รับ" },
      { name: "createdAt", type: "DateTime", desc: "วันที่ทำรายการสั่งซื้อ" }
    ]
  },
  {
    name: "OrderItem (รายการย่อยสินค้าในออเดอร์)",
    dbTable: "order_items",
    fields: [
      { name: "id", type: "Int", desc: "รหัสรายการสั่งซื้อย่อย (Primary Key, Auto-increment)" },
      { name: "orderId", type: "String", desc: "รหัสอ้างอิงใบสั่งซื้อหลัก (Foreign Key -> Order.id)" },
      { name: "productId", type: "Int", desc: "รหัสสินค้าหรือลายเสื้อที่ซื้อ (Foreign Key -> Product.id)" },
      { name: "quantity", type: "Int", desc: "จำนวนชิ้นที่สั่งซื้อ" },
      { name: "price", type: "Int", desc: "ราคาต่อหน่วย ณ วันสั่งซื้อ" },
      { name: "size", type: "String", desc: "ขนาดไซส์เสื้อยืดที่สั่งซื้อ (เช่น M, L)" },
      { name: "color", type: "String", desc: "รหัสสีเสื้อที่สั่งซื้อ (เช่น White, Black)" }
    ]
  },
  {
    name: "payments (ประวัติและธุรกรรมการชำระเงิน)",
    dbTable: "payments",
    fields: [
      { name: "id", type: "String", desc: "รหัสการเรียกเก็บเงินของ Omise (Primary Key, Charge ID)" },
      { name: "order_id", type: "String", desc: "รหัสอ้างอิงคำสั่งซื้อ (Foreign Key -> Order.id, Unique)" },
      { name: "amount", type: "Int", desc: "ยอดเงินรวมชำระเงิน (หน่วยสตางค์)" },
      { name: "method", type: "String", desc: "ช่องทางชำระเงิน (card หรือ transfer)" },
      { name: "status", type: "String", desc: "สถานะชำระเงินของ Omise เช่น successful, pending" },
      { name: "transaction_id", type: "String (Nullable)", desc: "รหัสทำรายการชำระเงินผ่านธนาคารปลายทาง" },
      { name: "qr_code_url", type: "String (Nullable)", desc: "ลิงก์รูปภาพ QR Code พร้อมเพย์กรณีเลือกพร้อมเพย์" },
      { name: "expires_at", type: "DateTime (Nullable)", desc: "วันหมดอายุในการแสกนชำระเงินพร้อมเพย์" },
      { name: "paid_at", type: "DateTime (Nullable)", desc: "วันที่ทำการหักยอดชำระเงินสำเร็จ" }
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
      { name: "size", type: "String", desc: "ขนาดไซส์เสื้อยืดที่สั่งซื้อ (เช่น M, L)" },
      { name: "color", type: "String", desc: "รหัสสีเสื้อที่สั่งซื้อ (เช่น White, Black)" },
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
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique
  users User[]

  @@map("roles")
}

model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  password  String
  address   String?
  phone     String?
  bio       String?
  avatarUrl String?    @map("avatar")
  roleId    Int        @default(1)
  isSeller  Boolean    @default(false) @map("is_seller")
  shopName  String?    @map("shop_name")
  createdAt DateTime   @default(now()) @map("created_at")
  cart      Cart?
  favorites Favorite[]
  orders    Order[]
  products  Product[]
  role      Role       @relation(fields: [roleId], references: [id])

  @@map("users")
}

model Product {
  id                 Int            @id @default(autoincrement())
  name               String
  description        String
  price              Int
  category           Category
  images             String[]
  colors             String[]
  sizes              Size[]
  stock              Int            @default(0)
  sellerId           String
  createdAt          DateTime       @default(now()) @map("created_at")
  updatedAt          DateTime       @updatedAt @map("updated_at")
  is_custom          Boolean        @default(false)
  base_product_id    Int?
  overlay_image      String?
  overlay_position_x Float?
  overlay_position_y Float?
  overlay_size       Float?
  overlay_image_back      String?
  overlay_position_x_back Float?
  overlay_position_y_back Float?
  overlay_size_back       Float?
  print_side         String?
  screen_size        String?
  print_technique    String?
  is_public          Boolean        @default(false)
  approvalStatus     ApprovalStatus @default(DRAFT) @map("approval_status")
  submittedAt        DateTime?      @map("submitted_at")
  reviewedAt         DateTime?      @map("reviewed_at")
  reviewedById       String?        @map("reviewed_by_id")
  rejectionReason    String?        @map("rejection_reason")
  favorites          Favorite[]
  orderItems         OrderItem[]
  cartItems          CartItem[]
  seller             User           @relation(fields: [sellerId], references: [id])

  @@unique([id, sellerId])
  @@map("products")
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

enum ApprovalStatus {
  DRAFT
  PENDING
  APPROVED
  REJECTED
}

model Order {
  id              String      @id @default(cuid())
  userId          String      @map("user_id")
  status          OrderStatus @default(PENDING)
  total_amount    Int
  shippingAddress String      @map("shipping_address")
  phone           String?
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")
  items           OrderItem[]
  user            User        @relation(fields: [userId], references: [id])
  payments        payments?
  shipping        Shipping?

  @@map("orders")
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   String  @map("order_id")
  productId Int     @map("product_id")
  quantity  Int
  price     Int
  size      String  @default("M")
  color     String  @default("White")
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

enum OrderStatus {
  PENDING
  PENDING_PAYMENT
  PAYMENT_EXPIRED
  PAID
  PROCESSING
  SHIPPED
  COMPLETED
  CANCELLED
}

model payments {
  id             String    @id
  order_id       String    @unique
  amount         Int
  method         String
  status         String
  transaction_id String?
  paid_at        DateTime?
  qr_code_url    String?
  expires_at     DateTime?
  created_at     DateTime  @default(now())
  orders         Order     @relation(fields: [order_id], references: [id], onDelete: Cascade)
}

model Shipping {
  id             Int      @id @default(autoincrement())
  orderId        String   @unique @map("order_id")
  carrier        String
  trackingNumber String   @map("tracking_number")
  status         String   @default("PENDING")
  updatedAt      DateTime @updatedAt @map("updated_at")
  order          Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@map("shippings")
}

model Cart {
  id        Int        @id @default(autoincrement())
  userId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[]
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("carts")
}

model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int
  size      String   @default("M")
  color     String   @default("White")
  addedAt   DateTime @default(now())
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([cartId, productId, size, color])
  @@map("cart_items")
}

model Favorite {
  id        Int      @id @default(autoincrement())
  userId    String   @map("user_id")
  productId Int      @map("product_id")
  createdAt DateTime @default(now()) @map("created_at")
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@map("favorites")
}

model ShirtType {
  id          Int      @id @default(autoincrement())
  name        String   // e.g. เสื้อยืด, เสื้อโปโล, เสื้อฮู้ด
  code        String   @unique // e.g. TSHIRT, POLO, HOODIE
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("shirt_types")
}

model ShirtSize {
  id          Int      @id @default(autoincrement())
  name        String   // e.g. S, M, L, XL
  code        String   @unique // e.g. S, M, L, XL
  chestSize   String?  // e.g. อก 38"
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("shirt_sizes")
}

model ShirtQuality {
  id          Int      @id @default(autoincrement())
  name        String   // e.g. Cotton 100%, Semi-Premium, Premium
  description String?  // e.g. ผ้าหนานุ่ม สกรีนพรีเมียม
  price       Int      @default(0) // Extra price adjustment
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("shirt_qualities")
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
