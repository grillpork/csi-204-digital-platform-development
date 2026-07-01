"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, User, LogOut, Edit3, Package, ShoppingBag, Truck, ChevronDown, Home, Palette, FileText, ShoppingCart } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/context/AuthContext";

export default function NavbarA() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownItems = [
    { label: "โปรไฟล์ของฉัน", href: "/profile", icon: User },
    { label: "แก้ไขโปรไฟล์", href: "/profile/edit", icon: Edit3 },
    { label: "สินค้าของฉัน", href: "/profile/products", icon: Package },
    { label: "สินค้าที่ถูกใจ", href: "/profile/favorites", icon: Heart },
    { label: "ประวัติการสั่งซื้อ", href: "/profile/orders", icon: ShoppingBag },
    { label: "ติดตามพัสดุ", href: "/tracking", icon: Truck },
  ];

  // Hide navbar on login, register, and dashboard pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/dashboard");
  if (isAuthPage) return null;

  const menuItems = [
    { label: "หน้าแรก", href: "/", icon: Home },
    { label: "ติดตามพัสดุ", href: "/tracking", icon: Truck },
    { label: "สั่งทำเสื้อ", href: "/custom", icon: Palette },
    { label: "เอกสาร", href: "/docs/policy", icon: FileText }
  ];

  return (
    <header className="w-full h-[76px] bg-white border-b border-gray-200 flex items-center relative z-50">
      <div className="fixed w-full h-[76px] bg-white border-b border-gray-200 z-50">
        <nav className="flex items-center justify-around gap-8 px-6 py-6 max-w-7xl mx-auto text-black">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-85 transition-opacity">
            The Shirtsy
          </Link> 
          <div className="flex gap-12">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-1.5 text-sm hover:text-black transition-colors ${
                    pathname === item.href ? "text-black font-semibold" : "text-gray-600"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4">
            <Suspense fallback={
              <button className="relative inline-flex hover:text-black cursor-pointer transition-colors">
                <ShoppingCart size={20} />
              </button>
            }>
              <CartDrawer
                size={20}
                className="hover:text-black cursor-pointer transition-colors"
              />
            </Suspense>
            {loading ? (
              <span className="inline-block h-8 w-8 animate-pulse rounded-full bg-slate-100" aria-label="กำลังตรวจสอบสถานะเข้าสู่ระบบ" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100/80 rounded-full pl-1.5 pr-2.5 py-1 flex items-center gap-1.5 max-w-[170px] truncate cursor-pointer focus:outline-none"
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=0F172A&color=fff&bold=true&rounded=true&size=32`} 
                    alt="User Profile" 
                    className="w-5 h-5 rounded-full shrink-0"
                  />
                  <span className="truncate">{user.name || user.email}</span>
                  <ChevronDown size={12} className="text-slate-400 shrink-0" />
                </button>

                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1 flex flex-col gap-0.5">
                      {dropdownItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
                          >
                            <Icon size={14} className="text-slate-400" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all text-left"
                      >
                        <LogOut size={14} className="text-red-400" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" aria-label="เข้าสู่ระบบ" className="inline-flex p-1">
                <User
                  size={20}
                  className="hover:text-black cursor-pointer transition-colors"
                />
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
