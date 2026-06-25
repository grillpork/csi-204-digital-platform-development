"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Mail, MessageCircle, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

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
      '#support, #office, #social, #business'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'support', title: '1. ฝ่ายบริการลูกค้า (Customer Support)' },
    { id: 'business', title: '2. ติดต่อธุรกิจ (Business & Partnership)' },
    { id: 'social', title: '3. ช่องทางโซเชียลมีเดีย' },
    { id: 'office', title: '4. ที่ตั้งสำนักงาน' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">ติดต่อเรา (Contact Us)</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          ทีมงาน The Shirtsy ยินดีให้บริการและพร้อมช่วยเหลือคุณเสมอ! หากคุณมีข้อสงสัย พบปัญหาการใช้งาน สนใจสั่งทำเสื้อทีมจำนวนมาก หรือต้องการร่วมงานกับเราในฐานะพาร์ทเนอร์ สามารถติดต่อทีมงานตามช่องทางด้านล่างนี้ได้เลยครับ
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="support">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">1. ฝ่ายบริการลูกค้า (Customer Support)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ติดต่อสอบถามเกี่ยวกับการสั่งซื้อ การจัดส่ง การแจ้งเคลมสินค้า หรือแจ้งปัญหาการใช้งานเว็บไซต์:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a] flex items-start gap-4 hover:border-blue-500/50 transition-colors">
              <div className="p-2.5 bg-[#27272a] rounded-lg text-green-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-1">LINE Official Account</h3>
                <p className="text-sm text-[#a1a1aa] mb-2">สอบถามและติดตามสถานะรวดเร็วที่สุด (มีแอดมินตอบ 09:00 - 22:00 น.)</p>
                <a href="#" className="text-sm font-medium text-blue-400 hover:underline">@TheShirtsySupport</a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a] flex items-start gap-4 hover:border-blue-500/50 transition-colors">
              <div className="p-2.5 bg-[#27272a] rounded-lg text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-1">อีเมล (Email)</h3>
                <p className="text-sm text-[#a1a1aa] mb-2">สำหรับแจ้งปัญหาทางเทคนิคและส่งหลักฐานการเคลมสินค้า</p>
                <a href="mailto:support@theshirtsy.com" className="text-sm font-medium text-blue-400 hover:underline">support@theshirtsy.com</a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a] flex items-start gap-4 md:col-span-2 hover:border-blue-500/50 transition-colors">
              <div className="p-2.5 bg-[#27272a] rounded-lg text-red-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-1">สายด่วนบริการลูกค้า (Call Center)</h3>
                <p className="text-sm text-[#a1a1aa] mb-2">เวลาทำการ จันทร์ - ศุกร์ 09:00 - 18:00 น. (ยกเว้นวันหยุดนักขัตฤกษ์)</p>
                <a href="tel:021234567" className="text-sm font-medium text-blue-400 hover:underline">02-123-4567</a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="business">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">2. ติดต่อธุรกิจ (Business & Partnership)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            สำหรับลูกค้าองค์กร (B2B) ที่ต้องการสั่งทำเสื้อทีม เสื้อยูนิฟอร์มบริษัท หรือพาร์ทเนอร์ที่ต้องการร่วมลงทุน/ทำแคมเปญการตลาดร่วมกัน:
          </p>
          <div className="p-5 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
            <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa]">
              <li><strong>สั่งซื้อล็อตใหญ่ (Wholesale):</strong> <a href="mailto:b2b@theshirtsy.com" className="text-blue-400 hover:underline">b2b@theshirtsy.com</a></li>
              <li><strong>ติดต่อฝ่ายการตลาดและ PR:</strong> <a href="mailto:marketing@theshirtsy.com" className="text-blue-400 hover:underline">marketing@theshirtsy.com</a></li>
              <li><strong>ติดต่อเสนอโปรเจกต์ (Partnership):</strong> <a href="mailto:partner@theshirtsy.com" className="text-blue-400 hover:underline">partner@theshirtsy.com</a></li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="social">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">3. ช่องทางโซเชียลมีเดีย</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ติดตามข่าวสาร โปรโมชั่นพิเศษ และไอเดียการแต่งตัว/ออกแบบลายเสื้อใหม่ๆ ได้ที่ช่องทางโซเชียลมีเดียของเรา:
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-blue-500 hover:border-blue-500 transition-colors">
              <Facebook className="w-4 h-4" /> Facebook
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-pink-500 hover:border-pink-500 transition-colors">
              <Instagram className="w-4 h-4" /> Instagram
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#27272a] rounded-full text-[#a1a1aa] hover:text-blue-400 hover:border-blue-400 transition-colors">
              <Twitter className="w-4 h-4" /> Twitter (X)
            </a>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="office">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">4. ที่ตั้งสำนักงานและศูนย์ผลิต</h2>
          <div className="p-6 rounded-xl border border-[#27272a] bg-[#1a1a1a]">
            <div className="flex items-start gap-4">
              <div className="p-2 text-white bg-[#27272a] rounded-lg mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ededed] mb-2">บริษัท The Shirtsy (Thailand) จำกัด</h3>
                <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
                  123/45 ถนนพัฒนาการ แขวงสวนหลวง<br />
                  เขตสวนหลวง กรุงเทพมหานคร 10250
                </p>
                <div className="text-sm text-gray-500 italic">
                  * หมายเหตุ: เราให้บริการในรูปแบบออนไลน์ 100% ไม่มีหน้าร้านสำหรับลองไซส์เสื้อหรือสั่งซื้อผ่านหน้าโรงงานครับ
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-[#ededed] flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          หัวข้อการติดต่อ
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

export default ContactGuide;
