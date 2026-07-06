"use client";
import CartDrawer from "@/components/ui/CartDrawer";
import FilterDrawer from "@/components/ui/FilterDrawer";
import { useProductStore } from "@/store/product";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  X,
} from "lucide-react";

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
        disabled={currentPage === 1}
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
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm text-gray-700 hover:border-black transition-colors"
      >
        Next
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

// Categories and filters metadata
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
const ITEMS_PER_PAGE = 60;
const categoryValues = { "T-Shirt": "TSHIRT", Polo: "POLO", Hoodie: "HOODIE", "Long Sleeve": "LONG_SLEEVE", "Tank Top": "TANK_TOP" };
const colorValues = { "#000000": "Black", "#ffffff": "White", "#9CA3AF": "Gray", "#EF4444": "Red", "#F97316": "Orange", "#EAB308": "Yellow", "#22C55E": "Green", "#3B82F6": "Blue", "#A855F7": "Purple" };

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sizeModalProduct, setSizeModalProduct] = useState(null);
  const [selectedModalSize, setSelectedModalSize] = useState(null);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error || "โหลดสินค้าไม่สำเร็จ"); return j; })
      .then((j) => setProducts(j.data || []))
      .catch((error) => setProductError(error.message))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    if (!user) return setFavoriteIds(new Set());
    fetch('/api/favorites').then(r=>r.ok?r.json():{data:[]}).then(j=>setFavoriteIds(new Set((j.data||[]).map(p=>p.id))));
  }, [user]);

  const handleFavorite = async (productId) => {
    if (!user) return router.push('/login');
    const active = favoriteIds.has(productId);
    const res = await fetch('/api/favorites',{method:active?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId})});
    if (res.ok) setFavoriteIds(prev=>{const next=new Set(prev);active?next.delete(productId):next.add(productId);return next});
  };

  const displayProducts = products;
  const filteredProducts = displayProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = !selectedCategory || product.category === categoryValues[selectedCategory];
    const matchesColor = selectedColors.length === 0 || selectedColors.some((color) => product.colors?.includes(colorValues[color]));
    const matchesSize = selectedSizes.length === 0 || selectedSizes.some((size) => product.sizes?.includes(size));
    return matchesSearch && matchesCategory && matchesColor && matchesSize;
  });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [search, selectedCategory, selectedColors, selectedSizes, selectedSleeves]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const element = document.getElementById("product-list");
    if (element) {
      const offset = 100; // Offset to clear sticky header and spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, [currentPage]);

  const addToCart = useProductStore((state) => state.addToCart);

  const toggleLang = () => setLang((l) => (l === "EN" ? "TH" : "EN"));
  const toggleItem = (setter, list, item) =>
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );

  // กดแล้วเพิ่ม สินค้า เข้าตะกร้า
  const handleAddCustomPrint = async () => {
    await addToCart({
      id: "custom-print",
      name: "เสื้อสกรีนลายตามสั่ง",
      price: 390,
      image: uploadedFile
        ? URL.createObjectURL(uploadedFile)
        : "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
    });
  };

  // กดแล้วเปิด Modal ให้เลือกไซส์ก่อนเพิ่มลงตะกร้า
  const handleAddToCart = (product) => {
    setSizeModalProduct(product);
    if (product.sizes && product.sizes.length > 0) {
      setSelectedModalSize(product.sizes[0]);
    } else {
      setSelectedModalSize('M');
    }
  };

  // กดยืนยันจาก Modal เพื่อบันทึกลงตะกร้าจริงๆ
  const confirmAddToCart = async () => {
    if (!sizeModalProduct) return;
    const color = sizeModalProduct.colors?.[0] || 'White';
    await addToCart(sizeModalProduct, 1, selectedModalSize, color);
    setSizeModalProduct(null);
  };

  return (
    <div className="min-h-screen bg-white">


      {/* Banner image */}
      <div className="absolute top-0 w-full h-[550px] overflow-hidden pointer-events-none z-0">
        <img
          className="w-full object-cover"
          src="https://i.pinimg.com/736x/d8/ee/0a/d8ee0a2e063132ba0867b4242add1391.jpg"
          alt="Banner"
        />
      </div>

      {/* max-w-7xl mx-auto: จัดให้ส่วน "All Product" ทั้งหมด (sidebar + grid) อยู่กลางจอ ขอบซ้าย-ขวาเท่ากัน */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
        selectedSleeves={selectedSleeves}
        setSelectedSleeves={setSelectedSleeves}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        categories={categories}
        colors={colors}
        sizes={sizes}
        sleeveTypes={sleeveTypes}
        toggleItem={toggleItem}
        handleAddCustomPrint={handleAddCustomPrint}
      />

      {/* max-w-7xl mx-auto: จัดให้ส่วน "All Product" ทั้งหมด อยู่กลางจอ ขอบซ้าย-ขวาเท่ากัน */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <main id="product-list" className="w-full mt-140">
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
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="border border-gray-300 rounded-xl p-2.5 hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={15} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingProducts && <p className="col-span-full py-12 text-center text-gray-500">กำลังโหลดสินค้า…</p>}
            {productError && <p role="alert" className="col-span-full rounded-xl bg-red-50 p-4 text-center text-red-700">{productError}</p>}
            {!loadingProducts && !productError && paginatedProducts.length === 0 && <p className="col-span-full py-12 text-center text-gray-500">ไม่พบสินค้าที่ตรงกับตัวกรอง</p>}
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || product.images?.[0] || "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <button onClick={(e)=>{e.stopPropagation();handleFavorite(product.id)}} aria-label={favoriteIds.has(product.id)?'นำออกจากรายการโปรด':'เพิ่มในรายการโปรด'} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm">
                    <Heart size={17} className={favoriteIds.has(product.id)?'fill-red-500 text-red-500':'text-gray-600'}/>
                  </button>
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
                          i < (product.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200 fill-gray-200"
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      {product.reviews ?? 0}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 mb-3">
                    ฿{product.price}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingCart size={14} />
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loadingProducts && !productError && filteredProducts.length > 0 && <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />}
        </main>
      </div>
      
      {sizeModalProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all scale-100 font-sans">
            <h3 className="text-lg font-bold text-slate-900 mb-2">เลือกไซส์เสื้อ</h3>
            <p className="text-sm text-slate-500 mb-4 truncate">{sizeModalProduct.name}</p>
            
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {(sizeModalProduct.sizes && sizeModalProduct.sizes.length > 0 ? sizeModalProduct.sizes : ['S', 'M', 'L', 'XL']).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedModalSize(sz)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    selectedModalSize === sz
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSizeModalProduct(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmAddToCart}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
