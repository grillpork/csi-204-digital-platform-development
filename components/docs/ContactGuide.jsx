"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';

const ContactGuide = () => {
  const [activeId, setActiveId] = useState('support');

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
      '#support, #office, #social'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'support', title: 'แจ้งปัญหาและช่วยเหลือ' },
    { id: 'office', title: 'ที่ตั้งสำนักงาน' },
    { id: 'social', title: 'ช่องทางโซเชียลมีเดีย' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">ติดต่อเรา</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
            <span className="ml-1 opacity-50">▼</span>
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          หากคุณมีข้อสงสัย พบปัญหาการใช้งาน หรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถติดต่อทีมงานของเราได้ตามช่องทางด้านล่างนี้
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="support">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">1. ฝ่ายบริการลูกค้า (Customer Support)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a] flex items-start gap-4">
              <div className="p-2.5 bg-[#27272a] rounded-lg text-[#ededed]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-1">LINE Official</h3>
                <p className="text-sm text-[#a1a1aa] mb-2">สอบถามและติดตามสถานะรวดเร็วที่สุด</p>
                <a href="#" className="text-sm font-medium text-blue-400 hover:underline">@DigitalPlatform</a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a] flex items-start gap-4">
              <div className="p-2.5 bg-[#27272a] rounded-lg text-[#ededed]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-1">อีเมล (Email)</h3>
                <p className="text-sm text-[#a1a1aa] mb-2">สำหรับข้อเสนอแนะและปัญหาทางเทคนิค</p>
                <a href="mailto:support@example.com" className="text-sm font-medium text-blue-400 hover:underline">support@example.com</a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a] flex items-start gap-4">
              <div className="p-2.5 bg-[#27272a] rounded-lg text-[#ededed]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-1">เบอร์โทรศัพท์</h3>
                <p className="text-sm text-[#a1a1aa] mb-2">เวลาทำการ จ.-ศ. 09:00 - 18:00 น.</p>
                <a href="tel:021234567" className="text-sm font-medium text-blue-400 hover:underline">02-123-4567</a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="office">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">2. ที่ตั้งสำนักงาน</h2>
          
          <div className="p-6 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 text-[#ededed] mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-2">บริษัท ดิจิทัล แพลตฟอร์ม จำกัด</h3>
                <p className="text-[15px] leading-7 text-[#a1a1aa]">
                  123/45 ถนนพัฒนาการ แขวงสวนหลวง<br />
                  เขตสวนหลวง กรุงเทพมหานคร 10250
                </p>
              </div>
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

export default ContactGuide;
