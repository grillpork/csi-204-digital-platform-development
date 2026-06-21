"use client";

import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';

const BuyersGuide = () => {
  const [activeId, setActiveId] = useState('how-to-order');

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
      '#how-to-order, #image-prep, #size-guide, #shipping'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'how-to-order', title: 'วิธีการสั่งซื้อ' },
    { id: 'image-prep', title: 'การเตรียมไฟล์ภาพ' },
    { id: 'size-guide', title: 'ตารางไซส์เสื้อ' },
    { id: 'shipping', title: 'การจัดส่งและการชำระเงิน' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">คู่มือสำหรับลูกค้า</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
            <span className="ml-1 opacity-50">▼</span>
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          เรียนรู้วิธีการสั่งสกรีนเสื้อออนไลน์ การเลือกขนาดเสื้อ และคำแนะนำสำหรับการเตรียมไฟล์ภาพ เพื่อให้ได้เสื้อสกรีนที่สวยงามและตรงตามความต้องการของคุณ
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="how-to-order">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">1. วิธีการสั่งซื้อ</h2>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-decimal list-inside">
            <li>เลือกรูปแบบเสื้อยืดที่คุณต้องการ เช่น เสื้อคอกลม เสื้อโอเวอร์ไซส์ หรือเสื้อทรงครอป</li>
            <li>เลือกสีเสื้อที่เหมาะกับลายสกรีนของคุณ โดยพิจารณาถึงความกลมกลืนหรือความโดดเด่นของสีภาพ</li>
            <li>อัปโหลดไฟล์ภาพของคุณ หรือเลือกจากลายเสื้อใน Marketplace ที่นักออกแบบของเราได้สร้างสรรค์ไว้</li>
            <li>จัดวางตำแหน่งและปรับขนาดของลายสกรีนบนเสื้อตามต้องการ</li>
            <li>ตรวจสอบไซส์และจำนวนที่ต้องการสั่งซื้อ จากนั้นกดปุ่มชำระเงิน</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="image-prep">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">2. การเตรียมไฟล์ภาพ</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            เพื่อให้งานสกรีนออกมาคมชัดและมีคุณภาพสูงที่สุด กรุณาปฏิบัติตามคำแนะนำต่อไปนี้:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ประเภทไฟล์:</strong> แนะนำให้ใช้ไฟล์ `.PNG` ที่มีการลบพื้นหลัง (Transparent Background) ออกแล้วเท่านั้น</li>
            <li><strong>ความละเอียด (Resolution):</strong> ควรกำหนดที่อย่างน้อย <strong>300 DPI</strong> หรือมีขนาดพิกเซลขั้นต่ำ 2000x2000 px</li>
            <li><strong>โหมดสี:</strong> ควรบันทึกไฟล์ด้วยโหมดสี <strong>CMYK</strong> หรือ <strong>sRGB</strong> เพื่อให้สีที่สกรีนออกมาใกล้เคียงกับหน้าจอมากที่สุด</li>
            <li>หลีกเลี่ยงการใช้ภาพที่เบลอ แตก หรือภาพที่ดึงมาจากโซเชียลมีเดียที่ถูกลดทอนคุณภาพ</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="size-guide">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">3. ตารางไซส์เสื้อ (Size Guide)</h2>
          <div className="overflow-x-auto rounded-lg border border-[#27272a] bg-[#1a1a1a] mb-4">
            <table className="w-full text-sm text-left text-[#a1a1aa]">
              <thead className="text-xs uppercase bg-[#27272a] text-[#ededed]">
                <tr>
                  <th className="px-6 py-3">ไซส์ (Size)</th>
                  <th className="px-6 py-3">รอบอก (นิ้ว)</th>
                  <th className="px-6 py-3">ความยาว (นิ้ว)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                <tr><td className="px-6 py-4">S</td><td className="px-6 py-4">34"</td><td className="px-6 py-4">25"</td></tr>
                <tr><td className="px-6 py-4">M</td><td className="px-6 py-4">38"</td><td className="px-6 py-4">27"</td></tr>
                <tr><td className="px-6 py-4">L</td><td className="px-6 py-4">42"</td><td className="px-6 py-4">29"</td></tr>
                <tr><td className="px-6 py-4">XL</td><td className="px-6 py-4">46"</td><td className="px-6 py-4">30"</td></tr>
                <tr><td className="px-6 py-4">2XL</td><td className="px-6 py-4">50"</td><td className="px-6 py-4">31"</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="shipping">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">4. การจัดส่งและการชำระเงิน</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            <strong>ช่องทางการชำระเงิน:</strong> เรารองรับการชำระเงินผ่านบัตรเครดิต/เดบิต, พร้อมเพย์ (PromptPay), และการโอนเงินผ่านธนาคาร
          </p>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            <strong>ระยะเวลาการผลิตและจัดส่ง:</strong>
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li>กระบวนการผลิตและสกรีนเสื้อจะใช้เวลาประมาณ 2-4 วันทำการ (ขึ้นอยู่กับคิวงาน)</li>
            <li>ระยะเวลาจัดส่งโดยบริษัทขนส่งเอกชน (Kerry / J&T / Flash) ใช้เวลา 1-3 วันทำการ ทั่วประเทศ</li>
            <li>หลังจากสินค้าถูกจัดส่ง คุณจะได้รับอีเมลหรือข้อความ SMS แจ้งหมายเลข Tracking เพื่อติดตามสถานะสินค้า</li>
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

export default BuyersGuide;
