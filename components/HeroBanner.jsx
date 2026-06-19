"use client";

import React from "react";

export default function HeroBanner() {
  const categories = [
    { name: "Kid", image: "/img/hero/1.jpg" },
    { name: "Plus size", image: "/img/hero/2.jpg" },
    { name: "Lady", image: "/img/hero/3.jpg" },
    { name: "Gentleman", image: "/img/hero/4.jpg" },
    { name: "pet", image: "/img/hero/5.jpg" },
  ];

  return (
    <div className="w-full bg-[#FFFDE1] border border-[#fbf8cc]/50 rounded-3xl  shadow-xs space-y-3">
      {/* Promo Banner Image */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm">
        <img
          src="/img/hero/banner.png"
          alt="Create Your Custom Look! Upload your logo today!"
          className="w-full h-auto object-cover select-none"
        />
      </div>

      {/* Categories Circle List */}
      <div className="flex flex-wrap mt-10 mb-10 items-center justify-center gap-3 sm:gap-5 py-0.5">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center space-y-1 cursor-pointer group">
            {/* Circular Image Container */}
            <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full overflow-hidden border-2 border-white shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Label */}
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#9c653f] group-hover:text-pink-600 transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
