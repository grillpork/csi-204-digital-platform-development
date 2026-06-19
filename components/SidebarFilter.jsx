"use client";

import React, { useState } from "react";

export default function SidebarFilter() {
  // Cities state
  const [selectedCities, setSelectedCities] = useState([
    "Bangkok", "Nontaburi", "Cholburi", "Nakornnayok", "Chanthaburi",
    "Loei", "Chiangmai", "Khonkaen", "Udornthani", "Krabi"
  ]);

  // Colors state
  const [selectedColors, setSelectedColors] = useState(["white"]);

  const cities = [
    "Bangkok", "Nontaburi", "Cholburi", "Nakornnayok", "Chanthaburi",
    "Loei", "Chiangmai", "Khonkaen", "Udornthani", "Krabi"
  ];

  const colorOptions = [
    { name: "red", hex: "#ef4444", class: "bg-red-600" },
    { name: "Blue", hex: "#2563eb", class: "bg-blue-600" },
    { name: "green", hex: "#16a34a", class: "bg-green-600" },
    { name: "pink", hex: "#db2777", class: "bg-pink-500" },
    { name: "white", hex: "#ffffff", class: "bg-white border border-slate-300" },
    { name: "black", hex: "#000000", class: "bg-black" }
  ];

  const handleCityToggle = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleColorToggle = (colorName) => {
    const nameLower = colorName.toLowerCase();
    if (selectedColors.includes(nameLower)) {
      setSelectedColors(selectedColors.filter(c => c !== nameLower));
    } else {
      setSelectedColors([...selectedColors, nameLower]);
    }
  };

  const clearAll = () => {
    setSelectedCities([]);
    setSelectedColors([]);
  };

  return (
    <div className="w-full md:w-60 bg-[#fdf2f7]/20 border border-pink-100/40 rounded-3xl p-4 shadow-xs space-y-4 flex-shrink-0">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-pink-900 tracking-wide">filter</h2>
        <button
          onClick={clearAll}
          className="text-[10px] font-semibold text-pink-500 hover:text-pink-700 transition-colors bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100"
        >
          clear all
        </button>
      </div>

      {/* Active Filters Section */}
      <div className="bg-[#f0f7fd]/80 border border-blue-100/40 rounded-2xl p-2.5 space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          {/* Default static item matching the mockup */}
          <div className="bg-white border border-pink-100 px-2 py-0.5 rounded-full text-[10px] text-pink-700 flex items-center space-x-1 font-medium shadow-2xs">
            <span>BangKhen</span>
            <button className="hover:text-pink-900 font-bold ml-1">×</button>
          </div>
          
          {selectedColors.map(color => (
            <div key={color} className="bg-white border border-pink-100 px-2 py-0.5 rounded-full text-[10px] text-pink-700 flex items-center space-x-1 font-medium shadow-2xs">
              <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1 ${
                color === "white" ? "bg-white border border-slate-300" : 
                color === "red" ? "bg-red-600" :
                color === "blue" ? "bg-blue-600" :
                color === "green" ? "bg-green-600" :
                color === "pink" ? "bg-pink-500" : "bg-black"
              }`} />
              <span className="capitalize">{color}</span>
              <button 
                onClick={() => handleColorToggle(color)} 
                className="hover:text-pink-900 font-bold ml-1"
              >
                ×
              </button>
            </div>
          ))}

          {selectedCities.slice(0, 1).map(city => (
            <div key={city} className="bg-white border border-pink-100 px-2 py-0.5 rounded-full text-[10px] text-pink-700 flex items-center space-x-1 font-medium shadow-2xs">
              <span>{city}</span>
              <button 
                onClick={() => handleCityToggle(city)} 
                className="hover:text-pink-900 font-bold ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* City Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-pink-100/40">
          <span className="text-sm font-bold text-pink-950">city</span>
          <svg className="w-3.5 h-3.5 text-pink-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-200">
          {cities.map((city) => {
            const isChecked = selectedCities.includes(city);
            return (
              <div
                key={city}
                onClick={() => handleCityToggle(city)}
                className="flex items-center justify-between py-0.5 px-1.5 rounded-lg hover:bg-pink-50/50 cursor-pointer transition-colors select-none"
              >
                <span className="text-xs text-pink-900 font-medium">{city}</span>
                <div 
                  className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border transition-colors ${
                    isChecked 
                      ? "bg-[#fdf2ee] border-[#b45309] text-[#b45309]" 
                      : "border-pink-200 bg-white"
                  }`}
                >
                  {isChecked && (
                    <svg className="w-3 h-3 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Section */}
      <div className="space-y-2">
        <div className="pb-1 border-b border-pink-100/40">
          <span className="text-sm font-bold text-pink-950">color</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {colorOptions.map((color) => {
            const isSelected = selectedColors.includes(color.name.toLowerCase());
            return (
              <button
                key={color.name}
                onClick={() => handleColorToggle(color.name)}
                className={`flex items-center space-x-1.5 py-1 px-2 rounded-full border transition-all text-[10px] font-semibold cursor-pointer ${
                  isSelected 
                    ? "bg-pink-50 border-pink-300 text-pink-950 shadow-2xs" 
                    : "bg-white border-slate-100 hover:border-pink-200 text-slate-600"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.class}`} />
                <span className="truncate">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
