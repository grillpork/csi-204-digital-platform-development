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
      '#general, #ordering, #creator-faq, #shipping-faq'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'general', title: '1. คำถามทั่วไปเกี่ยวกับแพลตฟอร์ม' },
    { id: 'ordering', title: '2. คำถามเกี่ยวกับการสั่งซื้อ (ลูกค้า)' },
    { id: 'shipping-faq', title: '3. คำถามเกี่ยวกับการจัดส่ง' },
    { id: 'creator-faq', title: '4. คำถามสำหรับนักออกแบบ (Creator)' },
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
          </button>
        </div>
        
        <p className="text-[15px] leading-7 text-[#a1a1aa] mb-10">
          รวบรวมคำถามและคำตอบที่พบบ่อยเกี่ยวกับการใช้งานแพลตฟอร์ม The Shirtsy หากคุณมีข้อสงสัยเพิ่มเติม สามารถติดต่อทีมงานผ่านเมนู Contact Us ได้เลยครับ
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="general">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">1. คำถามทั่วไปเกี่ยวกับแพลตฟอร์ม</h2>
          
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: แพลตฟอร์ม The Shirtsy ให้บริการอะไรบ้าง?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เราเป็นแพลตฟอร์ม Print-on-Demand (POD) แบบครบวงจร ให้บริการ 2 ส่วนหลักๆ คือ 1. บริการสั่งทำเสื้อยืดสกรีนลายตามสั่ง (Custom Print) สำหรับลูกค้าทั่วไป และ 2. บริการ Marketplace เปิดร้านค้าให้นักออกแบบอิสระ (Creator) นำลายมาลงขายโดยไม่ต้องสต๊อกของเอง แพลตฟอร์มจะจัดการเรื่องผลิตและจัดส่งให้ทั้งหมด
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: คุณภาพเสื้อและงานสกรีนเป็นอย่างไร?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เสื้อของเราใช้เนื้อผ้า Cotton 100% (Comb 32) เกรดพรีเมียม สัมผัสนุ่ม ใส่สบาย ไม่ย้วยง่าย ส่วนงานพิมพ์เราใช้เครื่องพิมพ์เทคโนโลยีระดับอุตสาหกรรม (DTG และ DTF) ซึ่งรับประกันสีสันที่สดใส คมชัด ไม่หลุดร่อนง่ายครับ
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: สมัครสมาชิกแพลตฟอร์มเสียเงินหรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: ฟรี 100% ครับ! ไม่ว่าคุณจะเป็นผู้ซื้อ (Buyer) หรือนักออกแบบ (Creator) ก็สามารถสมัครสมาชิกได้ฟรี ไม่มีค่าแรกเข้าและไม่มีค่าธรรมเนียมรายปี
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="ordering">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">2. คำถามเกี่ยวกับการสั่งซื้อ (สำหรับลูกค้า)</h2>
          
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: มีขั้นต่ำในการสั่งสกรีนหรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: ไม่มีขั้นต่ำครับ! จะสั่งสกรีนลายของคุณเองเพื่อใส่คนเดียว หรือสั่งเป็นของขวัญเพียง 1 ตัว เราก็ยินดีให้บริการด้วยราคามาตรฐาน
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: สั่งสกรีนจำนวนมากมีราคาขายส่ง (Wholesale) หรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: มีแน่นอนครับ หากสั่งซื้อตั้งแต่ 20 ตัวขึ้นไป (เสื้อทีม, เสื้อบริษัท, เสื้อแฟนคลับ) สามารถติดต่อทีมแอดมินเพื่อขอราคาพิเศษได้เลย จะมีส่วนลดตามขั้นบันไดจำนวนเสื้อครับ
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ลายสกรีนซักแล้วจะหลุดลอกไหม? มีวิธีดูแลรักษาอย่างไร?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: งานสกรีนของเรามีความทนทานต่อการซักด้วยเครื่องสูงมาก แต่เพื่อให้สีสดทนนาน แนะนำให้ทำตามนี้ครับ: 1) กลับด้านเสื้อทุกครั้งก่อนซัก 2) ห้ามใช้น้ำยาฟอกขาว 3) หลีกเลี่ยงการอบผ้าด้วยความร้อนสูง และ 4) ห้ามรีดทับลายสกรีนโดยตรง ให้รีดจากด้านในแทน
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ฉันสามารถแก้ไขคำสั่งซื้อหรือเปลี่ยนไซส์หลังจากกดชำระเงินได้หรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: หากต้องการแก้ไข รบกวนรีบติดต่อแอดมินทางแชทให้เร็วที่สุด (ภายใน 12 ชั่วโมง) เพราะหากออเดอร์ถูกส่งเข้าสายการผลิต (เริ่มสกรีนไปแล้ว) จะไม่สามารถแก้ไขหรือยกเลิกได้ เนื่องจากเป็นสินค้าสั่งทำเฉพาะคุณครับ
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="shipping-faq">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">3. คำถามเกี่ยวกับการจัดส่ง</h2>
          
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: สั่งซื้อแล้วจะได้ของเมื่อไหร่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: สินค้าเป็นแบบ Make-to-Order ต้องใช้เวลาพิมพ์เสื้อประมาณ 2-4 วันทำการ หลังจากนั้นจะถูกส่งให้บริษัทขนส่ง (Flash/Kerry) ซึ่งใช้เวลาอีก 1-3 วัน โดยเฉลี่ยลูกค้าจะได้รับของภายใน 3-7 วันทำการครับ
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: มีบริการจัดส่งต่างประเทศ (International Shipping) หรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: ในขณะนี้เราให้บริการจัดส่งเฉพาะภายในประเทศไทยเท่านั้นครับ เรากำลังวางแผนที่จะขยายบริการไปต่างประเทศในอนาคต
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="creator-faq">
          <h2 className="text-2xl font-semibold tracking-tight text-[#ededed] mb-6">4. คำถามสำหรับนักออกแบบ (Creator)</h2>
          
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: เปิดร้านค้าเสียค่าใช้จ่ายไหม? มีค่าทำเนียมรายเดือนหรือเปล่า?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เปิดร้านค้าและอัปโหลดลายขาย ฟรีทั้งหมด! ไม่มีค่าเปิดร้าน ไม่มีค่ารายเดือน ไม่มีค่าฝากเซิร์ฟเวอร์ใดๆ คุณแค่ตั้งราคา Markup ส่วนต่าง แล้วรับกำไรเมื่อขายได้
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ฉันยังเป็นเจ้าของลิขสิทธิ์ภาพวาดที่อัปโหลดไปหรือไม่?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: 100% ครับ! ลิขสิทธิ์ของอาร์ตเวิร์คเป็นของคุณเสมอ The Shirtsy เป็นเพียงตัวกลางผลิตและจัดส่ง เราไม่มีนโยบายฮุบลิขสิทธิ์นักวาด คุณสามารถเอาลายไปขายที่แพลตฟอร์มอื่นพร้อมๆ กันได้ และสามารถลบลายทิ้งเมื่อไหร่ก็ได้
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ถ้าลูกค้าสั่งซื้อเสื้อลายของฉัน ใครเป็นคนส่งของให้ลูกค้า?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: แพลตฟอร์มจะเป็นผู้จัดการทุกอย่างครับ (สต๊อกเสื้อเปล่า &gt; พิมพ์ลายตามสั่ง &gt; แพ็กของ &gt; จัดส่งให้ลูกค้า &gt; รับเรื่อง Customer Service) สิ่งที่คุณต้องทำคือ การวาดรูปและโปรโมทร้านตัวเองเท่านั้น สะดวกและตอบโจทย์ Passive Income สุดๆ
              </p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-medium text-[#ededed] mb-2">Q: ยอดเงินจะเข้าบัญชีของฉันอย่างไร? ถอนเงินได้ตอนไหน?</h3>
              <p className="text-[15px] leading-7 text-[#a1a1aa]">
                A: เมื่อสินค้าถูกจัดส่งสำเร็จ ยอดเงิน (Markup ที่คุณตั้งไว้) จะเข้าสู่ระบบ Wallet ของคุณ และเราจะทำการโอนเงินเข้าบัญชีธนาคารที่คุณผูกไว้อัตโนมัติในทุกวันที่ 1 และ 16 ของเดือน (ขั้นต่ำการโอน 500 บาท)
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar (Table of Contents) */}
      <div className="hidden xl:block w-64 shrink-0 text-sm sticky top-12 self-start pt-2">
        <h4 className="font-semibold text-[#ededed] flex items-center mb-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 opacity-70"><path d="M2.5 4.5H12.5M2.5 7.5H12.5M2.5 10.5H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
          หัวข้อคำถาม
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

export default FaqGuide;
