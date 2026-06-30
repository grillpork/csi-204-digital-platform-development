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
      '#how-to-order, #image-prep, #size-guide, #fabric-quality, #shipping, #return-policy'
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const toc = [
    { id: 'how-to-order', title: '1. วิธีการสั่งซื้ออย่างละเอียด' },
    { id: 'image-prep', title: '2. การเตรียมไฟล์ภาพให้คมชัด' },
    { id: 'size-guide', title: '3. ตารางไซส์เสื้อ (Size Guide)' },
    { id: 'fabric-quality', title: '4. เนื้อผ้าและคุณภาพการสกรีน' },
    { id: 'shipping', title: '5. การจัดส่งและการชำระเงิน' },
    { id: 'return-policy', title: '6. นโยบายการคืน/เปลี่ยนสินค้า' },
  ];

  return (
    <div className="flex flex-col xl:flex-row relative items-start w-full bg-white text-slate-800">
      
      {/* Left Content Column */}
      <div className="flex-1 min-w-0 max-w-3xl pr-0 xl:pr-12">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">คู่มือสำหรับลูกค้า (Buyer's Guide)</h1>
        </div>
        
        <p className="text-[15px] leading-7 text-slate-500 mb-10">
          ยินดีต้อนรับเข้าสู่ The Shirtsy แพลตฟอร์มที่คุณสามารถสั่งสกรีนเสื้อลายโปรดได้ตามใจชอบ ไม่ว่าจะเป็นการอัปโหลดไฟล์ภาพของคุณเอง หรือเลือกลายจากนักออกแบบของเราใน Marketplace คู่มือนี้จะแนะนำทุกขั้นตอนอย่างละเอียด เพื่อให้คุณได้รับเสื้อสกรีนที่สวยงาม คมชัด และตอบโจทย์มากที่สุด
        </p>

        {/* Section 1 */}
        <div className="mb-12 pt-4" id="how-to-order">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">1. วิธีการสั่งซื้ออย่างละเอียด</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            การสั่งซื้อเสื้อผ่าน The Shirtsy สามารถทำได้ง่ายๆ เพียงไม่กี่ขั้นตอน ทั้งบนคอมพิวเตอร์และโทรศัพท์มือถือ:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-decimal list-inside mb-4">
            <li><strong>เข้าสู่หน้าเลือกสินค้า:</strong> ค้นหาและเลือกรูปแบบเสื้อที่คุณต้องการ เช่น เสื้อยืดคอกลมคลาสสิก เสื้อยืดโอเวอร์ไซส์ทรงเกาหลี หรือเสื้อครอบ ฯลฯ</li>
            <li><strong>เลือกสีเสื้อที่ถูกใจ:</strong> เรามีสีเสื้อให้เลือกหลากหลาย ทั้งสีพื้น (ขาว ดำ เทา กรมท่า) และสีแฟชั่นตามฤดูกาล</li>
            <li><strong>อัปโหลดภาพหรือเลือกลาย:</strong> คุณสามารถกดปุ่ม "Custom" เพื่ออัปโหลดไฟล์ภาพของคุณเอง (รองรับ PNG, JPG) หรือคลิกหยิบลายที่ชอบจาก Marketplace ลงตะกร้า</li>
            <li><strong>ปรับขนาดและตำแหน่ง (เฉพาะโหมด Custom):</strong> เมื่ออัปโหลดแล้ว คุณจะสามารถครอบตัด (Crop) ภาพ ย่อขยาย และหมุนภาพเพื่อให้พอดีกับกรอบสกรีน (Logo, A4, A3) บนตัวเสื้อจำลองได้</li>
            <li><strong>เลือกไซส์เสื้อ:</strong> ดู <a href="#size-guide" className="text-blue-600 hover:underline">ตารางไซส์ (Size Guide)</a> เพื่อเลือกขนาดที่พอดีกับตัวคุณ</li>
            <li><strong>เพิ่มลงตะกร้าและชำระเงิน:</strong> ตรวจสอบรายละเอียดสินค้า ระบุจำนวน และกดไปที่ตะกร้าเพื่อเข้าสู่ระบบการชำระเงิน</li>
          </ul>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            💡 <strong>เคล็ดลับ:</strong> หากคุณต้องการสั่งซื้อจำนวนมาก (เกิน 20 ตัวขึ้นไป) สำหรับทำเสื้อรุ่น เสื้อทีม หรือเสื้อบริษัท สามารถติดต่อเราผ่านเมนู "ติดต่อเรา" เพื่อขอรับเรทราคาขายส่งได้ครับ!
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12 pt-4" id="image-prep">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">2. การเตรียมไฟล์ภาพให้คมชัด</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            หัวใจสำคัญของเสื้อสกรีนที่สวยงามคือ "ความคมชัดของภาพต้นฉบับ" เพื่อให้ได้งานสกรีนที่คมกริบ ไม่เบลอ ไม่แตก รบกวนตรวจสอบไฟล์ภาพของคุณตามคำแนะนำเหล่านี้:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>ประเภทไฟล์:</strong> ทางเราแนะนำให้ใช้ไฟล์ <strong>.PNG ที่เจาะพื้นหลังใส (Transparent)</strong> เป็นหลัก เพื่อเวลาสกรีนลงเสื้อสีต่างๆ จะไม่มีกรอบสี่เหลี่ยมติดไปด้วย (ยกเว้นกรณีตั้งใจให้เป็นกรอบสี่เหลี่ยม สามารถใช้ JPG ได้)</li>
            <li><strong>ความละเอียด (Resolution):</strong> ควรกำหนดความละเอียดที่ <strong>300 DPI</strong> ขึ้นไป หรืออย่างน้อยมีขนาด 2000x2000 พิกเซล หากภาพต้นฉบับเล็กแล้วนำมาขยายตอนพิมพ์ ภาพจะแตกเป็นเม็ดพิกเซล</li>
            <li><strong>โหมดสี (Color Mode):</strong> ใช้โหมดสี <strong>CMYK</strong> หรือ <strong>sRGB</strong> หากเป็นภาพที่มีสีนีออนสว่างจัดจ้าน (เช่น สีชมพูช็อกกิ้งพิงก์ สีเขียวสะท้อนแสง) เวลาสกรีนจริงด้วยหมึก CMYK สีอาจจะดรอปลงเล็กน้อยจากที่เห็นบนหน้าจอมือถือหรือคอมพิวเตอร์</li>
            <li><strong>เส้นขอบและตัวอักษร:</strong> ตัวอักษรควรมีความหนาไม่ต่ำกว่า 2pt เพื่อให้หมึกเกาะติดได้ดีและอ่านง่าย เส้นขอบที่บางเกินไปอาจทำให้การสกรีนเก็บรายละเอียดได้ไม่หมด</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12 pt-4" id="size-guide">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">3. ตารางไซส์เสื้อ (Size Guide)</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            เสื้อยืดทรงมาตรฐานของเราเป็นแบบ <strong>Unisex</strong> ใส่ได้ทั้งชายและหญิง การตัดเย็บใช้มาตรวัดแบบสากล โดยมีตารางรอบอกและความยาวดังนี้:
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white mb-4">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs uppercase bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3">ไซส์ (Size)</th>
                  <th className="px-6 py-3">รอบอก (นิ้ว)</th>
                  <th className="px-6 py-3">ความยาว (นิ้ว)</th>
                  <th className="px-6 py-3">ไหล่กว้าง (นิ้ว)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">S</td><td className="px-6 py-4">34"</td><td className="px-6 py-4">25"</td><td className="px-6 py-4">15"</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">M</td><td className="px-6 py-4">38"</td><td className="px-6 py-4">27"</td><td className="px-6 py-4">17"</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">L</td><td className="px-6 py-4">42"</td><td className="px-6 py-4">29"</td><td className="px-6 py-4">19"</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">XL</td><td className="px-6 py-4">46"</td><td className="px-6 py-4">30"</td><td className="px-6 py-4">20"</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">2XL</td><td className="px-6 py-4">50"</td><td className="px-6 py-4">31"</td><td className="px-6 py-4">21"</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">3XL</td><td className="px-6 py-4">54"</td><td className="px-6 py-4">32"</td><td className="px-6 py-4">22"</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[14px] leading-6 text-slate-500 italic mt-2">
            * หมายเหตุ: ขนาดเสื้ออาจมีความคลาดเคลื่อนประมาณ ±0.5 นิ้ว ถึง 1 นิ้ว ซึ่งเกิดจากกระบวนการตัดเย็บและการหดตัวของเส้นด้ายคอตตอน
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-12 pt-4" id="fabric-quality">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">4. เนื้อผ้าและคุณภาพการสกรีน</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            The Shirtsy ให้ความสำคัญกับคุณภาพสินค้าเป็นอันดับแรก เราคัดสรรเส้นด้ายและเทคโนโลยีการสกรีนที่ดีที่สุดในตลาดปัจจุบัน:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>เนื้อผ้า Cotton 100% (Comb No.32):</strong> เนื้อผ้าเนียนนุ่ม สวมใส่สบาย ระบายอากาศได้ดีเยี่ยม ไม่ระคายเคืองผิว ผ่านกระบวนการฟอกนุ่ม (Enzyme Wash) เพื่อสัมผัสที่พรีเมียมขึ้น ทรงสวย ไม่ย้วยง่าย</li>
            <li><strong>เทคโนโลยีการสกรีน DTG (Direct to Garment):</strong> พิมพ์ลวดลายลงบนเส้นใยผ้าโดยตรง ให้สัมผัสที่นุ่มนวล เป็นเนื้อเดียวกับเสื้อ สีสันคมชัด ไล่เฉดสีได้ไม่จำกัด เหมาะกับภาพถ่ายหรือกราฟิกที่มีรายละเอียดสูง</li>
            <li><strong>เทคโนโลยีการสกรีน DTF (Direct to Film):</strong> สำหรับลวดลายที่มีขอบคมชัด โลโก้ที่มีสีทึบ สีสันสดใสโดดเด่น ยืดหยุ่นได้ดี ซักแล้วไม่หลุดร่อน ทนทานต่อการซักรีด</li>
            <li><strong>วิธีการดูแลรักษา:</strong> เพื่อยืดอายุการใช้งานของเสื้อสกรีน ควรกลับด้านเสื้อก่อนซักและก่อนรีด หลีกเลี่ยงการใช้น้ำยาฟอกขาว และไม่ควรอบผ้าด้วยความร้อนสูง</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="mb-12 pt-4" id="shipping">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">5. การจัดส่งและการชำระเงิน</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">💳 ช่องทางการชำระเงิน</h3>
            <p className="text-[15px] leading-7 text-slate-600">
              เรารองรับการชำระเงินผ่านหลายช่องทาง ไม่ว่าจะเป็น บัตรเครดิต/เดบิต (Visa, Mastercard), โอนเงินผ่านบัญชีธนาคาร, สแกน QR Code พร้อมเพย์ (PromptPay) และบริการเก็บเงินปลายทาง (COD) สำหรับยอดสั่งซื้อไม่เกิน 3,000 บาท
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">🚚 รอบการผลิตและจัดส่ง</h3>
            <p className="text-[15px] leading-7 text-slate-600 mb-2">
              สินค้าทั้งหมดของเราเป็นสินค้า <strong>Make to Order</strong> (ผลิตตามคำสั่งซื้อชิ้นต่อชิ้น) จึงต้องใช้เวลาในการเตรียมการผลิตดังนี้:
            </p>
            <ul className="space-y-2 text-[15px] leading-7 text-slate-600 list-disc list-inside">
              <li><strong>ระยะเวลาการผลิต:</strong> ประมาณ 2-4 วันทำการ นับจากวันที่ยืนยันการชำระเงิน (ตัดรอบ 12:00 น. ของทุกวัน)</li>
              <li><strong>ระยะเวลาจัดส่ง:</strong> ใช้บริการขนส่งเอกชนชั้นนำ (Kerry Express / Flash Express / J&T) ใช้เวลา 1-3 วันทำการ ทั่วประเทศ</li>
              <li>ระบบจะทำการส่งอีเมลหรือข้อความ SMS แจ้งหมายเลขพัสดุ (Tracking Number) ทันทีที่สินค้าถูกแพ็กและส่งมอบให้บริษัทขนส่ง</li>
            </ul>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-12 pt-4" id="return-policy">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-4">6. นโยบายการคืน/เปลี่ยนสินค้า</h2>
          <p className="text-[15px] leading-7 text-slate-600 mb-4">
            เพื่อความสบายใจของลูกค้า เรามีนโยบายรับประกันสินค้า หากพบว่าสินค้ามีปัญหาที่เกิดจากความผิดพลาดของทางร้าน:
          </p>
          <ul className="space-y-3 text-[15px] leading-7 text-slate-600 list-disc list-inside">
            <li><strong>รับเคลม 100%:</strong> หากเกิดกรณี เสื้อมีตำหนิ ขาด เป็นรู, ลายสกรีนผิด, ไซส์เสื้อผิดไปจากที่สั่ง, หรือลอกร่อนตั้งแต่ครั้งแรกที่ซัก</li>
            <li><strong>เงื่อนไขการเคลม:</strong> ต้องแจ้งเคลมภายใน <strong>7 วัน</strong> หลังจากได้รับสินค้า โดยเสื้อต้องยังไม่ผ่านการซัก (ยกเว้นกรณีเคลมเรื่องซักแล้วลอก) ป้ายห้อย (หากมี) ยังอยู่ครบ</li>
            <li><strong>สิ่งที่ไม่รับเคลม:</strong> กรณีสั่งไซส์ผิด สั่งสีผิด ใส่ไม่ได้ หรือเปลี่ยนใจกะทันหัน เนื่องจากเป็นสินค้าสั่งผลิตเฉพาะบุคคล (Custom Made)</li>
            <li><strong>วิธีการแจ้งเคลม:</strong> ติดต่อฝ่ายบริการลูกค้า (Customer Service) ทางเมนู "ติดต่อเรา" พร้อมแนบรูปถ่ายจุดที่มีปัญหาและหมายเลขคำสั่งซื้อ แอดมินจะดำเนินการจัดส่งตัวใหม่ให้ภายใน 3-5 วันทำการ โดยไม่มีค่าใช้จ่ายเพิ่มเติม</li>
          </ul>
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

export default BuyersGuide;
