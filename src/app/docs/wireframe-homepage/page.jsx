"use client";

import React, { useState } from 'react';
import { Layout, Eye, EyeOff, Info, ArrowRight, Sparkles, Smartphone, Monitor } from 'lucide-react';

export default function WireframeHomepageDocs() {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [viewport, setViewport] = useState('desktop'); // 'desktop' or 'mobile'

  const sections = [
    {
      id: "header",
      name: "1. Navigation Header (ส่วนหัวและเมนู)",
      desc: "แถบเมนูหลักประกอบด้วยโลโก้, เมนูนำทาง (Home, Shop, Blog, About, Customizer), ตะกร้าสินค้า และปุ่มโปรไฟล์/เข้าสู่ระบบ สำหรับผู้ใช้ทั่วไปและแอดมิน"
    },
    {
      id: "hero",
      name: "2. Hero Banner Section (แบนเนอร์แนะนำ)",
      desc: "ส่วนต้อนรับผู้ใช้งานด้วยข้อความเชิญชวนหลัก ปุ่ม Call to Action (CTA) เพื่อนำทางไปยังหน้า Shop หรือหน้าออกแบบ Customizer ทันที"
    },
    {
      id: "features",
      name: "3. Value Proposition (จุดเด่นแพลตฟอร์ม)",
      desc: "แสดงจุดเด่น 3 อย่าง: Print-on-Demand (ไม่มีขั้นต่ำ), Premium Quality (ผ้าฝ้าย 100%), และ Fast Shipping (ส่งเร็วทั่วไทย)"
    },
    {
      id: "customizer-cta",
      name: "4. Custom Customizer Showcase (โปรโมทระบบออกแบบ)",
      desc: "พื้นที่โปรโมทฟีเจอร์เด่นให้นักออกแบบ/ลูกค้าสามารถสร้างเสื้อยืดลายของตนเองได้แบบ interactive 3D/2D mockup"
    },
    {
      id: "products",
      name: "5. Best Sellers / Marketplace (สินค้าขายดี)",
      desc: "การ์ดแสดงสินค้าและลายเสื้อยอดนิยมพร้อมปุ่มหัวใจ (Favorite) สไตล์ Overlay และข้อมูลราคา/ประเภทผ้า"
    },
    {
      id: "creator-cta",
      name: "6. Creator Recruitment (ชวนมาร่วมขาย)",
      desc: "ส่วนแนะนำสิทธิประโยชน์สำหรับนักออกแบบ เช่น รับส่วนแบ่งยอดขาย 20% โดยไม่ต้องจัดเก็บสต็อกเสื้อผ้าหรือจัดส่งเอง"
    },
    {
      id: "footer",
      name: "7. Footer Navigation (ข้อมูลท้ายหน้าเว็บ)",
      desc: "ลิงก์ไปยังเอกสารคู่มือต่างๆ นโยบายแพลตฟอร์ม โซเชียลมีเดีย และข้อมูลลิขสิทธิ์"
    }
  ];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-2">
            <Layout className="w-9 h-9 text-blue-600" />
            แบบร่างหน้าแรก (Homepage Wireframe)
          </h1>
          <p className="text-[15px] leading-7 text-slate-500 max-w-2xl">
            โครงสร้างและเลย์เอาต์การจัดวางองค์ประกอบหลักของหน้าแรก (Homepage Layout Map) สำหรับทุกขนาดหน้าจอ
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border rounded-xl shadow-sm transition-all bg-slate-50 hover:bg-slate-100 border-slate-200"
          >
            {showAnnotations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnnotations ? "ซ่อนคำอธิบาย" : "แสดงคำอธิบาย"}
          </button>
          
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewport === 'desktop' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-950"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewport === 'mobile' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-950"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Mockup Box */}
        <div className="flex-1 w-full flex justify-center bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-inner overflow-hidden min-h-[600px]">
          <div 
            className={`bg-white border-2 border-slate-300 rounded-2xl shadow-xl transition-all duration-300 relative flex flex-col font-mono text-[10px] text-slate-400 select-none ${
              viewport === 'desktop' ? "w-full max-w-[800px] aspect-[4/5]" : "w-[360px] aspect-[9/19]"
            }`}
          >
            {/* Mockup Header */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </span>
              <span className="text-[9px] bg-slate-200 px-4 py-0.5 rounded-md truncate max-w-[200px]">
                https://theshirtsy.com/
              </span>
              <span></span>
            </div>

            {/* Wireframe Page Body */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-3 bg-slate-100/50">
              
              {/* Header Container */}
              <div className="bg-white border-2 border-dashed border-slate-300 p-2.5 rounded-lg flex items-center justify-between relative">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">1</span>}
                <div className="font-bold text-slate-700">Logo</div>
                <div className="flex gap-2 text-[9px]">
                  <span>Home</span><span>Shop</span><span>Customizer</span>
                </div>
                <div className="bg-slate-200 px-2 py-0.5 rounded text-[8px]">Cart (0)</div>
              </div>

              {/* Hero Banner Container */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-6 rounded-lg text-center relative flex flex-col items-center justify-center gap-2 min-h-[120px]">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">2</span>}
                <div className="font-bold text-slate-800 text-sm">Hero Heading Message</div>
                <div className="text-[9px] max-w-[70%]">Sub-headline with details of our print-on-demand features.</div>
                <div className="flex gap-1.5 mt-1">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-[8px] font-bold">Shop Now</div>
                  <div className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-[8px] font-bold">Custom Design</div>
                </div>
              </div>

              {/* Value Proposition Grid */}
              <div className="grid grid-cols-3 gap-2 relative">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">3</span>}
                <div className="bg-white border-2 border-dashed border-slate-300 p-2.5 rounded-lg text-center flex flex-col items-center">
                  <span className="text-[12px] mb-0.5">👕</span>
                  <span className="font-bold text-slate-600 text-[8px]">No Minimum</span>
                </div>
                <div className="bg-white border-2 border-dashed border-slate-300 p-2.5 rounded-lg text-center flex flex-col items-center">
                  <span className="text-[12px] mb-0.5">⭐</span>
                  <span className="font-bold text-slate-600 text-[8px]">100% Cotton</span>
                </div>
                <div className="bg-white border-2 border-dashed border-slate-300 p-2.5 rounded-lg text-center flex flex-col items-center">
                  <span className="text-[12px] mb-0.5">🚀</span>
                  <span className="font-bold text-slate-600 text-[8px]">Fast Ship</span>
                </div>
              </div>

              {/* Customizer CTA Banner */}
              <div className="bg-blue-50 border-2 border-dashed border-slate-300 p-5 rounded-lg flex items-center justify-between gap-3 relative">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">4</span>}
                <div className="flex-1 flex flex-col gap-1">
                  <span className="font-bold text-blue-900 text-[11px]">Design Your Own T-Shirt</span>
                  <span className="text-blue-700 text-[8px]">Upload logo/art & customize colors</span>
                </div>
                <div className="bg-blue-600 text-white px-2.5 py-1 rounded text-[8px] font-bold flex items-center gap-1 shrink-0">
                  Try Customizer <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Best Seller List */}
              <div className="bg-white border-2 border-dashed border-slate-300 p-3 rounded-lg flex flex-col gap-2 relative">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">5</span>}
                <div className="font-bold text-slate-700">Featured Products</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].slice(0, viewport === 'desktop' ? 4 : 2).map((i) => (
                    <div key={i} className="border border-slate-200 rounded-md p-1.5 flex flex-col gap-1 bg-slate-50 relative">
                      <span className="absolute top-1 right-1 text-slate-400">❤️</span>
                      <div className="bg-white border border-slate-200 aspect-square rounded flex items-center justify-center">Mockup</div>
                      <div className="font-bold text-slate-700 text-[8px] truncate mt-1">Shirt Item #{i}</div>
                      <div className="text-slate-500 text-[8px]">฿370</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Banner */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-dashed border-slate-300 p-5 rounded-lg text-center relative flex flex-col items-center gap-1">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">6</span>}
                <span className="font-bold text-purple-950 text-[11px]">Join as The Shirtsy Creator</span>
                <span className="text-purple-700 text-[8px]">Upload your designs and earn a 20% revenue share commission!</span>
                <span className="bg-purple-600 text-white px-3 py-0.5 rounded-full text-[8px] font-bold mt-1">Start Designing</span>
              </div>

              {/* Footer */}
              <div className="bg-slate-900 border-2 border-dashed border-slate-700 p-4 rounded-lg text-center relative text-slate-500 text-[8px] flex flex-col gap-1.5 mt-auto">
                {showAnnotations && <span className="absolute -top-2.5 -left-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[9px] shadow-sm">7</span>}
                <div className="flex justify-center gap-4 text-slate-400">
                  <span>Policy</span><span>Developer Docs</span><span>FAQ</span>
                </div>
                <div>© 2026 The Shirtsy. All Rights Reserved.</div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Annotations Explanatory List */}
        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2.5 text-sm">
              <Info className="w-4.5 h-4.5 text-blue-600" />
              คำอธิบายโซนและองค์ประกอบ
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              คลิกปุ่มด้านบนเพื่อเลือกจำลองมุมมองแบบ Desktop หรือ Mobile และกดสลับเพื่อแสดงหรือซ่อนตัวเลขตำแหน่งแนะนำองค์ประกอบ (Annotations)
            </p>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {sections.map((section, idx) => (
                <div key={idx} className="border-b border-slate-200/60 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-blue-600 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-[10px] shrink-0 shadow-sm">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs">{section.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-7">{section.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
