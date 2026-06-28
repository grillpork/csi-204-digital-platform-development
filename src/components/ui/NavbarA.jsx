"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, User, LogOut } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useAuth } from "@/context/AuthContext";

export default function NavbarA() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Hide navbar on login and register pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  const isHome = pathname === "/";
  const menuItems = ["หน้าแรก", "ร้านค้า", "บทความ", "เกี่ยวกับเรา"];

  if (isHome) {
    return (
      <header className="w-full bg-yellow-50/10 border-b border-gray-200 flex items-center relative z-50">
        <div className="max-w-[1440px] mx-auto w-full">
          <nav className="py-8 bg-white rounded-b-2xl text-black justify-around z-[999] fixed inset-x-0 max-w-7xl mx-auto flex items-center gap-8 shadow-sm">
            <div className="text-xl font-bold tracking-tight">
              The Shirtsy
            </div> 
            <div className="flex gap-12">
              {menuItems.map((item) => (
                <div
                  key={item}
                  className="text-sm hover:text-black cursor-pointer transition-colors font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <CartDrawer
                size={20}
                className="hover:text-black cursor-pointer transition-colors"
              />
              <Heart
                size={20}
                className="hover:text-black cursor-pointer transition-colors"
              />
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <span className="text-xs text-gray-500 hover:text-slate-800 transition-colors font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100/80 rounded-full pl-1.5 pr-3 py-1 flex items-center gap-1.5 max-w-[150px] truncate cursor-pointer">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=0F172A&color=fff&bold=true&rounded=true&size=32`} 
                        alt="User Profile" 
                        className="w-5 h-5 rounded-full shrink-0"
                      />
                      {user.email}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link href="/login">
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

  return (
    <header className="w-full h-[76px] bg-white border-b border-gray-200 flex items-center relative z-50">
      <div className="fixed w-full h-[76px] bg-white border-b border-gray-200 z-50">
        <nav className="flex items-center justify-around gap-8 px-6 py-6 max-w-7xl mx-auto text-black">
          <div className="text-xl font-bold tracking-tight">
            The Shirtsy
          </div> 
          <div className="flex gap-12">
            {menuItems.map((item) => (
              <div
                key={item}
                className="text-sm hover:text-black cursor-pointer transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <CartDrawer
              size={20}
              className="hover:text-black cursor-pointer transition-colors"
            />
            <Heart
              size={20}
              className="hover:text-black cursor-pointer transition-colors"
            />
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <span className="text-xs text-gray-500 hover:text-slate-800 transition-colors font-medium border border-gray-200 bg-gray-50 hover:bg-gray-100/80 rounded-full pl-1.5 pr-3 py-1 flex items-center gap-1.5 max-w-[150px] truncate cursor-pointer">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=0F172A&color=fff&bold=true&rounded=true&size=32`} 
                      alt="User Profile" 
                      className="w-5 h-5 rounded-full shrink-0"
                    />
                    {user.email}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login">
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
