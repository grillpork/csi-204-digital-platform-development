"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Server, Users, CreditCard, Shield, Database, Cloud, Code } from 'lucide-react';

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
      '#architecture, #database, #roles, #transactions, #security'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'architecture', title: '1. โครงสร้างสถาปัตยกรรม (Architecture)' },
    { id: 'database', title: '2. โครงสร้างข้อมูล (Database & Storage)' },
    { id: 'roles', title: '3. ระบบสิทธิ์และการจัดการผู้ใช้ (Roles & Auth)' },
    { id: 'transactions', title: '4. ระบบการเงินและคำสั่งซื้อ (Transactions)' },
    { id: 'security', title: '5. มาตรฐานความปลอดภัย (Security)' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">ข้อมูลเชิงเทคนิคระบบ (System Overview)</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          เอกสารส่วนนี้มีไว้สำหรับผู้ที่สนใจศึกษาการทำงานเบื้องหลัง (Under the Hood) ของแพลตฟอร์ม The Shirtsy ครอบคลุมตั้งแต่ Tech Stack สถาปัตยกรรมระบบคลาวด์ การจัดการฐานข้อมูล ไปจนถึงโปรโตคอลความปลอดภัยที่ใช้ปกป้องข้อมูลผู้ใช้งาน
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="architecture">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            1. โครงสร้างสถาปัตยกรรม (Architecture)
          </h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            แพลตฟอร์มของเราถูกออกแบบให้รองรับการขยายตัว (Scalable) ด้วยสถาปัตยกรรม Serverless และ Modern Web Stack:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Frontend (Client-side)</h3>
              </div>
              <ul className="text-sm text-[#a1a1aa] space-y-2 list-disc pl-4">
                <li><strong>Framework:</strong> Next.js (App Router) สำหรับทำ Server-Side Rendering (SSR) เพื่อประสิทธิภาพด้าน SEO และความเร็วในการโหลด</li>
                <li><strong>UI Library:</strong> React.js ควบคู่กับ Tailwind CSS สร้างดีไซน์ที่ทันสมัย Responsive และรองรับ Dark Mode</li>
                <li><strong>State Management:</strong> ใช้ Zustand จัดการ Global State เช่น ข้อมูลตะกร้าสินค้า ข้อมูลผู้ใช้</li>
                <li><strong>Interactive Tool:</strong> ใช้ React Easy Crop และ HTML Canvas ในหน้าระบบ Custom Design ให้ออกแบบเสื้อได้ไหลลื่นบนเบราว์เซอร์</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Backend (Server-side)</h3>
              </div>
              <ul className="text-sm text-[#a1a1aa] space-y-2 list-disc pl-4">
                <li><strong>API Architecture:</strong> สร้าง RESTful API ผ่าน Next.js Route Handlers (Edge & Node.js Runtimes)</li>
                <li><strong>Authentication:</strong> ระบบ Custom JWT Auth และ NextAuth สำหรับการเข้าสู่ระบบอย่างปลอดภัย</li>
                <li><strong>Deployment:</strong> โฮสต์บน Vercel พร้อมเครือข่าย CDN กระจายทั่วโลก ทำให้เข้าถึงเว็บไซต์ได้รวดเร็ว</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="database">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Database className="w-6 h-6 text-pink-400" />
            2. โครงสร้างข้อมูล (Database & Storage)
          </h2>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>Database Engine:</strong> เราใช้ PostgreSQL บนแพลตฟอร์ม Neon Serverless Postgres ที่มีความยืดหยุ่นสูง รองรับการสเกลเมื่อมีทราฟฟิกเข้ามาจำนวนมาก (เช่น ช่วงจัดแคมเปญลดราคา)</li>
            <li><strong>ORM Layer:</strong> จัดการ Schema และคิวรีข้อมูลด้วย Prisma ORM ช่วยลดข้อผิดพลาดเรื่อง Data Type และป้องกัน SQL Injection</li>
            <li><strong>Media Storage:</strong> ไฟล์ภาพทั้งหมด ไม่ว่าจะเป็นรูปโปรไฟล์, อาร์ตเวิร์คของ Creator, หรือภาพที่ลูกค้าอัปโหลดเข้ามาทำ Custom Print จะถูกเก็บแยกบน Cloud Object Storage (เช่น AWS S3 / Cloudinary) เพื่อไม่ให้เป็นภาระของเซิร์ฟเวอร์หลัก</li>
            <li><strong>Image Optimization:</strong> ระบบจะย่อขนาดและแปลงฟอร์แมตภาพเป็น WebP อัตโนมัติเมื่อแสดงผลหน้าเว็บ เพื่อประหยัด Bandwidth</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="roles">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            3. ระบบสิทธิ์และการจัดการผู้ใช้ (Roles & Auth)
          </h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ระบบแบ่งระดับผู้ใช้งาน (RBAC - Role Based Access Control) ออกเป็น 3 ระดับหลัก:
          </p>
          <div className="space-y-4">
            <div className="p-4 border-l-2 border-green-500 bg-[#1a1a1a] rounded-r-xl">
              <h3 className="font-semibold text-white mb-1">Customer (ลูกค้าทั่วไป)</h3>
              <p className="text-sm text-[#a1a1aa]">เข้าถึงหน้าหลัก, เลือกซื้อสินค้า, สร้างเสื้อ Custom, จัดการตะกร้า/ที่อยู่จัดส่ง, และดูประวัติคำสั่งซื้อของตนเอง</p>
            </div>
            <div className="p-4 border-l-2 border-blue-500 bg-[#1a1a1a] rounded-r-xl">
              <h3 className="font-semibold text-white mb-1">Creator (นักออกแบบ)</h3>
              <p className="text-sm text-[#a1a1aa]">ได้รับสิทธิ์ของ Customer ทั้งหมด พร้อมปลดล็อกเมนู Creator Dashboard จัดการหน้าร้านค้า, อัปโหลดลายใหม่, และตั้งค่า Markup / บัญชีรับเงิน</p>
            </div>
            <div className="p-4 border-l-2 border-red-500 bg-[#1a1a1a] rounded-r-xl">
              <h3 className="font-semibold text-white mb-1">Administrator (ผู้ดูแลระบบ)</h3>
              <p className="text-sm text-[#a1a1aa]">เข้าถึงระบบหลังบ้าน (Admin Panel) จัดการสถานะออเดอร์, อนุมัติการเปิดร้านของ Creator, แบนผู้ใช้งานที่ละเมิดกฎ, และจัดการการเงินของระบบทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="transactions">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            4. ระบบการเงินและคำสั่งซื้อ (Transactions)
          </h2>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>Stateful Cart:</strong> ตะกร้าสินค้าถูกจัดการ State ทั้งใน Local Storage (เพื่อให้ผู้ใช้ยังเห็นของในตะกร้าแม้ออกจากเว็บ) และ Sync เข้า Database เมื่อผู้ใช้ Login</li>
            <li><strong>Payment Integration:</strong> เชื่อมต่อ API ของ Payment Gateway เพื่อความปลอดภัยสูงสุด รองรับ Webhook เพื่ออัปเดตสถานะออเดอร์เป็น "ชำระเงินสำเร็จ" ทันทีที่ระบบธนาคารยืนยัน (Real-time Sync)</li>
            <li><strong>Revenue Splitting System:</strong> ทุกครั้งที่มีการสั่งซื้อเสื้อจากหมวด Marketplace ระบบจะบันทึก Transaction แยกสองฝั่ง คือ "ยอดรวมสำหรับบริษัท" และ "ส่วนแบ่ง Markup สำหรับ Creator" ซึ่งเงินจะเข้ากระเป๋า Creator อัตโนมัติเมื่อสถานะออเดอร์เปลี่ยนเป็น "จัดส่งแล้ว"</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-12 pt-4" id="security">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-400" />
            5. มาตรฐานความปลอดภัย (Security)
          </h2>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#27272a]">
            <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
              เราตระหนักถึงความปลอดภัยของข้อมูลส่วนบุคคล (PDPA) และทรัพย์สินทางปัญญา จึงมีมาตรการดังนี้:
            </p>
            <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
              <li><strong>Password Hashing:</strong> รหัสผ่านของผู้ใช้งานทั้งหมดจะถูก Hash ด้วยอัลกอริทึม <code className="bg-black px-1 py-0.5 rounded text-pink-300">bcrypt</code> ที่มี Salting จำนวนหลายรอบ (Cost factor) ทีมงานไม่สามารถรู้รหัสผ่านเดิมของคุณได้</li>
              <li><strong>CSRF & XSS Protection:</strong> เฟรมเวิร์ก Next.js และ React จัดการกรองข้อมูล Input เพื่อป้องกันการโจมตีประเภท Cross-Site Scripting อัตโนมัติ</li>
              <li><strong>Artwork Protection:</strong> เพื่อป้องกันการละเมิดลิขสิทธิ์ ไฟล์ดีไซน์ความละเอียดสูงจะถูกเก็บไว้ในโฟลเดอร์ปิดของ Storage ที่เข้าถึงได้เฉพาะระบบ Backend เพื่อการผลิตเท่านั้น ผู้เข้าชมเว็บจะเห็นและสามารถเซฟได้เพียงภาพ Preview ที่มีความละเอียดต่ำและมีลายน้ำทับอยู่</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-[#ededed] flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          หัวข้อทางเทคนิค
        </h4>
        <ul className="space-y-2.5 border-l border-[#27272a]">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`pl-4 relative flex items-center transition-colors ${
                    isActive ? 'text-[#ededed] font-medium' : 'text-[#a1a1aa] hover:text-[#ededed]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-[-2.5px] top-1/2 -translate-y-1/2 w-1 h-1 bg-[#ededed] rounded-full rotate-45 transform"></div>
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
