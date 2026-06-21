"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Server, Users, CreditCard, Shield, Image as ImageIcon } from 'lucide-react';

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
      '#architecture, #roles, #transactions, #security'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'architecture', title: 'โครงสร้างสถาปัตยกรรม' },
    { id: 'roles', title: 'ระบบสมาชิกและสิทธิ์' },
    { id: 'transactions', title: 'ระบบธุรกรรม' },
    { id: 'security', title: 'ความปลอดภัย' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">ข้อมูลระบบ (Systems)</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
            <span className="ml-1 opacity-50">▼</span>
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          เอกสารส่วนนี้จะอธิบายถึงการทำงานเบื้องหลังของแพลตฟอร์ม ครอบคลุมตั้งแต่โครงสร้างสถาปัตยกรรม การแบ่งระดับผู้ใช้งาน ไปจนถึงระบบความปลอดภัยของข้อมูล
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="architecture">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            1. โครงสร้างสถาปัตยกรรม (Architecture)
          </h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            แพลตฟอร์มของเราพัฒนาขึ้นด้วยเทคโนโลยีเว็บสมัยใหม่ เพื่อให้สามารถรองรับผู้ใช้งานจำนวนมาก และทำงานได้อย่างรวดเร็ว:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>Frontend:</strong> พัฒนาด้วย Next.js และ React มอบประสบการณ์ใช้งานที่ราบรื่น (Single Page Application feel) พร้อมการทำ Server-Side Rendering (SSR) เพื่อประสิทธิภาพด้าน SEO</li>
            <li><strong>Styling:</strong> ใช้ Tailwind CSS ในการออกแบบ UI ให้มีความสวยงาม ทันสมัย และรองรับทุกขนาดหน้าจอ (Responsive Design)</li>
            <li><strong>Database:</strong> จัดการฐานข้อมูลผ่าน Prisma ORM เชื่อมต่อกับระบบฐานข้อมูลเชิงสัมพันธ์ที่มีความเสถียรสูง</li>
            <li><strong>Storage:</strong> ระบบจัดเก็บไฟล์รูปภาพ (ลายสกรีน) บน Cloud Storage ที่มีการจัดการแคชภาพระดับสูงเพื่อให้โหลดเร็ว</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="roles">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            2. ระบบสมาชิกและสิทธิ์ (Roles & Permissions)
          </h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ระบบแบ่งระดับผู้ใช้งานออกเป็น 3 กลุ่มหลัก เพื่อความปลอดภัยและการเข้าถึงฟีเจอร์ที่แตกต่างกัน:
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
              <h3 className="font-semibold text-[#ededed] mb-2">1. ผู้ใช้ทั่วไป (Buyer)</h3>
              <p className="text-sm text-[#a1a1aa]">สามารถเลือกลายเสื้อ สร้างลายสกรีนของตนเอง จัดการตะกร้าสินค้า และติดตามสถานะคำสั่งซื้อได้</p>
            </div>
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
              <h3 className="font-semibold text-[#ededed] mb-2">2. นักออกแบบ (Creator)</h3>
              <p className="text-sm text-[#a1a1aa]">มี Dashboard พิเศษสำหรับจัดการร้านค้า อัปโหลดผลงาน กำหนดส่วนแบ่งรายได้ (Markup) และกดเบิกถอนรายได้</p>
            </div>
            <div className="p-4 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
              <h3 className="font-semibold text-[#ededed] mb-2">3. ผู้ดูแลระบบ (Admin)</h3>
              <p className="text-sm text-[#a1a1aa]">ควบคุมภาพรวมของแพลตฟอร์ม อนุมัติการถอนเงิน จัดการปัญหา (Disputes) และตรวจสอบการละเมิดลิขสิทธิ์</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="transactions">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-400" />
            3. ระบบธุรกรรม (Transactions)
          </h2>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ตะกร้าสินค้าอัจฉริยะ:</strong> คำนวณราคาสินค้า ค่าสกรีน และค่าจัดส่งแบบ Real-time โดยแยกแยะรายการสินค้าระหว่างเสื้อ Custom และเสื้อจาก Marketplace</li>
            <li><strong>Payment Gateway:</strong> เชื่อมต่อกับระบบชำระเงินที่ได้มาตรฐานระดับสากล รองรับทั้ง PromptPay และบัตรเครดิต โดยไม่เก็บข้อมูลบัตรไว้ในเซิร์ฟเวอร์ของเรา</li>
            <li><strong>Wallet & Payout:</strong> ระบบกระเป๋าเงินดิจิทัลสำหรับ Creator คำนวณรายได้สะสมอัตโนมัติเมื่อสินค้าถูกจัดส่ง และบันทึกประวัติการเบิกจ่ายทุกรายการ</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="security">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-400" />
            4. ความปลอดภัย (Security)
          </h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ความมั่นคงปลอดภัยของข้อมูลผู้ใช้และทรัพย์สินทางปัญญาเป็นสิ่งที่เราให้ความสำคัญสูงสุด:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>Data Encryption:</strong> การส่งผ่านข้อมูลทุกชนิดถูกเข้ารหัสผ่านโปรโตคอล HTTPS (SSL/TLS) รหัสผ่านของผู้ใช้งานจะถูกทำ Hashing ก่อนบันทึกลงฐานข้อมูล</li>
            <li><strong>Artwork Protection:</strong> ไฟล์ต้นฉบับความละเอียดสูงที่นักออกแบบอัปโหลด จะถูกจัดเก็บใน Private Storage ที่เข้าถึงได้เฉพาะเซิร์ฟเวอร์การผลิตเท่านั้น หน้าเว็บจะแสดงเพียงไฟล์ตัวอย่าง (Preview) ที่ถูกลดความละเอียดและใส่ลายน้ำ (Watermark) หากจำเป็น</li>
            <li><strong>Authentication:</strong> ระบบยืนยันตัวตนและการจัดการ Session ผ่าน JWT (JSON Web Tokens) ที่มีอายุการใช้งานจำกัด เพื่อป้องกันการสวมรอย</li>
          </ul>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-[#ededed] flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          เนื้อหาในหน้านี้
        </h4>
        <ul className="space-y-2.5 border-l border-[#27272a]">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`pl-4 relative flex items-center transition-colors ${
                    isActive ? 'text-[#ededed]' : 'text-[#a1a1aa] hover:text-[#ededed]'
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
