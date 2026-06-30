"use client";

import { SlidersHorizontal, X, Upload, ShoppingCart } from "lucide-react";

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  selectedSleeves,
  setSelectedSleeves,
  uploadedFile,
  setUploadedFile,
  categories,
  colors,
  sizes,
  sleeveTypes,
  toggleItem,
  handleAddCustomPrint,
}) {
  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-80 bg-white z-[1000] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-800" />
              <h2 className="font-bold text-lg text-gray-800">Filters</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setSelectedSleeves([]);
                  setUploadedFile(null);
                }}
                className="text-sm text-gray-400 hover:text-black transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* หมวดหมู่สินค้า */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat ? null : cat)
                    }
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ประเภทแขนเสื้อ */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Sleeve Type</h3>
            <ul className="space-y-2">
              {sleeveTypes.map((sleeve) => (
                <li key={sleeve}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-black"
                      checked={selectedSleeves.includes(sleeve)}
                      onChange={() =>
                        toggleItem(setSelectedSleeves, selectedSleeves, sleeve)
                      }
                    />
                    <span className="text-sm text-gray-600">{sleeve}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* สีเสื้อ */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    toggleItem(setSelectedColors, selectedColors, color)
                  }
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColors.includes(color)
                      ? "ring-2 ring-black ring-offset-1"
                      : ""
                  } ${color === "#ffffff" ? "border border-gray-300" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* ไซส์ */}
          <div className="mb-6 pb-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    toggleItem(setSelectedSizes, selectedSizes, size)
                  }
                  className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-600 hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* อัปโหลดภาพสกรีน */}
          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-3 text-center leading-relaxed">
              เลือกรูปที่ต้องการสกรีนลงบนเสื้อ
            </p>
            {uploadedFile && (
              <p className="text-xs text-green-600 mb-2 text-center truncate">
                ✓ {uploadedFile.name}
              </p>
            )}
            <label className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-xl cursor-pointer transition-colors w-full">
              <Upload size={15} />
              <span className="text-sm font-medium">อัปโหลดรูป</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setUploadedFile(e.target.files[0] || null)}
              />
            </label>
          </div>
          <div className="mt-3">
            <button
              onClick={handleAddCustomPrint}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={15} />
              Add to cart
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
