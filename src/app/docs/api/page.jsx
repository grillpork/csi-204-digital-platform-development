"use client";

import React, { useState } from 'react';
import { Send, Key, ShoppingCart, Upload, Store, User, BookOpen, ChevronRight, Copy } from 'lucide-react';

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
        res: { message: "ลงทะเบียนเสร็จสมบูรณ์", userId: 123 }
      },
      {
        method: "POST",
        path: "/api/auth/login",
        desc: "เข้าสู่ระบบและรับ JWT Token หรือตั้งค่าเซสชัน",
        body: { email: "user@example.com", password: "password123" },
        res: { success: true, token: "eyJhbGciOiJIUzI1NiIsInR..." }
      }
    ]
  },
  {
    id: "products",
    name: "Products (ข้อมูลสินค้า)",
    icon: BookOpen,
    endpoints: [
      {
        method: "GET",
        path: "/api/products",
        desc: "ดึงรายการสินค้าเสื้อยืดทั้งหมดบน Marketplace (รองรับการกรองตามหมวดหมู่/ขนาด/สี)",
        body: null,
        res: { data: [{ id: 1, name: "Minimalist T-Shirt", price: 350, image: "url..." }] }
      },
      {
        method: "POST",
        path: "/api/products",
        desc: "ลงทะเบียนสร้างรายการสินค้าใหม่ (เฉพาะผู้ดูแลระบบและ Creators)",
        body: { name: "Custom Graphic Tee", price: 390, category: "T-Shirt", image: "temp-url..." },
        res: { success: true, productId: 88 }
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
        res: { items: [{ productId: "1-Black-M", quantity: 2, price: 350 }] }
      },
      {
        method: "POST",
        path: "/api/cart",
        desc: "เพิ่มหรือปรับปรุงรายการสินค้าลงในตะกร้า",
        body: { productId: "1-Black-M", quantity: 1 },
        res: { success: true, totalItems: 3 }
      },
      {
        method: "DELETE",
        path: "/api/cart/[productId]",
        desc: "ลบสินค้าชิ้นที่ระบุออกจากตะกร้า",
        body: null,
        res: { success: true, message: "ลบสินค้าในตะกร้าแล้ว" }
      }
    ]
  },
  {
    id: "custom-upload",
    name: "Custom Designs (ระบบสั่งสกรีนเสื้อ)",
    icon: Upload,
    endpoints: [
      {
        method: "POST",
        path: "/api/custom-upload",
        desc: "อัปโหลดรูปภาพอาร์ตเวิร์คและส่งพิกัดตำแหน่งสกรีนเพื่อสร้างคำสั่งซื้อ Custom",
        body: { file: "Binary/FormData", size: "A4", technique: "DFT", color: "White" },
        res: { success: true, mockupUrl: "url-to-generated-mockup...", orderId: 789 }
      }
    ]
  },
  {
    id: "seller",
    name: "Seller & Shop (ข้อมูลร้านค้า)",
    icon: Store,
    endpoints: [
      {
        method: "GET",
        path: "/api/seller/profile",
        desc: "ดึงข้อมูลโปรไฟล์ของร้านค้าและประวัติการขายของ Creator",
        body: null,
        res: { shopName: "Studio Design", totalSales: 15400, productsCount: 12 }
      },
      {
        method: "POST",
        path: "/api/seller/register",
        desc: "สมัครเปิดร้านค้า Creator และส่งข้อมูล KYC เพื่อเริ่มสะสมรายได้",
        body: { idCard: "1100xxxxxxxx", bankAccount: "123-4-56789-0", bankName: "SCB" },
        res: { status: "pending", message: "ส่งข้อมูลยืนยันตัวตนแล้ว รอการอนุมัติจากผู้ดูแล" }
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
        res: { email: "user@example.com", name: "John Doe", role: "Customer" }
      },
      {
        method: "PUT",
        path: "/api/user/profile",
        desc: "แก้ไขข้อมูลส่วนตัวและที่อยู่จัดส่ง",
        body: { name: "Johnathan Doe", address: "123 Main St, Bangkok" },
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
      case "PUT": return "bg-amber-50 text-amber-700 border-amber-200";
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

        {/* Right Side Endpoint Cards */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          <div className="border-b border-slate-100 pb-3 mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{activeGroup.name}</h2>
            <span className="text-xs text-slate-400 font-medium">
              {activeGroup.endpoints.length} Endpoints
            </span>
          </div>

          {activeGroup.endpoints.map((ep, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all shadow-sm"
            >
              {/* Endpoint Header */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <span className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-2.5 py-1 border rounded-lg ${getMethodBadgeClass(ep.method)}`}>
                  {ep.method}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-800 bg-white border border-slate-200/60 px-3 py-1 rounded-lg">
                  {ep.path}
                </span>
              </div>

              {/* Endpoint Description */}
              <p className="text-xs text-slate-600 mb-6 font-medium">
                {ep.desc}
              </p>

              {/* Request & Response Schemas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request Schema */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Request Body (JSON)</span>
                  <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto min-h-[100px] flex items-center">
                    {ep.body ? (
                      <pre className="text-xs text-blue-400 font-mono w-full">
                        {JSON.stringify(ep.body, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono italic">No Request Body</span>
                    )}
                  </div>
                </div>

                {/* Response Schema */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Success Response (JSON)</span>
                  <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto min-h-[100px]">
                    <pre className="text-xs text-green-400 font-mono w-full">
                      {JSON.stringify(ep.res, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
