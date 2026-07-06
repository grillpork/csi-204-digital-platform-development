"use client";

import React, { useState } from 'react';
import { Send, Key, ShoppingCart, Upload, Store, User, BookOpen, ChevronRight, CreditCard, ShieldAlert } from 'lucide-react';

const apiGroups = [
  {
    id: "auth",
    name: "Authentication (ระบบสมาชิก)",
    icon: Key,
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/register",
        desc: "ลงทะเบียนสมาชิกใหม่ในระบบ (Customer / Creator)",
        body: { email: "user@example.com", password: "password123", name: "John Doe" },
        res: { message: "ลงทะเบียนเสร็จสมบูรณ์", userId: "cuid-12345" }
      },
      {
        method: "POST",
        path: "/api/auth/login",
        desc: "เข้าสู่ระบบเพื่อรับ Session Token ทาง HTTP-Only Cookie",
        body: { email: "user@example.com", password: "password123" },
        res: { success: true }
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        desc: "ออกจากระบบและเคลียร์ Session Token",
        body: null,
        res: { success: true }
      }
    ]
  },
  {
    id: "user",
    name: "User Profiles (ข้อมูลสมาชิก)",
    icon: User,
    endpoints: [
      {
        method: "GET",
        path: "/api/user/profile",
        desc: "ดึงข้อมูลส่วนตัวของผู้ใช้ปัจจุบันที่เข้าสู่ระบบอยู่",
        body: null,
        res: { user: { id: "cuid...", name: "John Doe", email: "user@example.com", phone: "0812345678", address: "123 Main St...", role: "Customer" } }
      },
      {
        method: "PATCH",
        path: "/api/user/profile",
        desc: "แก้ไขข้อมูลส่วนตัว ที่อยู่ และตรวจสอบเบอร์โทรศัพท์ (10 หลักขึ้นต้นด้วย 0)",
        res: { user: { name: "Johnathan Doe", phone: "0812345678", address: "456 Sukhumvit Rd..." } }
      }
    ]
  },
  {
    id: "products",
    name: "Products (สินค้าและดีไซน์สาธารณะ)",
    icon: BookOpen,
    endpoints: [
      {
        method: "GET",
        path: "/api/products",
        desc: "ดึงรายการสินค้าเสื้อยืดทั้งหมดที่ผ่านการอนุมัติและวางขายทั่วไป",
        body: null,
        res: { success: true, data: [{ id: 1, name: "เสื้อยืดคลาสสิก", price: 370, images: ["/img..."] }] }
      },
      {
        method: "GET",
        path: "/api/products/[id]",
        desc: "ดึงรายละเอียดสินค้าชิ้นที่กำหนดแยกตามรหัส ID",
        body: null,
        res: { success: true, data: { id: 1, name: "เสื้อยืดคลาสสิก", price: 370, colors: ["White", "Black"] } }
      }
    ]
  },
  {
    id: "cart",
    name: "Shopping Cart (ตะกร้าสินค้า)",
    icon: ShoppingCart,
    endpoints: [
      {
        method: "GET",
        path: "/api/cart",
        desc: "ดึงรายการสินค้าในตะกร้าช็อปปิ้งของผู้ใช้ปัจจุบัน",
        body: null,
        res: { data: [{ id: 10, productId: 1, quantity: 2, size: "M", color: "White" }] }
      },
      {
        method: "POST",
        path: "/api/cart",
        desc: "เพิ่มรายการสินค้าลงในตะกร้า หรืออัปเดตจำนวนสินค้า",
        res: { success: true, data: [{ productId: 1, quantity: 2 }] }
      },
      {
        method: "DELETE",
        path: "/api/cart/[productId]?size=M&color=White",
        desc: "ลบสินค้าชิ้นย่อยที่ระบุไซส์และสีออกจากตะกร้า",
        body: null,
        res: { success: true, data: [] }
      },
      {
        method: "DELETE",
        path: "/api/cart",
        desc: "ล้างสินค้าทั้งหมดในตะกร้าของผู้ใช้",
        body: null,
        res: { success: true }
      }
    ]
  },
  {
    id: "custom-designs",
    name: "Customizer & Designs (การออกแบบเสื้อ)",
    icon: Upload,
    endpoints: [
      {
        method: "POST",
        path: "/api/custom-upload",
        desc: "อัปโหลดภาพลายสกรีนดิบ (PNG/JPG) เพื่อบันทึกเข้าเซิร์ฟเวอร์",
        body: "FormData (designImage: File)",
        res: { imageUrl: "/uploads/file-name.png" }
      },
      {
        method: "POST",
        path: "/api/designs",
        desc: "บันทึกแบบเสื้อยืดที่ประกอบเสร็จใหม่ (is_custom: true, status: DRAFT)",
        body: { name: "ลายแมวกวัก", baseProductId: 1, color: "White", sizes: ["M", "L"], overlay_image: "/uploads/f.png", overlay_position_x: 150, overlay_position_y: 200, overlay_size: 120, printSide: "front", screenSize: "A4", printTechnique: "DFT" },
        res: { data: { id: 5, name: "ลายแมวกวัก", approvalStatus: "DRAFT" } }
      },
      {
        method: "PATCH",
        path: "/api/designs",
        desc: "แก้ไขรายละเอียดแบบร่างการออกแบบเสื้อผ้า",
        body: { id: 5, name: "ลายแมวกวัก (แก้ไข)", color: "Black" },
        res: { data: { id: 5, name: "ลายแมวกวัก (แก้ไข)" } }
      },
      {
        method: "POST",
        path: "/api/designs/submit",
        desc: "ส่งร่างแบบเสื้อให้แอดมินตรวจสอบเพื่อเปิดการวางขาย (PENDING)",
        body: { id: 5 },
        res: { data: { id: 5, approvalStatus: "PENDING" } }
      },
      {
        method: "DELETE",
        path: "/api/designs/submit",
        desc: "ถอนคำขอที่กำลังรออนุมัติให้กลับเป็นแบบร่าง (DRAFT)",
        body: { id: 5 },
        res: { data: { id: 5, approvalStatus: "DRAFT" } }
      }
    ]
  },
  {
    id: "checkout",
    name: "Checkout & Omise (การชำระเงิน)",
    icon: CreditCard,
    endpoints: [
      {
        method: "POST",
        path: "/api/checkout",
        desc: "เริ่มทำรายการสั่งซื้อ หักสต็อก และเรียกเก็บเงินผ่าน Omise (รองรับ card / transfer)",
        body: { paymentMethod: "transfer", shippingAddress: "123 Main St...", cardToken: "tokn_test..." },
        res: { success: true, qrCodeUrl: "https://api.omise.co...", authorizeUri: "https://..." }
      },
      {
        method: "POST",
        path: "/api/webhooks/omise",
        desc: "Webhook รับการแจ้งเตือนจาก Omise เมื่อลูกค้าแสกนจ่ายเงินเรียบร้อยแล้ว",
        body: { key: "charge.complete", data: { id: "chrg_test..." } },
        res: { received: true, verified: true }
      }
    ]
  },
  {
    id: "admin",
    name: "Admin Backend (ระบบหลังบ้านแอดมิน)",
    icon: Store,
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/designs",
        desc: "ดึงรายการออกแบบ Custom ทั้งหมดเพื่อตรวจคุณภาพ",
        body: null,
        res: { data: [{ id: 5, name: "ลายแมวกวัก", approvalStatus: "PENDING" }] }
      },
      {
        method: "PATCH",
        path: "/api/admin/designs",
        desc: "อนุมัติเปิดขายพร้อมกำหนดราคาขาย/สต็อก หรือปฏิเสธพร้อมระบุเหตุผล",
        body: { id: 5, status: "APPROVED", price: 390, stock: 100 },
        res: { data: { id: 5, approvalStatus: "APPROVED", price: 390 } }
      },
      {
        method: "DELETE",
        path: "/api/admin/designs",
        desc: "ลบรายการลายออกแบบออกจากระบบ (ลบไฟล์และฐานข้อมูล)",
        body: { id: 5 },
        res: { success: true }
      }
    ]
  }
];

export default function ApiDocsPage() {
  const [selectedGroup, setSelectedGroup] = useState("auth");

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case "GET": return "bg-blue-50 text-blue-700 border-blue-200";
      case "POST": return "bg-green-50 text-green-700 border-green-200";
      case "PATCH": return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const activeGroup = apiGroups.find(g => g.id === selectedGroup);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">รายการจุดเชื่อมต่อระบบ (API Routes)</h1>
        <p className="text-[15px] leading-7 text-slate-500 max-w-2xl">
          เอกสารอธิบาย Endpoint และโครงสร้างข้อมูลการรับส่งค่าของ API แต่ละเส้นบนระบบ The Shirtsy สำหรับนักพัฒนา
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side Tabs */}
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-4 lg:pb-0">
          {apiGroups.map((group) => {
            const Icon = group.icon;
            const isActive = selectedGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all text-left w-full border ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border-blue-100 shadow-sm" 
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{group.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Endpoint List */}
        <div className="flex-1 w-full space-y-6">
          {activeGroup.endpoints.map((ep, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
              {/* Endpoint Header */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-extrabold border rounded-lg font-mono ${getMethodBadgeClass(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono font-bold text-slate-900 break-all">{ep.path}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">{ep.desc}</span>
              </div>

              {/* Payload/Response Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/10">
                {/* Request Body */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Request Body</h4>
                  {ep.body ? (
                    <pre className="bg-slate-900 text-blue-400 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-60 leading-relaxed">
                      {JSON.stringify(ep.body, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-xs text-slate-400 py-2 italic">ไม่มีข้อมูล Body ใน HTTP Request</div>
                  )}
                </div>

                {/* Example Response */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expected Response</h4>
                  <pre className="bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-60 leading-relaxed">
                    {JSON.stringify(ep.res, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
