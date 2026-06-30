"use client";

import React, { useEffect, useState } from 'react';
import { Copy, ChevronRight } from 'lucide-react';

const Policy = () => {
  const [activeId, setActiveId] = useState('screen-printing');

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
      '#screen-printing, #marketplace, #refunds, #privacy'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'screen-printing', title: 'การสั่งสกรีนเสื้อ' },
    { id: 'marketplace', title: 'นโยบาย Marketplace' },
    { id: 'refunds', title: 'การคืนเงินและเปลี่ยนสินค้า' },
    { id: 'privacy', title: 'นโยบายความเป็นส่วนตัว' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full bg-white text-slate-800">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">นโยบายและข้อตกลง</h1>
        </div>
        
        <p className="text-[15px] leading-7 text-slate-500 mb-10">
          เอกสารนี้สรุปนโยบายและข้อตกลงสำหรับการใช้บริการสั่งสกรีนเสื้อออนไลน์และ Marketplace สำหรับขายลายเสื้อ โปรดอ่านและทำความเข้าใจก่อนใช้บริการ
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="screen-printing">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">1. เงื่อนไขการสั่งสกรีนเสื้อออนไลน์</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ผู้ใช้บริการต้องตรวจสอบความถูกต้องของไฟล์ภาพ ขนาด และสีเสื้อ ก่อนยืนยันการสั่งซื้อทุกครั้ง
          </p>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ไฟล์ภาพที่นำมาสกรีนต้องเป็นภาพที่ไม่ละเมิดลิขสิทธิ์ เครื่องหมายการค้า หรือสิทธิบัตรของบุคคลที่สาม หากเกิดข้อพิพาททางกฎหมาย ผู้สั่งสกรีนจะต้องรับผิดชอบแต่เพียงผู้เดียว
          </p>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ระยะเวลาการผลิตและจัดส่งจะขึ้นอยู่กับจำนวนและคิวงานในขณะนั้น โดยปกติจะอยู่ที่ 3-7 วันทำการ บริษัทขอสงวนสิทธิ์ในการปฏิเสธการรับงานสกรีนภาพที่มีเนื้อหาผิดกฎหมาย ลามกอนาจาร หรือสร้างความแตกแยก
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="marketplace">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">2. นโยบายสำหรับ Marketplace</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            <strong>สำหรับนักออกแบบ (Creators):</strong> ท่านสามารถเปิดร้านค้าและอัปโหลดลายเสื้อ (Template) เพื่อวางขายในแพลตฟอร์มได้ โดยผลงานนั้นต้องเป็นการสร้างสรรค์ของท่านเองและไม่ละเมิดลิขสิทธิ์ผู้อื่น
          </p>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            <strong>ส่วนแบ่งรายได้:</strong> นักออกแบบจะได้รับส่วนแบ่งรายได้ตามอัตราที่แพลตฟอร์มกำหนด ทันทีที่มีลูกค้าสั่งซื้อเสื้อพร้อมสกรีนด้วยลายของท่าน
          </p>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            <strong>การใช้งาน Template:</strong> ลูกค้าที่ซื้อลายเสื้อจาก Marketplace จะได้รับสิทธิ์ในการนำลายนั้นไปสกรีนลงบนเสื้อและผลิตผ่านระบบของเราเท่านั้น ไม่สามารถดาวน์โหลดไฟล์ภาพต้นฉบับความละเอียดสูงออกไปใช้งานภายนอกได้
          </p>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            บริษัทมีสิทธิ์ในการระงับบัญชีหรือลบผลงานที่ได้รับรายงานว่าละเมิดลิขสิทธิ์ออกจากระบบทันที โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="refunds">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">3. นโยบายการเปลี่ยนสินค้าและการคืนเงิน</h2>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li>สินค้าสั่งทำ (Custom Print) <strong>ไม่สามารถเปลี่ยนรุ่น ไซส์ หรือขอคืนเงินได้</strong> หากความผิดพลาดไม่ได้เกิดจากทางร้าน</li>
            <li>ทางร้านยินดีรับผิดชอบผลิตสินค้าชิ้นใหม่ให้ฟรี หากเกิดจากความผิดพลาดของกระบวนการผลิต เช่น สกรีนผิดลาย, เสื้อมีตำหนิชำรุด โดยต้องแจ้งให้ทางร้านทราบพร้อมหลักฐานภายใน 7 วันหลังได้รับสินค้า</li>
            <li>กรณีที่มีการอนุมัติการคืนเงิน ระบบจะทำการคืนเงินเข้าสู่ช่องทางที่ลูกค้าชำระมา ภายใน 15-30 วันทำการ</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="privacy">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">4. นโยบายความเป็นส่วนตัว (Privacy Policy)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่าน เช่น ชื่อ ที่อยู่สำหรับจัดส่ง เบอร์โทรศัพท์ ไว้เป็นความลับและใช้เพื่อวัตถุประสงค์ในการให้บริการของแพลตฟอร์มเท่านั้น
          </p>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ไฟล์ภาพที่ลูกค้าอัปโหลดเพื่อสั่งสกรีนแบบส่วนตัว (ไม่ได้ลงขายใน Marketplace) จะถูกเก็บรักษาไว้อย่างปลอดภัยและจะไม่ถูกนำไปเผยแพร่ ดัดแปลง หรือใช้งานอื่นใดโดยไม่ได้รับอนุญาต
          </p>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-slate-900 flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          เนื้อหาในหน้านี้
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

export default Policy;
