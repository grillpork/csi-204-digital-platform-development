"use client";

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { BookOpen, Shield, Settings, Menu } from 'lucide-react';

const DocsLayout = ({ children }) => {
    const pathname = usePathname();

    const getLinkClass = (href) => {
        const isActive = pathname === href;
        return `flex items-center px-3 py-2 text-sm font-semibold rounded-xl transition-all ${
            isActive 
                ? "bg-blue-50 text-blue-700 shadow-sm font-bold" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;
    };

    return (
        <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased">
            {/* Load Mermaid.js for drawing diagrams */}
            <Script 
                src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" 
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.mermaid) {
                        window.mermaid.initialize({ startOnLoad: true, theme: 'default' });
                        window.mermaid.contentLoaded();
                    }
                }}
            />

            {/* Sidebar */}
            <aside className="w-64 bg-slate-50 border-r border-slate-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <span className="text-lg font-semibold tracking-tight text-slate-900">เอกสารคู่มือ</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-6">
                    {/* Overview */}
                    <div className="px-4 mb-6">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">ภาพรวม</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs/policy" className={getLinkClass("/docs/policy")}>
                                    นโยบายและข้อตกลง
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/systems" className={getLinkClass("/docs/systems")}>
                                    ข้อมูลระบบ (Systems)
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/wireframe-homepage" className={getLinkClass("/docs/wireframe-homepage")}>
                                    แบบร่างหน้าแรก (Wireframe)
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/api" className={getLinkClass("/docs/api")}>
                                    รายละเอียด API (API Routes)
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/schema" className={getLinkClass("/docs/schema")}>
                                    โครงสร้าง Database Schema
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/faq" className={getLinkClass("/docs/faq")}>
                                    คำถามที่พบบ่อย (FAQ)
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/contact" className={getLinkClass("/docs/contact")}>
                                    ติดต่อเรา
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/developers" className={getLinkClass("/docs/developers")}>
                                    ทีมผู้พัฒนา (Developers)
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Buyers */}
                    <div className="px-4 mb-6">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">สำหรับลูกค้า</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs/buyers" className={getLinkClass("/docs/buyers")}>
                                    คู่มือการสั่งสกรีนเสื้อ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Creators */}
                    <div className="px-4 mb-6">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">สำหรับนักออกแบบ</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs/creators" className={getLinkClass("/docs/creators")}>
                                    คู่มือเปิดร้านและขายลายเสื้อ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Header (Mobile) */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:hidden">
                    <button className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none">
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="ml-4 text-sm font-semibold text-slate-900">เอกสารคู่มือ</span>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto scroll-smooth bg-white">
                    <div className="max-w-[1200px] mx-auto w-full h-full p-6 md:p-10 lg:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DocsLayout;