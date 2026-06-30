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
    <div className="flex flex-col xl:flex-row relative items-start w-full bg-white text-slate-800">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">ติดต่อเรา (Contact Us)</h1>
        </div>
        
        <p className="text-[15px] leading-7 text-slate-500 mb-10">
          ทีมงาน The Shirtsy ยินดีให้บริการและพร้อมช่วยเหลือคุณเสมอ! หากคุณมีข้อสงสัย พบปัญหาการใช้งาน สนใจสั่งทำเสื้อทีมจำนวนมาก หรือต้องการร่วมงานกับเราในฐานะพาร์ทเนอร์ สามารถติดต่อทีมงานตามช่องทางด้านล่างนี้ได้เลยครับ
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="support">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">1. ฝ่ายบริการลูกค้า (Customer Support)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ติดต่อสอบถามเกี่ยวกับการสั่งซื้อ การจัดส่ง การแจ้งเคลมสินค้า หรือแจ้งปัญหาการใช้งานเว็บไซต์:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4 hover:border-blue-500/50 transition-colors">
              <div className="p-2.5 bg-slate-100 rounded-lg text-green-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">LINE Official Account</h3>
                <p className="text-sm text-slate-500 mb-2">สอบถามและติดตามสถานะรวดเร็วที่สุด (มีแอดมินตอบ 09:00 - 22:00 น.)</p>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">@TheShirtsySupport</a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4 hover:border-blue-500/50 transition-colors">
              <div className="p-2.5 bg-slate-100 rounded-lg text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">อีเมล (Email)</h3>
                <p className="text-sm text-slate-500 mb-2">สำหรับแจ้งปัญหาทางเทคนิคและส่งหลักฐานการเคลมสินค้า</p>
                <a href="mailto:support@theshirtsy.com" className="text-sm font-medium text-blue-600 hover:underline">support@theshirtsy.com</a>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-4 md:col-span-2 hover:border-blue-500/50 transition-colors">
              <div className="p-2.5 bg-slate-100 rounded-lg text-red-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">สายด่วนบริการลูกค้า (Call Center)</h3>
                <p className="text-sm text-slate-500 mb-2">เวลาทำการ จันทร์ - ศุกร์ 09:00 - 18:00 น. (ยกเว้นวันหยุดนักขัตฤกษ์)</p>
                <a href="tel:021234567" className="text-sm font-medium text-blue-600 hover:underline">02-123-4567</a>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="business">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">2. ติดต่อธุรกิจ (Business & Partnership)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            สำหรับลูกค้าองค์กร (B2B) ที่ต้องการสั่งทำเสื้อทีม เสื้อยูนิฟอร์มบริษัท หรือพาร์ทเนอร์ที่ต้องการร่วมลงทุน/ทำแคมเปญการตลาดร่วมกัน:
          </p>
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
            <ul className="space-y-3 text-[15px] leading-7 text-slate-600">
              <li><strong>สั่งซื้อล็อตใหญ่ (Wholesale):</strong> <a href="mailto:b2b@theshirtsy.com" className="text-blue-600 hover:underline">b2b@theshirtsy.com</a></li>
              <li><strong>ติดต่อฝ่ายการตลาดและ PR:</strong> <a href="mailto:marketing@theshirtsy.com" className="text-blue-600 hover:underline">marketing@theshirtsy.com</a></li>
              <li><strong>ติดต่อเสนอโปรเจกต์ (Partnership):</strong> <a href="mailto:partner@theshirtsy.com" className="text-blue-600 hover:underline">partner@theshirtsy.com</a></li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="social">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">3. ช่องทางโซเชียลมีเดีย</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            ติดตามข่าวสาร โปรโมชั่นพิเศษ และไอเดียการแต่งตัว/ออกแบบลายเสื้อใหม่ๆ ได้ที่ช่องทางโซเชียลมีเดียของเรา:
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> Facebook
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:text-pink-600 hover:border-pink-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Instagram
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:text-blue-500 hover:border-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg> Twitter (X)
            </a>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="office">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">4. ที่ตั้งสำนักงานและศูนย์ผลิต</h2>
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex items-start gap-4">
              <div className="p-2 text-slate-700 bg-slate-100 rounded-lg mt-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">บริษัท The Shirtsy (Thailand) จำกัด</h3>
                <p className="text-[15px] leading-7 text-slate-600 mb-4">
                  123/45 ถนนพัฒนาการ แขวงสวนหลวง<br />
                  เขตสวนหลวง กรุงเทพมหานคร 10250
                </p>
                <div className="text-sm text-slate-400 italic">
                  * หมายเหตุ: เราให้บริการในรูปแบบออนไลน์ 100% ไม่มีหน้าร้านสำหรับลองไซส์เสื้อหรือสั่งซื้อผ่านหน้าโรงงานครับ
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-slate-900 flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          หัวข้อการติดต่อ
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

export default ContactGuide;
