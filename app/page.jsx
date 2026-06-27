"use client";
import CartDrawer from "../components/ui/CartDrawer";
import { useProductStore } from "../store/product";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Upload,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  Heart,
  User,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import NavbarA from "../components/ui/NavbarA";
import HeroBanner from "../components/ui/HeroBanner";
import Pagination from "../components/ui/Pagination";
import { mockProducts } from "./data/products";

const categories = ["เสื้อยืด", "เสื้อโปโล", "ฮู้ดดี้", "แขนยาว", "เสื้อกล้าม"];
const colors = [
  "#000000",
  "#ffffff",
  "#9CA3AF",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#A855F7",
];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const sleeveTypes = ["แขนยาว", "แขนสั้น", "ไม่มีแขน"];

export default function ProductsPage() {
  const [lang, setLang] = useState("EN");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const addToCart = useProductStore((state) => state.addToCart);

  const toggleLang = () => setLang((l) => (l === "EN" ? "TH" : "EN"));
  const toggleItem = (setter, list, item) =>
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );

  // กดแล้วเพิ่ม สินค้า เข้าตะกร้า 
  const handleAddCustomPrint = () => {
    addToCart({
      id: "custom-print",
      name: "เสื้อสกรีนลายตามสั่ง",
      price: 390,
      image: uploadedFile
        ? URL.createObjectURL(uploadedFile)
        : "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarA lang={lang} onLangToggle={toggleLang} />
      <HeroBanner />

      {/* max-w-7xl mx-auto: จัดให้ส่วน "All Product" ทั้งหมด (sidebar + grid) อยู่กลางจอ ขอบซ้าย-ขวาเท่ากัน */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Filters sidebar */}
        <aside className="w-64 mt-8 flex-shrink-0">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-800">ตัวกรอง</h2>
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
              ล้างค่า
            </button>
          </div>

          {/* หมวดหมู่สินค้า */}
          <div className="mb-6 pb-5 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">หมวดหมู่สินค้า</h3>
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
          <div className="mb-6 pb-5 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">ประเภทแขนเสื้อ</h3>
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
          <div className="mb-6 pb-5 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">สี</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    toggleItem(setSelectedColors, selectedColors, color)
                  }
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColors.includes(color)
                      ? "scale-110 ring-2 ring-black ring-offset-1"
                      : ""
                  } ${color === "#ffffff" ? "border border-gray-300" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* ไซส์ */}
          <div className="mb-6 pb-5 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">ไซส์</h3>
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

          {/* อัปโหลดภาพสกรีน — แค่ UI ยังไม่ได้ส่งไฟล์ไปไหน */}
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
        </aside>

        {/* สินค้า + ช่องค้นหา */}
        <main className="flex-1 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">สินค้าทั้งหมด</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 gap-2 w-60 focus-within:border-gray-500">
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                />
              </div>
              <button className="border border-gray-300 rounded-xl p-2.5 hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={15} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col group"
              >
                <Link href={`/product/${product.id}`} className="block flex-1 flex flex-col">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <p className="font-medium text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < product.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 mb-4 text-lg">
                    ฿{product.price}
                  </p>
                  </div>
                </Link>
                <div className="p-4 pt-0">
                  <div className="flex gap-2">
                    <Link href={`/custom?id=${product.id}`} className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                      ออกแบบเอง
                    </Link>
                    <button onClick={(e) => { e.preventDefault(); handleAddCustomPrint(); }} className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors">
                      <ShoppingCart size={14} />
                      ใส่ตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
}
