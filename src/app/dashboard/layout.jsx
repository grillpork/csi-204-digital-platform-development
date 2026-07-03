"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search, 
  Store,
  ChevronDown,
  LogOut,
  User,
  Wallet
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/order", icon: ShoppingBag },
    { name: "ตรวจแบบเสื้อ", href: "/dashboard/designs", icon: Store },
    { name: "จัดการสเปกสินค้า", href: "/dashboard/catalog", icon: Settings },
    { name: "จัดการรายได้", href: "/dashboard/revenue", icon: Wallet },
  ];

  const getPageTitle = () => {
    if (pathname.includes("/overview")) return "Overview Analytics";
    if (pathname.includes("/order")) return "Order Management";
    if (pathname.includes("/designs")) return "ตรวจและอนุมัติแบบเสื้อ";
    if (pathname.includes("/catalog")) return "จัดการสเปกสินค้า (ประเภท, Size, คุณภาพ)";
    if (pathname.includes("/revenue")) return "จัดการรายได้ดีไซเนอร์";
    return "Admin Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      
      {/* 1. Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* 2. Sidebar (Desktop & Mobile Panel) */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="bg-white text-slate-900 w-8 h-8 rounded-lg flex items-center justify-center font-black">S</span>
            <span>Shirtsy Admin</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? "bg-white text-slate-900 shadow-md" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-slate-900" : "text-slate-400 group-hover:text-white"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Link back to store */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Store size={16} />
            <span>Back to Store Shop</span>
          </Link>
        </div>
      </aside>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-30 shadow-sm">
          {/* Left: Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-500 hover:text-slate-800"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Right: Actions & Admin Profile */}
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold flex items-center justify-center border border-slate-100 text-sm shadow-inner">
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800">Admin Staff</p>
                  <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    onClick={() => setShowProfileMenu(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1">
                    <Link 
                      href="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      <User size={14} /> My Profile
                    </Link>
                    <Link 
                      href="/"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={14} /> Back to Store
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
