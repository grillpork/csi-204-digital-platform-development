"use client";
import CartDrawer from "../components/ui/CartDrawer";
import { useProductStore } from "../store/product";
import { useState } from "react";
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

// แถบ navbar ของหน้าสินค้า: เป็น nav สีดำแบบ fixed (โลโก้, เมนู, ไอคอนตะกร้า/หัวใจ/โปรไฟล์, ปุ่มเปลี่ยนภาษา)
// ลอยอยู่เหนือรูปแบนเนอร์ จุดที่แก้ width: ต้องใส่ inset-x-0 ที่ nav เองเลย เพราะ "fixed" จะไม่ยืดตาม parent ให้
function NavbarA({ lang, onLangToggle }) {
  return (
    <header className="w-full bg-yellow-50/10 border-b border-gray-200  flex items-center ">
      
      <div className="max-w-[1440px] bg-red-500 mx-auto">
        
        <nav className=" py-8  bg-white rounded-b-2xl text-black justify-around z-999 fixed inset-x-0 max-w-7xl mx-auto flex items-center gap-8">
          <div className="text-xl font-bold tracking-tight">
        The Shirtsy
      </div> 
      <div className="flex gap-12">
        {["Home", "Shop", "Blog", "About"].map((item) => (
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
          className=" hover:text-black cursor-pointer transition-colors"
        />
        <Heart
          size={20}
          className=" hover:text-black cursor-pointer transition-colors"
        />
        <User
          size={20}
          className=" hover:text-black cursor-pointer transition-colors"
        />
        <button
          onClick={onLangToggle}
          className="text-xs border border-gray-300 rounded px-2 py-1 hover:border-black hover:text-black transition-colors"
        >
          {lang === "EN" ? "EN" : "TH"}
        </button>
      </div>
        </nav>
      </div>

      
      {
        <div className=" absolute top-0 w-full h-[550px] overflow-clip">
          <img
            className="w-full"
            src="https://i.pinimg.com/736x/d8/ee/0a/d8ee0a2e063132ba0867b4242add1391.jpg"
            alt=""
          />
        </div>
      }
    </header>
  );
}

// Pagination ตามดีไซน์ที่อ้างอิง (@SCR-20260618-msaz.png):
// ปุ่ม Previous/Next แบบ pill อยู่หัว-ท้าย เลขหน้าอยู่กลาง หน้าที่เลือกอยู่จะถูก highlight
function getPageNumbers(totalPages) {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
  return [1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages];
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = getPageNumbers(totalPages);
  return (
    <div className="flex items-center justify-between mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-black transition-colors"
      >
        <ArrowLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
                p === currentPage
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-black transition-colors"
      >
        Next
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// รายการสินค้าจำลอง — ทำแค่ UI ยังไม่ได้เชื่อม backend
const mockProducts = [
  {
    id: 1,
    name: "Product",
    price: 370,
    rating: 4,
    reviews: 120,
    image:
      "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
  },
  {
    id: 2,
    name: "Product",
    price: 370,
    rating: 4,
    reviews: 98,
    image:
      "https://cdn-images.farfetch-contents.com/24/09/63/05/24096305_54170622_600.jpg",
  },
  {
    id: 3,
    name: "Product",
    price: 370,
    rating: 5,
    reviews: 210,
    image:
      "https://editorialist.com/thumbnails/600/2024/11/032/965/456/32965456~black_2.webp",
  },
  {
    id: 4,
    name: "Product",
    price: 370,
    rating: 3,
    reviews: 55,
    image:
      "https://vspconsignment.com/cdn/shop/files/Gucci-back-monogram-embrd-top4_2400x.jpg?v=1759273918",
  },
  {
    id: 5,
    name: "Product",
    price: 370,
    rating: 4,
    reviews: 88,
    image:
      "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
  },
  {
    id: 6,
    name: "Product",
    price: 370,
    rating: 5,
    reviews: 175,
    image:
      "https://cdn-images.farfetch-contents.com/24/09/63/05/24096305_54170622_600.jpg",
  },
  {
    id: 7,
    name: "Product",
    price: 370,
    rating: 4,
    reviews: 63,
    image:
      "https://editorialist.com/thumbnails/600/2024/11/032/965/456/32965456~black_2.webp",
  },
  {
    id: 8,
    name: "Product",
    price: 370,
    rating: 3,
    reviews: 40,
    image:
      "https://vspconsignment.com/cdn/shop/files/Gucci-back-monogram-embrd-top4_2400x.jpg?v=1759273918",
  },
  {
    id: 9,
    name: "Product",
    price: 370,
    rating: 4,
    reviews: 132,
    image:
      "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
  },
];

const categories = ["T-Shirt", "Polo", "Hoodie", "Long Sleeve", "Tank Top"];
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
const sleeveTypes = ["Long Sleeve", "Short Sleeve", "No Sleeve"];

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

      {/* max-w-7xl mx-auto: จัดให้ส่วน "All Product" ทั้งหมด (sidebar + grid) อยู่กลางจอ ขอบซ้าย-ขวาเท่ากัน */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Filters sidebar — mt-140 ดันลงมาให้พ้น fixed navbar + รูปแบนเนอร์ */}
        <aside className="w-64 mt-140 flex-shrink-0">
          <div className="flex  justify-between items-center mb-5 pb-4 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-800">Filters</h2>
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
          </div>

          {/* หมวดหมู่สินค้า */}
          <div className="mb-6 pb-5 border-b border-gray-200">
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
          <div className="mb-6 pb-5 border-b border-gray-200">
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
          <div className="mb-6 pb-5 border-b border-gray-200">
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

        //* สินค้า + ช่องค้นหา
        <main className="flex-1 mt-140">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">All Product</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 gap-2 w-60 focus-within:border-gray-500">
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search product..."
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
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-800 text-sm mb-1">
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
                      {product.reviews}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 mb-3">
                    ฿{product.price}
                  </p>
                  <button onClick={handleAddCustomPrint} className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors">
                    <ShoppingCart size={14} />
                    Add to cart
                  </button>
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
