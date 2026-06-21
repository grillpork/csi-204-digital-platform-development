"use client";

import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';

const CreatorsGuide = () => {
  const [activeId, setActiveId] = useState('open-store');

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
      '#open-store, #design-guidelines, #revenue-share, #payouts'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'open-store', title: 'วิธีการเปิดร้านค้า' },
    { id: 'design-guidelines', title: 'มาตรฐานการออกแบบ' },
    { id: 'revenue-share', title: 'ส่วนแบ่งรายได้' },
    { id: 'payouts', title: 'รอบการถอนเงิน' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">คู่มือสำหรับนักออกแบบ</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
            <span className="ml-1 opacity-50">▼</span>
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          คำแนะนำสำหรับการเป็น Creator ในแพลตฟอร์มของเรา ตั้งแต่การสมัครเปิดร้านค้าไปจนถึงการอัปโหลดผลงานศิลปะเพื่อสร้างรายได้
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="open-store">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">1. วิธีการเปิดร้านค้า (Creator Store)</h2>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-decimal list-inside">
            <li>สมัครสมาชิกและเข้าสู่ระบบในฐานะผู้ใช้งานทั่วไป</li>
            <li>ไปที่เมนู <strong>โปรไฟล์ส่วนตัว</strong> และเลือก <strong>สมัครเป็น Creator</strong></li>
            <li>กรอกข้อมูลที่จำเป็น เช่น ชื่อร้านค้า, ช่องทางการติดต่อ, และบัญชีธนาคารสำหรับรับเงิน</li>
            <li>อัปโหลดรูปโปรไฟล์ร้านค้าและภาพปก</li>
            <li>ระบบจะทำการตรวจสอบข้อมูลของคุณภายใน 24 ชั่วโมง เมื่อได้รับอนุมัติ คุณสามารถเริ่มอัปโหลดลายเสื้อเพื่อวางขายได้ทันที</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="design-guidelines">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">2. มาตรฐานการออกแบบ (Design Guidelines)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            เพื่อให้ลายเสื้อของคุณถูกนำไปสกรีนได้อย่างสมบูรณ์แบบ กรุณาทำตามข้อกำหนดดังนี้:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>รูปแบบไฟล์:</strong> ต้องเป็น `.PNG` พื้นหลังใส (Transparent) เท่านั้น</li>
            <li><strong>ขนาดไฟล์:</strong> อาร์ตเวิร์คควรมีขนาด กว้าง 2000px ถึง 3000px ขึ้นไป (ความละเอียดขั้นต่ำ 300 DPI)</li>
            <li><strong>โหมดสี:</strong> RGB (แพลตฟอร์มจะแปลงเป็น CMYK สำหรับการสกรีน โปรดระวังสีที่สดกว่าปกติอาจจะดรอปลงเล็กน้อยเมื่อสกรีนจริง)</li>
            <li><strong>พื้นที่ปลอดภัย (Safe Zone):</strong> ไม่ควรออกแบบลายที่ชิดขอบมากเกินไป เพื่อป้องกันการตกขอบตอนนำไปสกรีนลงบนเสื้อไซส์เล็ก</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="revenue-share">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">3. ส่วนแบ่งรายได้ (Revenue Share)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            โครงสร้างการแบ่งรายได้บน Marketplace เป็นไปตามนโยบายสนับสนุน Creator โดยนักออกแบบสามารถตั้งราคาบวกเพิ่ม (Markup) จากราคาเสื้อต้นทุนได้เอง
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ราคาต้นทุนเสื้อ + ค่าสกรีน:</strong> เป็นราคาคงที่ที่แพลตฟอร์มกำหนด (เช่น 190 บาท)</li>
            <li><strong>กำไรของนักออกแบบ (Markup):</strong> คุณสามารถกำหนดเองได้ (เช่น กำหนด 100 บาท)</li>
            <li><strong>ราคาขายหน้าเว็บ:</strong> ราคาต้นทุน + กำไรนักออกแบบ (เช่น 190 + 100 = 290 บาท)</li>
            <li>นักออกแบบจะได้รับเงินเต็มจำนวนตาม Markup ที่ตั้งไว้ ต่อการขาย 1 ตัว (อาจมีการหักค่าธรรมเนียมธุรกรรมเล็กน้อย 3-5% ขึ้นอยู่กับช่องทางการชำระเงินของลูกค้า)</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="payouts">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">4. รอบการถอนเงิน (Payouts)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ระบบจะทำการรวบรวมรายได้ของ Creator จากยอดสั่งซื้อที่มีการ <strong>จัดส่งสำเร็จและลูกค้าได้รับของแล้ว</strong> เท่านั้น
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ยอดเงินขั้นต่ำสำหรับการถอน:</strong> 500 บาทขึ้นไป</li>
            <li><strong>รอบการโอนเงินอัตโนมัติ:</strong> ทุกวันที่ 1 และ 16 ของเดือน</li>
            <li>สามารถกดคำขอถอนเงินแบบด่วน (Manual Payout) ได้ โดยใช้เวลาดำเนินการ 1-3 วันทำการ (อาจมีค่าธรรมเนียมการโอนตามเงื่อนไขของธนาคาร)</li>
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

export default CreatorsGuide;
