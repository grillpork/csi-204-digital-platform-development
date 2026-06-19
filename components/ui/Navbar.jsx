"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <nav className="bg-[#fbc5db] px-4 md:px-6 py-4 flex items-center shadow-md w-full">
      <div className="max-w-9xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 shrink-0">
          <Link href="/" className="flex items-center select-none">
            <img
              src="/img/navbar/PopCustom.svg"
              alt="PopCustom"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Middle: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center space-x-1.5 justify-center">
          {/* Category Selector */}
          <button className="h-8 flex items-center space-x-1 px-3.5 bg-[#fbebe3] border border-[#ebd6cb] rounded-xl text-xs font-semibold text-[#6b4c4f] hover:bg-[#f6decb] transition-colors cursor-pointer select-none">
            <span>category</span>
            <svg className="w-2.5 h-2.5 text-[#9D7756]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Input container */}
          <div className="h-8 flex items-center bg-[#fae1ed] border border-[#e6ce92] rounded-full px-3.5 flex-1 shadow-inner">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent  text-[#6b4c4f] placeholder-[#a88d75] text-xs focus:outline-none flex-1 min-w-0"
            />
            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-0.5 text-[#a88d75] hover:text-[#6b4c4f] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Icon Button */}
          <button className="w-10 h-10 flex items-center justify-center bg-[#fbebe3] border border-[#ebd6cb] rounded-xl hover:bg-[#f6decb] transition-colors cursor-pointer shadow-xs">
            <img src="/img/navbar/icon-nav/search.svg" alt="Search" className="w-4 h-4" />
          </button>
        </div>

        {/* Right side: Actions & User Info */}
        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          {/* Notification Bell */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fbebe3] border border-[#e6ce92] hover:bg-[#f6decb] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs relative">
            <img src="/img/navbar/icon-nav/bell.svg" alt="Notifications" className="w-4 h-4" />
            {/* Notification Dot */}
            <span className="absolute top-1.5 right-1.5 bg-red-500 w-2.5 h-2.5 rounded-full border border-[#fbebe3]" />
          </button>

          {/* Shopping Cart */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fbebe3] border border-[#e6ce92] hover:bg-[#f6decb] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs relative"
          >
            <img src="/img/navbar/icon-nav/cart.svg" alt="Cart" className="w-4 h-4" />
            {/* Cart Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* User profile pill */}
          <div className="bg-white rounded-full border border-[#e6ce92] flex items-center p-0.5 pr-2.5 space-x-1.5 select-none hover:bg-slate-50 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer shadow-xs">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-200/50 flex items-center justify-center bg-[#fbc5db]">
              <img
                src="/img/navbar/proflie-madison.png"
                alt="Madison Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-[#6b4c4f] hidden sm:inline-block">Madisan</span>
            <img src="/img/navbar/icon-nav/dd-proflie.svg" alt="Dropdown" className="w-2.5 h-1.5" />
          </div>
        </div>
      </div>
    </nav>
  );
}
