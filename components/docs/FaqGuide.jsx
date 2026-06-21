"use client";

import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';

const FaqGuide = () => {
  const [activeId, setActiveId] = useState('general');

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
      '#general, #ordering, #creator-faq'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'general', title: 'คำถามทั่วไป' },
    { id: 'ordering', title: 'คำถามเกี่ยวกับการสั่งซื้อ' },
    { id: 'creator-faq', title: 'คำถามสำหรับนักออกแบบ' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">คำถามที่พบบ่อย (FAQ)</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
            <span className="ml-1 opacity-50">▼</span>
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          รวมคำถามและคำตอบที่พบบ่อยเกี่ยวกับการใช้งานแพลตฟอร์มของเรา ทั้งในมุมของลูกค้าทั่วไปและนักออกแบบ
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="general">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">1. คำถามทั่วไป</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: แพลตฟอร์มนี้ให้บริการอะไรบ้าง?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เราให้บริการระบบสั่งพิมพ์ลายเสื้อยืดออนไลน์ (Custom Print) แบบ One-stop service ตั้งแต่การเลือกเสื้อ อัปโหลดลาย และจัดส่ง นอกจากนี้ยังมี Marketplace ให้นักออกแบบสามารถนำลายเสื้อมาวางขายได้ด้วยครับ
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: คุณภาพเสื้อและงานสกรีนเป็นอย่างไร?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เราใช้เสื้อยืด Cotton 100% เกรดพรีเมียม สวมใส่สบาย ระบายอากาศได้ดี สำหรับงานสกรีนใช้เทคโนโลยี DTF (Direct to Film) และ DTG (Direct to Garment) ที่ให้สีสันคมชัดและทนทานครับ
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="ordering">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">2. คำถามเกี่ยวกับการสั่งซื้อ (สำหรับลูกค้า)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: มีขั้นต่ำในการสั่งสกรีนหรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: ไม่มีขั้นต่ำครับ! คุณสามารถสั่งสกรีนลายของคุณเองได้ตั้งแต่ 1 ตัวขึ้นไป
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: สั่งซื้อแล้วจะได้ของเมื่อไหร่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: ปกติระยะเวลาการผลิตจะอยู่ที่ 2-4 วันทำการ และจัดส่งอีก 1-3 วัน ดังนั้นคุณจะได้รับเสื้อภายใน 3-7 วันหลังจากชำระเงินเรียบร้อยแล้วครับ
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ลายสกรีนซักแล้วจะหลุดลอกไหม?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: งานสกรีนของเรามีความทนทานสูง แต่เพื่อยืดอายุการใช้งาน แนะนำให้กลับด้านเสื้อก่อนซัก ซักด้วยน้ำอุณหภูมิปกติ และหลีกเลี่ยงการรีดทับลายสกรีนโดยตรงครับ
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="creator-faq">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">3. คำถามสำหรับนักออกแบบ (Creator)</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: เปิดร้านค้าเสียค่าใช้จ่ายไหม?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เปิดร้านค้าและอัปโหลดลายฟรี! ไม่มีค่าใช้จ่ายแอบแฝงใดๆ คุณจะเสียแค่ส่วนแบ่งรายได้ตามที่ระบุในนโยบายเมื่อขายสินค้าได้เท่านั้น
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ใครเป็นคนรับผิดชอบเรื่องการผลิตและจัดส่ง?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: หน้าที่ผลิตและจัดส่งเป็นของแพลตฟอร์มทั้งหมด 100% ครับ นักออกแบบมีหน้าที่เพียงสร้างสรรค์และอัปโหลดผลงานศิลปะ เมื่อมีคำสั่งซื้อ ระบบจะจัดการส่งเสื้อให้ลูกค้าโดยอัตโนมัติ
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ฉันยังเป็นเจ้าของลิขสิทธิ์ภาพวาดที่อัปโหลดไปหรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: แน่นอนครับ! คุณยังคงเป็นเจ้าของลิขสิทธิ์ในผลงานศิลปะของคุณ 100% แพลตฟอร์มเพียงได้รับสิทธิ์ในการพิมพ์ลงบนเสื้อเพื่อจำหน่ายเท่านั้น คุณสามารถยกเลิกการวางขายได้ตลอดเวลา
              </p>
            </div>
          </div>
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

export default FaqGuide;
