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
      '#open-store, #design-guidelines, #copyright, #revenue-share, #payouts, #marketing-tips'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'open-store', title: '1. วิธีการเปิดร้านค้า (Creator Store)' },
    { id: 'design-guidelines', title: '2. มาตรฐานการออกแบบ (Design Guidelines)' },
    { id: 'copyright', title: '3. นโยบายลิขสิทธิ์ทรัพย์สินทางปัญญา' },
    { id: 'revenue-share', title: '4. ส่วนแบ่งรายได้ (Revenue Share)' },
    { id: 'payouts', title: '5. รอบการถอนเงิน (Payouts)' },
    { id: 'marketing-tips', title: '6. เคล็ดลับการเพิ่มยอดขาย' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-[#ededed]">คู่มือสำหรับนักออกแบบ (Creator's Guide)</h1>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#27272a] rounded-md border border-[#27272a] transition-colors">
            <Copy className="w-3.5 h-3.5" />
            คัดลอกหน้า
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          ยินดีต้อนรับศิลปินและนักออกแบบทุกท่านเข้าสู่ครอบครัว The Shirtsy! เราคือพื้นที่สำหรับปลดปล่อยความคิดสร้างสรรค์ของคุณให้กลายเป็นสินค้าที่จับต้องได้และสร้างรายได้แบบ Passive Income คู่มือฉบับนี้รวบรวมข้อมูลทุกอย่างที่คุณต้องรู้ ตั้งแต่การสมัคร ไปจนถึงเคล็ดลับการตั้งราคาและการทำโปรโมชั่น
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="open-store">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">1. วิธีการเปิดร้านค้า (Creator Store)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            เริ่มต้นธุรกิจสายออกแบบของคุณได้ง่ายๆ ไม่มีค่าใช้จ่ายในการสมัครใดๆ ทั้งสิ้น:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-decimal list-inside mb-4">
            <li><strong>สมัครสมาชิก:</strong> สร้างบัญชีผู้ใช้ทั่วไปบน The Shirtsy หรือเข้าสู่ระบบด้วยอีเมลเดิมของคุณ</li>
            <li><strong>ยืนยันตัวตน:</strong> ไปที่เมนูโปรไฟล์ เลือก "สมัครเป็น Creator" ระบบจะขอให้คุณกรอกข้อมูลยืนยันตัวตน เช่น ชื่อนามสกุลจริง (เพื่อป้องกันการแอบอ้าง)</li>
            <li><strong>ตั้งชื่อและตกแต่งร้านค้า:</strong> กรอกชื่อร้าน (Store Name), คำอธิบายร้านค้าสั้นๆ (Bio), รวมไปถึงการอัปโหลดรูปโปรไฟล์ (Profile Picture) และภาพปก (Cover Image) เพื่อสร้างแบรนดิ้งให้ตัวเอง</li>
            <li><strong>ตั้งค่าการรับเงิน:</strong> ผูกบัญชีธนาคารสำหรับรับส่วนแบ่งรายได้ ตรวจสอบชื่อบัญชีให้ตรงกับชื่อผู้สมัคร</li>
            <li><strong>อัปโหลดผลงานชิ้นแรก:</strong> เมื่อได้รับการอนุมัติบัญชี (ปกติไม่เกิน 24 ชม.) คุณก็สามารถคลิก "สร้างสินค้าใหม่" เพื่ออัปโหลดลาย กะตำแหน่งบนเสื้อจำลอง (Mockup) ตั้งชื่อสินค้าและกำหนดราคาขายได้ทันที!</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="design-guidelines">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">2. มาตรฐานการออกแบบ (Design Guidelines)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            เพื่อให้ผลงานของคุณถูกพิมพ์ออกมาอย่างสมบูรณ์แบบ กรุณาทำตามข้อกำหนดทางเทคนิคดังนี้:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>รูปแบบไฟล์:</strong> บังคับใช้เฉพาะ <strong>.PNG แบบไม่มีพื้นหลัง (Transparent Background)</strong> เพื่อเวลาลูกค้านำลายไปวางบนเสื้อสีอื่น จะได้ไม่มีสีพื้นหลังสี่เหลี่ยมติดไปด้วย</li>
            <li><strong>ขนาดและความละเอียด:</strong> แนะนำขนาดอาร์ตเวิร์คที่ 2400 x 3200 พิกเซล (สำหรับสกรีนเต็มหน้าอก/แผ่นหลัง) ที่ความละเอียด 300 DPI เพื่อความคมชัดสูงสุด ไม่เบลอ ไม่แตก</li>
            <li><strong>โหมดสี (Color Profile):</strong> แนะนำให้ใช้โหมด <strong>CMYK</strong> หรือ <strong>sRGB</strong> ในโปรแกรมออกแบบ (เช่น Photoshop, Illustrator, Procreate) *หมายเหตุ: โปรดระวังการใช้สีนีออนสว่างจัดจ้าน เนื่องจากเวลาสกรีนจริงลงเนื้อผ้า สีอาจจะดรอปลงประมาณ 5-10%</li>
            <li><strong>เทคนิคการใช้สี:</strong> หลีกเลี่ยงการทำ "ขอบกึ่งโปร่งแสง (Semi-transparent Edge)" หรือเอฟเฟกต์ Glow/Drop Shadow ที่ฟุ้งและจางมากๆ เพราะเครื่องพิมพ์เสื้ออาจจะตีความสีโปร่งแสงเป็นเม็ดสีทึบหรือพิมพ์ออกมาไม่เนียนเท่าที่ควร</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="copyright">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">3. นโยบายลิขสิทธิ์ทรัพย์สินทางปัญญา</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            The Shirtsy สนับสนุนและเคารพสิทธิของนักสร้างสรรค์อย่างเคร่งครัด เรามีนโยบาย <span className="text-white font-medium">"Zero Tolerance"</span> ต่อการละเมิดลิขสิทธิ์:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ผลงานต้องเป็นของคุณเอง:</strong> อาร์ตเวิร์คที่นำมาลงขายต้องเป็นผลงานที่คุณวาดขึ้นเอง หรือมีสิทธิ์ในการใช้เชิงพาณิชย์ (Commercial Use) อย่างถูกต้อง</li>
            <li><strong>ห้ามละเมิดเครื่องหมายการค้า:</strong> ไม่อนุญาตให้นำโลโก้แบรนด์ดัง ตัวการ์ตูน ภาพยนตร์ หรือศิลปินที่มีลิขสิทธิ์ (Fan Art เชิงพาณิชย์) มาขาย หากไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเจ้าของสิทธิ์</li>
            <li><strong>การรายงานการละเมิด:</strong> หากทางเราได้รับแจ้ง (DMCA Takedown) หรือตรวจพบว่ามีการคัดลอกผลงาน สินค้าชิ้นนั้นจะถูกลบออกจากระบบทันที และหากกระทำผิดซ้ำ บัญชี Creator จะถูกระงับและริบรายได้ทั้งหมด</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="revenue-share">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">4. ส่วนแบ่งรายได้ (Revenue Share)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            โครงสร้างการแบ่งรายได้ของเราออกแบบมาให้ยุติธรรมที่สุด คุณมีอิสระในการกำหนด <strong>กำไรสุทธิ (Markup)</strong> ที่ต้องการต่อเสื้อหนึ่งตัว:
          </p>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a] mb-6">
            <h3 className="font-medium text-white mb-3">สูตรคำนวณราคาขายหน้าเว็บ:</h3>
            <p className="text-[15px] leading-7 text-blue-300 font-medium bg-blue-900/20 p-3 rounded-lg border border-blue-500/30 text-center text-lg">
              [ราคาต้นทุนเสื้อ + ค่าพิมพ์] + [กำไรที่คุณกำหนด] = [ราคาขาย]
            </p>
          </div>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ราคาต้นทุน (Base Cost):</strong> เป็นราคาคงที่ที่ครอบคลุมค่าเสื้อเปล่า, ค่าหมึกสกรีน, และค่าดำเนินการแพ็กจัดส่ง (สมมติ: 190 บาท สำหรับเสื้อยืดไซส์ปกติ)</li>
            <li><strong>กำไรของคุณ (Markup):</strong> คุณสามารถกำหนดได้อิสระ (เช่น กำหนด 100 บาท)</li>
            <li><strong>ราคาขาย (Retail Price):</strong> ระบบจะนำสองส่วนมาบวกกัน (190 + 100 = 290 บาท) และแสดงเป็นราคาขายหน้าร้าน</li>
            <li>คุณจะได้รับกำไร 100 บาท เต็มๆ ต่อการขายเสื้อ 1 ตัว! (ระบบอาจจะมีการหักค่าธรรมเนียมธุรกรรมจาก Payment Gateway (ประมาณ 3-5%) ตามยอดขายจริง)</li>
            <li>เราจัดการเรื่องสต๊อกเสื้อ ผลิต แพ็ก และจัดส่งให้ลูกค้าทั้งหมด หน้าที่ของคุณมีเพียง <strong>สร้างสรรค์ผลงาน</strong> เท่านั้น!</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-12 pt-4" id="payouts">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">5. รอบการถอนเงิน (Payouts)</h2>
          <p className="text-[15px] leading-7 text-[#a1a1aa] mb-4">
            ยอดเงินจะเข้าสู่กระเป๋าเงิน (Wallet) ของ Creator อัตโนมัติเมื่อคำสั่งซื้อนั้นมีสถานะ <strong>"จัดส่งสำเร็จและลูกค้าได้รับสินค้าแล้ว"</strong> เพื่อป้องกันปัญหาสินค้าตีกลับ
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-[#a1a1aa] list-disc list-inside">
            <li><strong>ยอดเงินขั้นต่ำสำหรับการถอน (Minimum Payout):</strong> 500 บาท ขึ้นไป</li>
            <li><strong>รอบการโอนเงินอัตโนมัติ:</strong> ระบบจะโอนเงินเข้าบัญชีธนาคารที่คุณผูกไว้โดยอัตโนมัติ ทุกวันที่ <strong>1 และ 16 ของทุกเดือน</strong></li>
            <li><strong>การถอนเงินด่วน (Manual Payout):</strong> หากมีความจำเป็นต้องใช้เงิน คุณสามารถกดขอถอนเงินก่อนรอบได้ โดยจะใช้เวลาตรวจสอบและโอนเงินภายใน 1-3 วันทำการ (มีค่าธรรมเนียมการโอน 15 บาท/ครั้ง)</li>
            <li>สามารถเช็กยอดขายรายวัน ยอดเงินสะสม และประวัติการถอนเงินได้ตลอดเวลาที่เมนู Creator Dashboard</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="mb-12 pt-4" id="marketing-tips">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-4">6. เคล็ดลับการเพิ่มยอดขาย</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#27272a]">
              <h4 className="font-semibold text-white mb-2">📣 โปรโมทบน Social Media</h4>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">แชร์ลิงก์สินค้าร้านของคุณลงในช่องทางของตัวเอง ไม่ว่าจะเป็น Twitter, Instagram หรือ TikTok กลุ่มผู้ติดตามคุณคือลูกค้ากลุ่มแรกที่มีแนวโน้มจะซื้อมากที่สุด</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#27272a]">
              <h4 className="font-semibold text-white mb-2">🎯 เกาะกระแส (Trending)</h4>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">สังเกตเทรนด์ หรือคำฮิตในช่วงเวลานั้นๆ (เช่น เทศกาล, Meme ฮาๆ, ข้อความโดนใจ) แล้วนำมาดัดแปลงเป็นลายเสื้อ จะช่วยเพิ่มโอกาสในการค้นพบเจอได้มาก</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#27272a]">
              <h4 className="font-semibold text-white mb-2">🏷️ ใส่ Tag ให้ตรงจุด</h4>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">ตอนตั้งชื่อและใส่ Tags ให้สินค้านั้น ควรใช้คีย์เวิร์ดที่คนน่าจะค้นหาจริงๆ (เช่น "เสื้อแมว", "เสื้อยืดมินิมอล", "เสื้อสายมู") จะช่วยเพิ่ม SEO ภายในแพลตฟอร์ม</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#27272a]">
              <h4 className="font-semibold text-white mb-2">🎨 จัดคอลเลกชันให้สวยงาม</h4>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">พยายามคุมโทนภาพหน้าปกร้านให้มีสไตล์ชัดเจน ลูกค้าที่เข้ามาดูโปรไฟล์มักจะซื้อทีเดียวหลายตัวหากถูกใจสไตล์งานวาดของคุณ</p>
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

export default CreatorsGuide;
