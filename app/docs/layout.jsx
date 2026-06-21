import React from 'react';
import Link from 'next/link';
import { BookOpen, Shield, Settings, Menu } from 'lucide-react';

const DocsLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#0a0a0a] text-[#ededed] font-sans antialiased">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-[#1a1a1a]">
                    <span className="text-lg font-semibold tracking-tight text-white">เอกสารคู่มือ</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-6">
                    {/* Overview */}
                    <div className="px-4 mb-6">
                        <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 px-2">ภาพรวม</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs/policy" className="flex items-center px-2 py-1.5 text-sm font-medium text-[#a1a1aa] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                    นโยบายและข้อตกลง
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/systems" className="flex items-center px-2 py-1.5 text-sm font-medium text-[#a1a1aa] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                    ข้อมูลระบบ (Systems)
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/faq" className="flex items-center px-2 py-1.5 text-sm font-medium text-[#a1a1aa] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                    คำถามที่พบบ่อย (FAQ)
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs/contact" className="flex items-center px-2 py-1.5 text-sm font-medium text-[#a1a1aa] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                    ติดต่อเรา
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Buyers */}
                    <div className="px-4 mb-6">
                        <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 px-2">สำหรับลูกค้า</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs/buyers" className="flex items-center px-2 py-1.5 text-sm font-medium text-[#a1a1aa] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                    คู่มือการสั่งสกรีนเสื้อ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Creators */}
                    <div className="px-4 mb-6">
                        <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 px-2">สำหรับนักออกแบบ</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/docs/creators" className="flex items-center px-2 py-1.5 text-sm font-medium text-[#a1a1aa] rounded-md hover:bg-[#1a1a1a] hover:text-white transition-colors">
                                    คู่มือเปิดร้านและขายลายเสื้อ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
                {/* Header (Mobile) */}
                <header className="h-16 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center px-4 md:hidden">
                    <button className="p-2 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] focus:outline-none">
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="ml-4 text-sm font-semibold text-white">เอกสารคู่มือ</span>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto scroll-smooth bg-[#0a0a0a]">
                    <div className="max-w-[1200px] mx-auto w-full h-full p-6 md:p-10 lg:p-12">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DocsLayout;