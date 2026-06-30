"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Server, Users, CreditCard, Shield, Database, Cloud, Code, GitCommit } from 'lucide-react';

const SystemGuide = () => {
  const [activeId, setActiveId] = useState('architecture');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -70% 0px' }
    );

    const sections = document.querySelectorAll(
      '#architecture, #database, #roles, #transactions, #security, #sequence'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Initialize mermaid on client side after rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mermaid) {
      window.mermaid.contentLoaded();
    }
  }, []);

  const toc = [
    { id: 'architecture', title: '1. โครงสร้างสถาปัตยกรรม (Architecture)' },
    { id: 'database', title: '2. โครงสร้างข้อมูล (Database & Storage)' },
    { id: 'roles', title: '3. ระบบสิทธิ์และการจัดการผู้ใช้ (Roles & Auth)' },
    { id: 'transactions', title: '4. ระบบการเงินและคำสั่งซื้อ (Transactions)' },
    { id: 'security', title: '5. มาตรฐานความปลอดภัย (Security)' },
    { id: 'sequence', title: '6. ลำดับการทำงาน (Sequence Diagram)' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full bg-white text-slate-800">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">ข้อมูลเชิงเทคนิคระบบ (System Overview)</h1>
        </div>
        
        <p className="text-[15px] leading-7 text-slate-500 mb-10">
          เอกสารส่วนนี้มีไว้สำหรับผู้ที่สนใจศึกษาการทำงานเบื้องหลัง (Under the Hood) ของแพลตฟอร์ม The Shirtsy ครอบคลุมตั้งแต่ Tech Stack สถาปัตยกรรมระบบคลาวด์ การจัดการฐานข้อมูล ไปจนถึงโปรโตคอลความปลอดภัยที่ใช้ปกป้องข้อมูลผู้ใช้งาน
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="architecture">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-600" />
            1. โครงสร้างสถาปัตยกรรม (Architecture)
          </h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            แพลตฟอร์มของเราถูกออกแบบให้รองรับการขยายตัว (Scalable) ด้วยสถาปัตยกรรม Serverless และ Modern Web Stack:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-800">Frontend (Client-side)</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                <li><strong>Framework:</strong> Next.js (App Router) สำหรับทำ Server-Side Rendering (SSR) เพื่อประสิทธิภาพด้าน SEO และความเร็วในการโหลด</li>
                <li><strong>UI Library:</strong> React.js ควบคู่กับ Tailwind CSS สร้างดีไซน์ที่ทันสมัย Responsive และรองรับ Dark Mode</li>
                <li><strong>State Management:</strong> ใช้ Zustand จัดการ Global State เช่น ข้อมูลตะกร้าสินค้า ข้อมูลผู้ใช้</li>
                <li><strong>Interactive Tool:</strong> ใช้ React Easy Crop และ HTML Canvas ในหน้าระบบ Custom Design ให้ออกแบบเสื้อได้ไหลลื่นบนเบราว์เซอร์</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-5 h-5 text-sky-500" />
                <h3 className="font-semibold text-slate-800">Backend (Server-side)</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                <li><strong>API Architecture:</strong> สร้าง RESTful API ผ่าน Next.js Route Handlers (Edge & Node.js Runtimes)</li>
                <li><strong>Authentication:</strong> ระบบ Custom JWT Auth และ NextAuth สำหรับการเข้าสู่ระบบอย่างปลอดภัย</li>
                <li><strong>Deployment:</strong> โฮสต์บน Vercel พร้อมเครือข่าย CDN กระจายทั่วโลก ทำให้เข้าถึงเว็บไซต์ได้รวดเร็ว</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="database">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <Database className="w-6 h-6 text-pink-500" />
            2. โครงสร้างข้อมูล (Database & Storage)
          </h2>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>Database Engine:</strong> เราใช้ PostgreSQL บนแพลตฟอร์ม Neon Serverless Postgres ที่มีความยืดหยุ่นสูง รองรับการสเกลเมื่อมีทราฟฟิกเข้ามาจำนวนมาก (เช่น ช่วงจัดแคมเปญลดราคา)</li>
            <li><strong>ORM Layer:</strong> จัดการ Schema และคิวรีข้อมูลด้วย Prisma ORM ช่วยลดข้อผิดพลาดเรื่อง Data Type และป้องกัน SQL Injection</li>
            <li><strong>Media Storage:</strong> ไฟล์ภาพทั้งหมด ไม่ว่าจะเป็นรูปโปรไฟล์, อาร์ตเวิร์คของ Creator, หรือภาพที่ลูกค้าอัปโหลดเข้ามาทำ Custom Print จะถูกเก็บแยกบน Cloud Object Storage (เช่น AWS S3 / Cloudinary) เพื่อไม่ให้เป็นภาระของเซิร์ฟเวอร์หลัก</li>
            <li><strong>Image Optimization:</strong> ระบบจะย่อขนาดและแปลงฟอร์แมตภาพเป็น WebP อัตโนมัติเมื่อแสดงผลหน้าเว็บ เพื่อประหยัด Bandwidth</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="roles">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            3. ระบบสิทธิ์และการจัดการผู้ใช้ (Roles & Auth)
          </h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ระบบแบ่งระดับผู้ใช้งาน (RBAC - Role Based Access Control) ออกเป็น 3 ระดับหลัก:
          </p>
          <div className="space-y-4">
            <div className="p-4 border-l-2 border-green-500 bg-slate-50/50 rounded-r-xl">
              <h3 className="font-semibold text-slate-800 mb-1">Customer (ลูกค้าทั่วไป)</h3>
              <p className="text-sm text-slate-600">เข้าถึงหน้าหลัก, เลือกซื้อสินค้า, สร้างเสื้อ Custom, จัดการตะกร้า/ที่อยู่จัดส่ง, และดูประวัติคำสั่งซื้อของตนเอง</p>
            </div>
            <div className="p-4 border-l-2 border-blue-500 bg-slate-50/50 rounded-r-xl">
              <h3 className="font-semibold text-slate-800 mb-1">Creator (นักออกแบบ)</h3>
              <p className="text-sm text-slate-600">ได้รับสิทธิ์ของ Customer ทั้งหมด พร้อมปลดล็อกเมนู Creator Dashboard จัดการหน้าร้านค้า, อัปโหลดลายใหม่, และตั้งค่า Markup / บัญชีรับเงิน</p>
            </div>
            <div className="p-4 border-l-2 border-red-500 bg-slate-50/50 rounded-r-xl">
              <h3 className="font-semibold text-slate-800 mb-1">Administrator (ผู้ดูแลระบบ)</h3>
              <p className="text-sm text-slate-600">เข้าถึงระบบหลังบ้าน (Admin Panel) จัดการสถานะออเดอร์, อนุมัติการเปิดร้านของ Creator, แบนผู้ใช้งานที่ละเมิดกฎ, และจัดการการเงินของระบบทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="transactions">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            4. ระบบการเงินและคำสั่งซื้อ (Transactions)
          </h2>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>Stateful Cart:</strong> ตะกร้าสินค้าถูกจัดการ State ทั้งใน Local Storage (เพื่อให้ผู้ใช้ยังเห็นของในตะกร้าแม้ออกจากเว็บ) และ Sync เข้า Database เมื่อผู้ใช้ Login</li>
            <li><strong>Payment Integration:</strong> เชื่อมต่อ API ของ Payment Gateway เพื่อความปลอดภัยสูงสุด รองรับ Webhook เพื่ออัปเดตสถานะออเดอร์เป็น "ชำระเงินสำเร็จ" ทันทีที่ระบบธนาคารยืนยัน (Real-time Sync)</li>
            <li><strong>Revenue Splitting System:</strong> ทุกครั้งที่มีการสั่งซื้อเสื้อจากหมวด Marketplace ระบบจะบันทึก Transaction แยกสองฝั่ง คือ "ยอดรวมสำหรับบริษัท" และ "ส่วนแบ่ง Markup สำหรับ Creator" ซึ่งเงินจะเข้ากระเป๋า Creator อัตโนมัติเมื่อสถานะออเดอร์เปลี่ยนเป็น "จัดส่งแล้ว"</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-12 pt-4" id="security">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600" />
            5. มาตรฐานความปลอดภัย (Security)
          </h2>
          <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200">
            <p className="text-[15px] leading-7 text-slate-600 mb-4">
              เราตระหนักถึงความปลอดภัยของข้อมูลส่วนบุคคล (PDPA) และทรัพย์สินทางปัญญา จึงมีมาตรการดังนี้:
            </p>
            <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
              <li><strong>Password Hashing:</strong> รหัสผ่านของผู้ใช้งานทั้งหมดจะถูก Hash ด้วยอัลกอริทึม <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-pink-600">bcrypt</code> ที่มี Salting จำนวนหลายรอบ (Cost factor) ทีมงานไม่สามารถรู้รหัสผ่านเดิมของคุณได้</li>
              <li><strong>CSRF & XSS Protection:</strong> เฟรมเวิร์ก Next.js และ React จัดการกรองข้อมูล Input เพื่อป้องกันการโจมตีประเภท Cross-Site Scripting อัตโนมัติ</li>
              <li><strong>Artwork Protection:</strong> เพื่อป้องกันการละเมิดลิขสิทธิ์ ไฟล์ดีไซน์ความละเอียดสูงจะถูกเก็บไว้ในโฟลเดอร์ปิดของ Storage ที่เข้าถึงได้เฉพาะระบบ Backend เพื่อการผลิตเท่านั้น ผู้เข้าชมเว็บจะเห็นและสามารถเซฟได้เพียงภาพ Preview ที่มีความละเอียดต่ำและมีลายน้ำทับอยู่</li>
            </ul>
          </div>
        </div>

        {/* Section 6: Sequence Diagram */}
        <div className="mb-12 pt-4" id="sequence">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-indigo-600" />
            6. ลำดับการทำงานของระบบ (Sequence Diagram)
          </h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-6">
            แผนภาพแสดงลำดับขั้นตอนการทำงาน (Sequence Diagram) ของระบบ Marketplace ขายลายเสื้อแบบ Print-on-Demand ตั้งแต่ขั้นตอนแรกที่นักออกแบบเข้าสู่ระบบ จนถึงขั้นตอนสุดท้ายที่ระบบจัดส่งพัสดุและทำรายการถอนเงิน:
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200">
              <span className="font-semibold text-slate-800 text-sm">Marketplace Workflows (Mermaid Diagram)</span>
            </div>
            <div className="p-6 overflow-x-auto bg-slate-50/30">
              <div className="mermaid">
{`sequenceDiagram
    title Marketplace สำหรับขายลายเสื้อแบบ Print-on-Demand

    actor Designer as นักออกแบบ
    actor Customer as ลูกค้า

    participant Website as เว็บไซต์ E-Commerce
    participant Auth as ระบบยืนยันตัวตน
    participant Artwork as ระบบจัดการลายเสื้อ
    participant Printing as ระบบจัดการแพ็กเกจสกรีน
    participant Pricing as ระบบประเมินราคา
    participant Revenue as ระบบคำนวณส่วนแบ่งรายได้
    participant Product as ระบบสินค้า
    participant Cart as ระบบตะกร้าสินค้า
    participant Order as ระบบคำสั่งซื้อ
    participant Payment as ระบบชำระเงิน
    participant Production as ระบบการผลิต
    participant Inventory as ระบบคลังสินค้า
    participant Shipping as ระบบขนส่ง
    participant Withdraw as ระบบถอนเงิน
    participant KYC as ระบบ KYC
    participant DB as ฐานข้อมูล


        Note over Designer,Website: นักออกแบบเข้าสู่ระบบ

        Designer->>Website: เข้าสู่ระบบ
        Website->>DB: ตรวจสอบข้อมูลผู้ใช้
        DB-->>Website: ข้อมูลผู้ใช้
        Website-->>Designer: เข้าสู่ระบบสำเร็จ

        Note over Designer: สามารถลงผลงานได้ทันที<br/>ยังไม่ต้องยืนยันตัวตน



        Note over Designer,Artwork: อัปโหลดลายเสื้อ

        Designer->>Website: อัปโหลดลายเสื้อ
        Website->>Artwork: ตรวจสอบไฟล์
        Artwork->>Artwork: ตรวจสอบประเภทไฟล์
        Artwork->>Artwork: ตรวจสอบความละเอียด
        Artwork->>Artwork: ตรวจสอบขนาดรูป
        Artwork->>DB: บันทึกลายเสื้อ
        DB-->>Artwork: สำเร็จ
        Artwork-->>Website: อัปโหลดสำเร็จ



        Note over Designer,Printing: เลือกแพ็กเกจการสกรีน

        Designer->>Website: เลือก DTF / DTG
        Website->>Printing: ส่งข้อมูลแพ็กเกจ
        Printing-->>Website: ข้อมูลต้นทุน



        Note over Website,Pricing: ประเมินราคาขาย

        Website->>Pricing: ประเมินราคาสินค้า
        Pricing->>Pricing: วิเคราะห์ต้นทุนเสื้อ
        Pricing->>Pricing: วิเคราะห์การสกรีน
        Pricing->>Pricing: วิเคราะห์คุณภาพไฟล์
        Pricing->>Pricing: วิเคราะห์ข้อมูลตลาด
        Pricing->>Pricing: คำนวณราคาขาย
        Pricing-->>Website: ราคาขายที่เหมาะสม

        Website->>Revenue: คำนวณส่วนแบ่งรายได้
        Revenue-->>Website: รายได้ต่อการขาย

        Website-->>Designer: แสดงราคาขายและรายได้



        Note over Designer,Product: เผยแพร่สินค้า

        Designer->>Website: เผยแพร่สินค้า
        Website->>Product: สร้างสินค้า
        Product->>DB: บันทึกสินค้า
        DB-->>Product: สำเร็จ
        Product-->>Website: พร้อมจำหน่าย
        Website-->>Designer: เผยแพร่สำเร็จ



        Note over Customer,Payment: ลูกค้าซื้อสินค้า

        Customer->>Website: ค้นหาสินค้า
        Website->>Product: ดึงข้อมูลสินค้า
        Product->>DB: อ่านข้อมูลสินค้า
        DB-->>Product: รายการสินค้า
        Product-->>Website: ส่งข้อมูลสินค้า
        Website-->>Customer: แสดงสินค้า

        Customer->>Website: เพิ่มลงตะกร้า
        Website->>Cart: เพิ่มสินค้า
        Cart->>DB: บันทึกตะกร้า

        Customer->>Website: Checkout
        Website->>Order: สร้างคำสั่งซื้อ
        Order->>DB: บันทึกคำสั่งซื้อ

        Order->>Payment: ขอชำระเงิน
        Payment-->>Customer: แสดงช่องทางชำระเงิน
        Customer->>Payment: ยืนยันการชำระ
        Payment-->>Order: ชำระเงินสำเร็จ



        Note over Production,Shipping: การผลิตและจัดส่ง

        Order->>Production: ส่งคำสั่งผลิต
        Production->>Inventory: ตรวจสอบสต็อกเสื้อ
        Inventory-->>Production: พร้อมผลิต

        Production->>Production: พิมพ์ลาย
        Production->>Production: ตรวจสอบคุณภาพ
        Production->>Production: บรรจุสินค้า

        Production->>Shipping: ขอจัดส่ง
        Shipping->>DB: บันทึกเลข Tracking
        DB-->>Shipping: Tracking Number
        Shipping-->>Order: แจ้งเลขพัสดุ
        Order-->>Customer: แจ้งหมายเลขติดตามสินค้า



        Note over Designer,KYC: ถอนเงินและยืนยันตัวตน

        Designer->>Website: ขอถอนเงิน
        Website->>Withdraw: ตรวจสอบสถานะ KYC
        Withdraw->>DB: ตรวจสอบข้อมูลผู้ใช้

        alt ยังไม่ยืนยันตัวตน
            DB-->>Withdraw: ยังไม่ผ่าน
            Withdraw-->>Website: ต้องยืนยันตัวตน
            Website-->>Designer: แสดงหน้าอัปโหลดเอกสาร

            Designer->>Website: ส่งบัตรประชาชนและบัญชีธนาคาร
            Website->>KYC: ตรวจสอบข้อมูล
            KYC->>DB: บันทึกผลการตรวจสอบ
            DB-->>KYC: ผ่าน
            KYC-->>Website: ยืนยันตัวตนสำเร็จ
        else ยืนยันแล้ว
            DB-->>Withdraw: ผ่านแล้ว
        end

        Website->>Withdraw: ดำเนินการถอนเงิน
        Withdraw->>DB: บันทึกธุรกรรม
        DB-->>Withdraw: สำเร็จ
        Withdraw-->>Website: ถอนเงินสำเร็จ
        Website-->>Designer: แจ้งผลการถอนเงิน`}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-slate-900 flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          หัวข้อทางเทคนิค
        </h4>
        <ul className="space-y-2.5 border-l border-slate-200">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`pl-4 relative flex items-center transition-colors ${
                    isActive ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-[-2.5px] top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-800 rounded-full rotate-45 transform"></div>
                  )}
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

    </div>
  );
};

export default SystemGuide;
