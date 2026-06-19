"use client";

import React from "react";
import SidebarFilter from "../components/SidebarFilter";
import HeroBanner from "../components/HeroBanner";
import Product from "../components/ui/Product";
import { useCart } from "../context/CartContext";

export default function Page() {
  const { isCartOpen } = useCart();

  // Array of 8 real products matching mockup
  const products = [
    {
      id: 1,
      title: "White Polo for woman Lady Gaga style",
      image: "/img/product/1.jpeg",
      rating: 4.5,
      itemsSold: 49,
      price: "B290.00"
    },
    {
      id: 2,
      title: "kid scott shirt for boy and girl",
      image: "/img/product/2.jpg",
      rating: 4.5,
      itemsSold: 149,
      price: "B199.00"
    },
    {
      id: 3,
      title: "Pink modern dress for little lady",
      image: "/img/product/3.webp",
      rating: 4.5,
      itemsSold: 499,
      price: "B320.00"
    },
    {
      id: 4,
      title: "Reddy Grey Textured Pet T-Shirt",
      image: "/img/product/4.avif",
      rating: 4.5,
      itemsSold: 49,
      price: "B190.00"
    },
    {
      id: 5,
      title: "Men’s Striped Knit Polo Shirt",
      image: "/img/product/5.webp",
      rating: 4.5,
      itemsSold: 49,
      price: "B390.00"
    },
    {
      id: 6,
      title: "Custard T-shirt for teen woman",
      image: "/img/product/6.jpeg",
      rating: 4.5,
      itemsSold: 49,
      price: "B290.00"
    },
    {
      id: 7,
      title: "Cutie Bow T-shirt for kitten",
      image: "/img/product/7.webp",
      rating: 4.5,
      itemsSold: 49,
      price: "B320.00"
    },
    {
      id: 8,
      title: "Men’s Black T-shirt super sport style",
      image: "/img/product/8.jpeg",
      rating: 4.5,
      itemsSold: 49,
      price: "B290.00"
    }
  ];

  const cartItems = [
    {
      id: 7,
      title: "Cutie Bow T-shirt for kitten",
      image: "/img/product/7.webp",
      uploadStatus: "x1 upload logo",
      price: "B 320.00"
    },
    {
      id: 3,
      title: "Pink modern dress for little lady",
      image: "/img/product/3.webp",
      uploadStatus: "x1 upload logo",
      price: "B 320.00"
    }
  ];

  return (
    <div className="max-w-9xl mx-auto w-full px-4 md:px-6 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar Filter */}
      <SidebarFilter />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[780px] flex flex-col gap-6">
        {/* Hero Banner with Categories */}
        <HeroBanner />

        {/* Product Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#9c653f] tracking-wide">
            All Product
          </h2>
          
          {/* Grid Layout (4 columns on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Product
                key={product.id}
                title={product.title}
                image={product.image}
                rating={product.rating}
                itemsSold={product.itemsSold}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cart Column */}
      {isCartOpen && (
        <div className="w-full md:w-72 sm:w-[310px] bg-white border border-[#ebd6cb] rounded-3xl p-4 shadow-sm  self-start text-slate-800 animate-in fade-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-800">My cart (2)</h3>
            <div className="flex items-center space-x-1.5">
              <button className="text-[11px] text-slate-400 font-semibold hover:text-slate-600 transition-colors cursor-pointer">edit</button>
              <button className="w-4 h-4 flex items-center justify-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-3.5 my-3 max-h-72 overflow-y-auto pr-0.5 scrollbar-thin">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2.5 py-1">
                {/* Checkbox (Radio design) */}
                <div className="w-4 h-4 rounded-full border border-[#ebd6cb] bg-white flex items-center justify-center flex-shrink-0 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7c5c43]" />
                </div>

                {/* Product image */}
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-14">
                  <h4 className="text-xs font-semibold text-slate-800 truncate">{item.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-slate-400 font-medium">{item.uploadStatus}</span>
                      <button className="text-slate-400 hover:text-[#7c5c43] transition-colors cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-1">
                      <button className="w-4 h-4 flex items-center justify-center rounded bg-[#fbebe3] text-[#7c5c43] font-bold text-[10px] hover:bg-[#f6decb] transition-colors cursor-pointer select-none">-</button>
                      <span className="text-[10px] font-semibold px-1.5 text-slate-700">1</span>
                      <button className="w-4 h-4 flex items-center justify-center rounded bg-[#fbebe3] text-[#7c5c43] font-bold text-[10px] hover:bg-[#f6decb] transition-colors cursor-pointer select-none">+</button>
                    </div>
                    {/* Price */}
                    <span className="text-xs font-bold text-slate-800">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
            <div className="flex items-center space-x-1.5 cursor-pointer select-none">
              <div className="w-4 h-4 rounded-full border border-[#ebd6cb] bg-slate-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-[#7c5c43] fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">select all (2)</span>
            </div>
            <button className="px-5 py-2 bg-[#7c5c43] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#684b34] active:scale-95 transition-all cursor-pointer">
              Pay now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
