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
      '#open-store, #design-guidelines, #copyright, #revenue-share, #marketing-tips'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'open-store', title: '1. วิธีการลงทะเบียนสินค้า (Creator Shop)' },
    { id: 'design-guidelines', title: '2. มาตรฐานการออกแบบ (Design Guidelines)' },
    { id: 'copyright', title: '3. นโยบายลิขสิทธิ์ทรัพย์สินทางปัญญา' },
    { id: 'revenue-share', title: '4. ส่วนแบ่งรายได้ (Revenue Share)' },
    { id: 'marketing-tips', title: '5. เคล็ดลับการเพิ่มยอดขาย' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full bg-white text-slate-800">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">คู่มือสำหรับนักออกแบบ (Creator's Guide)</h1>
        </div>
        
        <p className="text-[15px] leading-7 text-slate-500 mb-10">
          ยินดีต้อนรับศิลปินและนักออกแบบทุกท่านเข้าสู่ครอบครัว The Shirtsy! เราคือพื้นที่สำหรับปลดปล่อยความคิดสร้างสรรค์ของคุณให้กลายเป็นสินค้าที่จับต้องได้และสร้างรายได้จากการจำหน่ายผลงาน คู่มือฉบับนี้รวบรวมข้อมูลทุกอย่างที่คุณต้องรู้ ตั้งแต่กระบวนการส่งแบบเสื้อ ไปจนถึงโครงสร้างการรับส่วนแบ่งรายได้
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="open-store">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">1. วิธีการลงทะเบียนสินค้า (Creator Shop)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            เริ่มต้นการขายลายออกแบบของคุณได้ง่ายๆ ไม่มีค่าใช้จ่ายในการลงทะเบียนใดๆ ทั้งสิ้น:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-decimal list-inside mb-4">
            <li><strong>สมัครสมาชิก:</strong> สร้างบัญชีผู้ใช้บนเว็บไซต์ The Shirtsy และเข้าสู่ระบบ</li>
            <li><strong>ออกแบบและบันทึกร่าง:</strong> ไปที่เมนู "ออกแบบเสื้อ" (Customizer) อัปโหลดภาพลายสกรีน ตั้งชื่อ และกดบันทึกแบบร่าง (DRAFT)</li>
            <li><strong>ส่งขออนุมัติ:</strong> เมื่อพอใจการจัดวางแล้ว กดส่งให้ผู้ดูแลระบบตรวจสอบ (PENDING)</li>
            <li><strong>การอนุมัติและวางขาย:</strong> ผู้ดูแลระบบจะตรวจสอบความคมชัดและลิขสิทธิ์ของภาพ เมื่ออนุมัติแล้วจะกำหนดราคาขายและสต็อกเริ่มต้นเพื่อวางขายแบบสาธารณะทันที!</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="design-guidelines">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">2. มาตรฐานการออกแบบ (Design Guidelines)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            เพื่อให้ผลงานของคุณถูกพิมพ์ออกมาอย่างสมบูรณ์แบบ กรุณาทำตามข้อกำหนดทางเทคนิคดังนี้:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>รูปแบบไฟล์:</strong> บังคับใช้เฉพาะ <strong>.PNG แบบไม่มีพื้นหลัง (Transparent Background)</strong> เพื่อเวลาลูกค้านำลายไปวางบนเสื้อสีอื่น จะได้ไม่มีสีพื้นหลังสี่เหลี่ยมติดไปด้วย</li>
            <li><strong>ขนาดและความละเอียด:</strong> แนะนำขนาดอาร์ตเวิร์คที่ 2400 x 3200 พิกเซล (สำหรับสกรีนเต็มหน้าอก/แผ่นหลัง) ที่ความละเอียด 300 DPI เพื่อความคมชัดสูงสุด</li>
            <li><strong>โหมดสี (Color Profile):</strong> แนะนำให้ใช้โหมด <strong>CMYK</strong> หรือ <strong>sRGB</strong> ในโปรแกรมออกแบบ (เช่น Photoshop, Illustrator, Procreate) *หมายเหตุ: โปรดระวังการใช้สีนีออนสว่างจัดจ้าน เนื่องจากเวลาสกรีนจริงลงเนื้อผ้า สีอาจจะดรอปลงประมาณ 5-10%</li>
            <li><strong>เทคนิคการใช้สี:</strong> หลีกเลี่ยงการทำ "ขอบกึ่งโปร่งแสง (Semi-transparent Edge)" หรือเอฟเฟกต์ Glow/Drop Shadow ที่ฟุ้งและจางมากๆ เพราะเครื่องพิมพ์เสื้ออาจจะตีความสีโปร่งแสงเป็นเม็ดสีทึบหรือพิมพ์ออกมาไม่เนียนเท่าที่ควร</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="copyright">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">3. นโยบายลิขสิทธิ์ทรัพย์สินทางปัญญา</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            The Shirtsy สนับสนุนและเคารพสิทธิของนักสร้างสรรค์อย่างเคร่งครัด เรามีนโยบาย <span className="text-slate-900 font-semibold">"Zero Tolerance"</span> ต่อการละเมิดลิขสิทธิ์:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>ผลงานต้องเป็นของคุณเอง:</strong> อาร์ตเวิร์คที่นำมาลงขายต้องเป็นผลงานที่คุณวาดขึ้นเอง หรือมีสิทธิ์ในการใช้เชิงพาณิชย์ (Commercial Use) อย่างถูกต้อง</li>
            <li><strong>ห้ามละเมิดเครื่องหมายการค้า:</strong> ไม่อนุญาตให้นำโลโก้แบรนด์ดัง ตัวการ์ตูน ภาพยนตร์ หรือศิลปินที่มีลิขสิทธิ์ (Fan Art เชิงพาณิชย์) มาขาย หากไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเจ้าของสิทธิ์</li>
            <li><strong>การรายงานการละเมิด:</strong> หากทางเราได้รับแจ้ง (DMCA Takedown) หรือตรวจพบว่ามีการคัดลอกผลงาน สินค้าชิ้นนั้นจะถูกระงับจากการขายทันที</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="revenue-share">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">4. ส่วนแบ่งรายได้ (Revenue Share)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            โครงสร้างการแบ่งรายได้ของแพลตฟอร์มกำหนดไว้อย่างชัดเจนและยุติธรรมสำหรับนักออกแบบ:
          </p>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">ส่วนแบ่งรายได้สำหรับ Creator:</h3>
            <p className="text-[15px] leading-7 text-emerald-700 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-center text-lg font-bold">
              คุณจะได้รับส่วนแบ่งรายได้สุทธิ 20% จากยอดขายเสื้อที่มีลายพิมพ์ของคุณ
            </p>
          </div>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>ตัวอย่างการคำนวณ:</strong> หากเสื้อยืดลายออกแบบของคุณขายในราคา 370 บาท คุณจะได้รับส่วนแบ่ง 74 บาท ต่อหนึ่งตัวที่จำหน่ายได้</li>
            <li><strong>การจัดการสต็อกและการผลิต:</strong> แพลตฟอร์มจะดูแลสต็อกเสื้อเปล่า ควบคุมคุณภาพงานพิมพ์ จัดส่ง และบริการลูกค้าทั้งหมดโดยที่นักออกแบบไม่ต้องกังวล</li>
            <li><strong>การตรวจสอบยอดขาย:</strong> คุณสามารถตรวจสอบยอดจำหน่าย จำนวนชิ้น และยอดส่วนแบ่งรายสะสมแบบเรียลไทม์ได้ตลอดเวลาทางหน้าประวัติรายได้ในหน้าโปรไฟล์</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-12 pt-4" id="marketing-tips">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">5. เคล็ดลับการเพิ่มยอดขาย</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📣 โปรโมทบน Social Media</h4>
              <p className="text-sm text-slate-600 leading-relaxed">แชร์ลิงก์สินค้าร้านของคุณลงในช่องทางของตัวเอง ไม่ว่าจะเป็น Twitter, Instagram หรือ TikTok กลุ่มผู้ติดตามคุณคือลูกค้ากลุ่มแรกที่มีแนวโน้มจะซื้อมากที่สุด</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">🎯 เกาะกระแส (Trending)</h4>
              <p className="text-sm text-slate-600 leading-relaxed">สังเกตเทรนด์ หรือคำฮิตในช่วงเวลานั้นๆ (เช่น เทศกาล, Meme ฮาๆ, ข้อความโดนใจ) แล้วนำมาดัดแปลงเป็นลายเสื้อ จะช่วยเพิ่มโอกาสในการค้นพบเจอได้มาก</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">🎯 ใส่ Tag ให้ตรงจุด</h4>
              <p className="text-sm text-slate-600 leading-relaxed">ตอนตั้งชื่อและใส่ Tags ให้สินค้านั้น ควรใช้คีย์เวิร์ดที่คนน่าจะค้นหาจริงๆ (เช่น "เสื้อแมว", "เสื้อยืดมินิมอล", "เสื้อสายมู") จะช่วยเพิ่ม SEO ภายในแพลตฟอร์ม</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">🎨 จัดคอลเลกชันให้สวยงาม</h4>
              <p className="text-sm text-slate-600 leading-relaxed">พยายามคุมโทนภาพหน้าปกร้านให้มีสไตล์ชัดเจน ลูกค้าที่เข้ามาดูโปรไฟล์มักจะซื้อทีเดียวหลายตัวหากถูกใจสไตล์งานวาดของคุณ</p>
            </div>
          </div>
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

export default CreatorsGuide;
