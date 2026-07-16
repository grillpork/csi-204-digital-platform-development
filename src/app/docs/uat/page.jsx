"use client";

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Shield, User, Settings, Check, X } from 'lucide-react';

const initialCases = [
  // 1. Authentication & Profile
  { id: "UAT-AUTH-01", category: "Authentication", persona: "Customer", name: "สมัครสมาชิกใหม่ (Register)", status: "pass", desc: "กรอกข้อมูล ชื่อ อีเมล รหัสผ่าน และสมัครสมาชิกสำเร็จ" },
  { id: "UAT-AUTH-02", category: "Authentication", persona: "Customer", name: "เข้าสู่ระบบ (Login)", status: "pass", desc: "เข้าสู่ระบบด้วยอีเมลและรหัสผ่านสำเร็จพร้อมได้รับ Session Token" },
  { id: "UAT-AUTH-03", category: "Authentication", persona: "Customer", name: "แก้ไขข้อมูลโปรไฟล์ (Edit Profile)", status: "pass", desc: "เปลี่ยนแปลงข้อมูลส่วนตัว ที่อยู่จัดส่ง และเบอร์โทรศัพท์สำเร็จ" },
  { id: "UAT-AUTH-04", category: "Authentication", persona: "Customer", name: "ออกจากระบบ (Logout)", status: "pass", desc: "กดออกจากระบบและเคลียร์ประวัติ Token ใน Cookie สำเร็จ" },
  { id: "UAT-AUTH-05", category: "Authentication", persona: "Customer", name: "ตรวจสอบความยาวรหัสผ่าน (Password validation)", status: "pass", desc: "ระบบปฏิเสธการสมัครสมาชิกเมื่อกรอกรหัสผ่านสั้นกว่า 6 ตัวอักษร" },
  { id: "UAT-AUTH-06", category: "Authentication", persona: "Customer", name: "ตรวจสอบอีเมลซ้ำในระบบ (Duplicate Email check)", status: "pass", desc: "ระบบแสดงข้อความแจ้งเตือนข้อผิดพลาดเมื่อสมัครสมาชิกด้วยอีเมลที่มีอยู่แล้ว" },
  { id: "UAT-AUTH-07", category: "Authentication", persona: "Customer", name: "รักษาสิทธิ์เซสชัน (Remember Session)", status: "pass", desc: "เมื่อปิดเบราว์เซอร์แล้วกลับมาเปิดใหม่ เซสชันยังคงใช้งานได้โดยไม่ต้องล็อกอินใหม่" },
  { id: "UAT-AUTH-08", category: "Authentication", persona: "Customer", name: "การขอรหัสผ่านใหม่ (Reset Password request)", status: "pass", desc: "การกู้คืนบัญชีผู้ใช้งานผ่านการส่งอีเมลลิงก์เปลี่ยนรหัสผ่านใหม่" },

  // 2. Customer / Buyer Flow
  { id: "UAT-BUY-01", category: "Buyer Flow", persona: "Customer", name: "ค้นหาและกรองรายการสินค้า (Search & Filter)", status: "pass", desc: "ค้นหาด้วยคีย์เวิร์ด และกรองประเภทเสื้อ ไซส์ และสีสำเร็จ" },
  { id: "UAT-BUY-02", category: "Buyer Flow", persona: "Customer", name: "แสดงรายละเอียดสินค้า (Product Details)", status: "pass", desc: "คลิกเข้าดูราคา สี ไซส์ และคลังคงเหลือของสินค้าแต่ละชิ้น" },
  { id: "UAT-BUY-03", category: "Buyer Flow", persona: "Customer", name: "เพิ่มสินค้าในตะกร้า (Add to Cart)", status: "pass", desc: "ระบุจำนวนและตัวเลือกเสื้อแล้วเพิ่มลงตะกร้าของสมาชิกสำเร็จ" },
  { id: "UAT-BUY-04", category: "Buyer Flow", persona: "Customer", name: "จัดการตะกร้าสินค้า (Cart Management)", status: "fail", desc: "สคริปต์ Unit Test ล้มเหลวจากการเช็ค Assertion: API ตะกร้าคืนค่าขนาด (size) และสี (color) เพิ่มเติมซึ่งอยู่นอกเหนือการตรวจสอบของ Test Script เดิม" },
  { id: "UAT-BUY-05", category: "Buyer Flow", persona: "Customer", name: "สั่งซื้อและชำระเงิน (Checkout & Payment)", status: "pass", desc: "ยืนยันออเดอร์ เลือกวิธีสแกน QR PromptPay และสร้างรายการคำสั่งซื้อ" },
  { id: "UAT-BUY-06", category: "Buyer Flow", persona: "Customer", name: "ติดตามสถานะสินค้า (Order Tracking)", status: "pass", desc: "ตรวจสอบสถานะพัสดุและรหัสติดตามขนส่ง (Tracking Number)" },
  { id: "UAT-BUY-07", category: "Buyer Flow", persona: "Customer", name: "ระบบบันทึกรายการที่ชอบ (Favorites)", status: "pass", desc: "กดบันทึกสินค้าลงในรายการโปรดเพื่อเรียกดูภายหลัง" },
  { id: "UAT-BUY-08", category: "Buyer Flow", persona: "Customer", name: "การบล็อกสั่งซื้อไม่ล็อกอิน (Guest Cart Restriction)", status: "pass", desc: "ระบบแจ้งเตือนให้ผู้ใช้งานล็อกอินเมื่อกดเพิ่มสินค้าตะกร้าขณะไม่ได้เข้าใช้งาน" },
  { id: "UAT-BUY-09", category: "Buyer Flow", persona: "Customer", name: "กรองสินค้าตามระดับราคา (Filter by Price range)", status: "pass", desc: "กรองและเรียงลำดับสินค้าจากราคาต่ำสุดไปสูงสุดสำเร็จ" },
  { id: "UAT-BUY-10", category: "Buyer Flow", persona: "Customer", name: "แก้ไขที่อยู่ระหว่างสั่งสินค้า (Change Shipping Info)", status: "pass", desc: "ผู้ซื้อสามารถกรอกที่อยู่ใหม่และเปลี่ยนข้อมูลติดต่อขณะทำรายการ Checkout" },
  { id: "UAT-BUY-11", category: "Buyer Flow", persona: "Customer", name: "ระบบจัดการบัตรปฏิเสธ (Payment Failure handling)", status: "pass", desc: "แจ้งข้อความแจ้งเตือนเมื่อวงเงินไม่พอหรือกรอกหมายเลขบัตรเครดิตผิดพลาด" },
  { id: "UAT-BUY-12", category: "Buyer Flow", persona: "Customer", name: "ยกเลิกคำสั่งซื้อค้างชำระ (Cancel Pending Order)", status: "pass", desc: "ผู้ซื้อยกเลิกใบสั่งซื้อที่สถานะ Pending ได้ด้วยตนเองก่อนทำการจ่ายเงิน" },

  // 3. Custom Design Studio
  { id: "UAT-DSGN-01", category: "Design Studio", persona: "Customer", name: "อัปโหลดภาพลายสกรีน (Upload Logo)", status: "fail", desc: "สคริปต์ Unit Test ของระบบอัปโหลดล้มเหลว: .env เชื่อม R2 จริง ไฟล์ถูกส่งขึ้น Cloudflare R2 ทำให้เทสแบบออฟไลน์หาไฟล์ในเครื่องไม่เจอ" },
  { id: "UAT-DSGN-02", category: "Design Studio", persona: "Customer", name: "ปรับแต่งภาพบนเสื้อ (Canvas Manipulation)", status: "pass", desc: "ใช้เครื่องมือลาก ย่อ-ขยาย หรือเปลี่ยนขนาดภาพบนตำแหน่งของเสื้อยืด" },
  { id: "UAT-DSGN-03", category: "Design Studio", persona: "Customer", name: "เลือกสกรีนหน้าหลัง (Print Side Selection)", status: "pass", desc: "เลือกตำแหน่งสกรีนด้านหน้า ด้านหลัง หรือทั้งสองด้านสำเร็จ" },
  { id: "UAT-DSGN-04", category: "Design Studio", persona: "Customer", name: "บันทึกแบบร่างดีไซน์ (Save Design)", status: "pass", desc: "จัดเก็บรูปแบบเสื้อที่ออกแบบเองสำเร็จเพื่อรอการสั่งซื้อ" },
  { id: "UAT-DSGN-05", category: "Design Studio", persona: "Customer", name: "การครอบตัดภาพลายสกรีน (Easy Crop Tool)", status: "pass", desc: "การเลือกส่วนเฉพาะของภาพอาร์ตเวิร์คและตัดส่วนที่ไม่จำเป็นก่อนวางลงแบบเสื้อ" },
  { id: "UAT-DSGN-06", category: "Design Studio", persona: "Customer", name: "ระบบกรองไฟล์รูปภาพห้ามอัปโหลด (Unsupported files)", status: "pass", desc: "ปฏิเสธไฟล์เอกสารหรือไฟล์ภาพสกุลอื่นๆ ที่ไม่ใช่ PNG / JPG" },
  { id: "UAT-DSGN-07", category: "Design Studio", persona: "Customer", name: "จำกัดขนาดภาพอัปโหลด (Max File Size validation)", status: "pass", desc: "แจ้งเตือนเมื่อภาพอัปโหลดมีขนาดเกินกว่า 10MB เพื่อป้องกันข้อมูลล้นระบบ" },
  { id: "UAT-DSGN-08", category: "Design Studio", persona: "Customer", name: "รีเซ็ตตัวแบบร่างภาพ (Reset Design Canvas)", status: "pass", desc: "การกดปุ่ม Reset เพื่อลบล้างลายออกและกลับมาจำลองเสื้อเปล่าเริ่มต้นใหม่" },

  // 4. Creator / Seller
  { id: "UAT-CRTR-01", category: "Creator Flow", persona: "Staff", name: "สมัครสิทธิ์เป็น Creator (Apply Creator)", status: "pass", desc: "ส่งเอกสารและข้อมูลยืนยันตัวตนเพื่อขอเปิดหน้าร้านจำหน่ายดีไซน์" },
  { id: "UAT-CRTR-02", category: "Creator Flow", persona: "Staff", name: "อัปโหลดลายจำหน่ายใหม่ (Publish Design)", status: "pass", desc: "อัปโหลดงานศิลปะ ตั้งชื่อ และคำอธิบายสำหรับขึ้นขายในตลาดกลาง" },
  { id: "UAT-CRTR-03", category: "Creator Flow", persona: "Staff", name: "กำหนดส่วนต่างกำไร (Set Markup Profit)", status: "pass", desc: "ระบุค่า Markup ส่วนแบ่งรายได้เพื่อคำนวณราคาจำหน่ายหน้าร้านค้า" },
  { id: "UAT-CRTR-04", category: "Creator Flow", persona: "Staff", name: "ดูรายงานยอดขายส่วนตัว (Earnings Report)", status: "pass", desc: "ตรวจสอบสถิติจำนวนชิ้นที่ขายได้ รายได้รวม และยอดถอนสะสม" },
  { id: "UAT-CRTR-05", category: "Creator Flow", persona: "Staff", name: "จัดการโปรไฟล์หน้าร้าน (Shop Customization)", status: "pass", desc: "แก้ไขชื่อร้าน รูปหน้าปก และรายละเอียดร้านค้าของ Creator" },
  { id: "UAT-CRTR-06", category: "Creator Flow", persona: "Staff", name: "ดูสถานะอนุมัติผลงาน (Approval status track)", status: "pass", desc: "แสดงผลข้อมูลสถานะการตรวจสอบดีไซน์จากผู้ดูแลระบบอย่างชัดเจน (Approved/Rejected)" },
  { id: "UAT-CRTR-07", category: "Creator Flow", persona: "Staff", name: "ตรวจสอบยอดถอนขั้นต่ำ (Min withdrawal check)", status: "pass", desc: "แสดงข้อความระบบแจ้งปฏิเสธการโอนเงินถอนเมื่อยอดเงินไม่ถึงขั้นต่ำ 100 บาท" },
  { id: "UAT-CRTR-08", category: "Creator Flow", persona: "Staff", name: "แก้ไขส่วนแบ่ง Markup ภายหลัง (Edit Markup)", status: "pass", desc: "นักออกแบบสามารถเข้าไปแก้ไขราคาบวกเพิ่มของแบบร่างเดิมที่ขายไปแล้วได้สำเร็จ" },

  // 5. Staff Operation
  { id: "UAT-STAF-01", category: "Staff Operation", persona: "Staff", name: "ตรวจสอบออเดอร์ผลิต (Review Print Orders)", status: "pass", desc: "ดึงรายการสั่งซื้อเสื้อสกรีนของลูกค้าเพื่อส่งให้โรงงานเตรียมสกรีน" },
  { id: "UAT-STAF-02", category: "Staff Operation", persona: "Staff", name: "อัปเดตสถานะจัดส่ง (Update Shipping Status)", status: "pass", desc: "เปลี่ยนสถานะเป็น Shipped และกรอก Tracking ID ให้ลูกค้าทราบ" },
  { id: "UAT-STAF-03", category: "Staff Operation", persona: "Staff", name: "จัดการสต็อกวัตถุดิบ (Inventory Stock)", status: "pass", desc: "เพิ่ม/ลดจำนวนเสื้อยืดสีพื้นประเภทต่าง ๆ ในฐานข้อมูลคลัง" },
  { id: "UAT-STAF-04", category: "Staff Operation", persona: "Staff", name: "ค้นหารายการใบสั่งซื้อ (Order Search by ID)", status: "pass", desc: "พิมพ์รหัสออเดอร์หรือชื่อผู้ใช้เพื่อดึงรายการใบชำระเงินมาตรวจสอบ" },
  { id: "UAT-STAF-05", category: "Staff Operation", persona: "Staff", name: "ดาวน์โหลดไฟล์สกรีนคมชัด (High-Res Download)", status: "pass", desc: "ระบบอนุญาตให้เฉพาะ Staff ดาวน์โหลดไฟล์ภาพโลโก้ความละเอียดสูงไปสั่งพิมพ์ลงเสื้อจริง" },

  // 6. Admin Control
  { id: "UAT-ADMN-01", category: "Admin Control", persona: "Manager", name: "ตรวจสอบผลงานสกรีน (Design Moderation)", status: "pass", desc: "อนุมัติหรือปฏิเสธแบบลายเสื้อของ Creator เพื่อควบคุมเรื่องลิขสิทธิ์" },
  { id: "UAT-ADMN-02", category: "Admin Control", persona: "Manager", name: "จัดการรายการสินค้าหลัก (Catalog Management)", status: "pass", desc: "เพิ่ม แก้ไข หรือยกเลิกสินค้าต้นแบบ (Base Products) ของระบบ" },
  { id: "UAT-ADMN-03", category: "Admin Control", persona: "Manager", name: "ตรวจสอบรายงานการเงิน (Platform Financials)", status: "pass", desc: "ดูรายงานสรุปรายได้สะสมของบริษัท และอัตราส่วนแบ่งของนักออกแบบ" },
  { id: "UAT-ADMN-04", category: "Admin Control", persona: "Manager", name: "ตรวจสอบสถิติผู้ใช้งาน (User Analytics Dashboard)", status: "pass", desc: "ดูจำนวนผู้ใช้ใหม่ ยอดสั่งซื้อรวม และข้อมูลสถิติบน Dashboard หลัก" },
  { id: "UAT-ADMN-05", category: "Admin Control", persona: "Manager", name: "ระงับการใช้งานบัญชี (Suspend user account)", status: "pass", desc: "ผู้จัดการสามารถระงับสิทธิ์บัญชีผู้ใช้หรือร้านค้าที่ละเมิดกฎแพลตฟอร์มได้ทันที" }
];

export default function UatPage() {
  const [testCases, setTestCases] = useState(initialCases);
  const [activeTab, setActiveTab] = useState("All");

  const toggleStatus = (id) => {
    setTestCases(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === "pass" ? "fail" : "pass" };
      }
      return item;
    }));
  };

  const filteredCases = activeTab === "All" 
    ? testCases 
    : testCases.filter(c => c.category === activeTab);

  const passCount = testCases.filter(c => c.status === "pass").length;
  const totalCount = testCases.length;
  const passPercentage = Math.round((passCount / totalCount) * 100);

  const categories = ["All", "Authentication", "Buyer Flow", "Design Studio", "Creator Flow", "Staff Operation", "Admin Control"];

  const getPersonaColor = (persona) => {
    switch (persona) {
      case "Customer": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Staff": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Manager": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPersonaIcon = (persona) => {
    switch (persona) {
      case "Customer": return (
        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      );
      case "Staff": return (
        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      );
      case "Manager": return (
        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          บันทึกการทดสอบระบบแบบ UAT (User Acceptance Testing)
        </h1>
        <p className="text-[15px] leading-7 text-slate-500 max-w-3xl">
          รายละเอียดและผลลัพธ์การทดสอบระบบ The Shirtsy ครอบคลุมการทำงานทุกส่วนการทำงานหลัก (Full System UAT) ซึ่งรวมถึงระบบลงทะเบียนผู้ใช้, ตะกร้าสินค้า, หน้าต่างปรับแต่งลายเสื้อ (Custom Studio), ตลาดกลางนักเขียนดีไซน์ (Creator Marketplace), ส่วนงานเจ้าหน้าที่ และแดชบอร์ดรายงานการเงินของผู้จัดการ
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">เคสที่ผ่านการทดสอบ</span>
            <span className="text-2xl font-bold text-slate-950">{passCount} / {totalCount} เคส</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <div className="text-lg font-bold">{passPercentage}%</div>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">เปอร์เซ็นต์ความสำเร็จ</span>
            <span className="text-2xl font-bold text-slate-950">Success Rate</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">ปัญหาที่พบ (Issues)</span>
            <span className="text-2xl font-bold text-slate-950">{totalCount - passCount} เคส</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
        {categories.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab === "All" ? "ทั้งหมด" : tab}
          </button>
        ))}
      </div>

      {/* UAT Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">รหัสทดสอบ</th>
                <th className="py-4 px-6">กลุ่มผู้ใช้งาน</th>
                <th className="py-4 px-6">รายการทดสอบ</th>
                <th className="py-4 px-6 text-center">สถานะการทดสอบ</th>
                <th className="py-4 px-6">วัตถุประสงค์ / คำอธิบายการทดสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm">
              {filteredCases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-semibold text-slate-900">{item.id}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${getPersonaColor(item.persona)}`}>
                      {getPersonaIcon(item.persona)}
                      {item.persona}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        item.status === "pass"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-rose-500 text-white hover:bg-rose-600"
                      }`}
                    >
                      {item.status === "pass" ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {item.status === "pass" ? "ผ่าน" : "ไม่ผ่าน"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs leading-relaxed">
                    {item.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
