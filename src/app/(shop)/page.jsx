"use client";
import CartDrawer from "@/components/ui/CartDrawer";
import FilterDrawer from "@/components/ui/FilterDrawer";
import { useProductStore } from "@/store/product";
import { useState, useEffect } from "react";
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
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((j) => setProducts(j.data || []))
      .catch(() => {});
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

  // สลับกลับไปใช้ mock ได้ด้วยการเปลี่ยนเป็น true บรรทัดเดียว
  const USE_MOCK = false;
  const displayProducts = USE_MOCK ? mockProducts : products;

  const addToCart = useProductStore((state) => state.addToCart);

  const toggleLang = () => setLang((l) => (l === "EN" ? "TH" : "EN"));
  const toggleItem = (setter, list, item) =>
    setter(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );

  // กดแล้วเพิ่ม สินค้า เข้าตะกร้า
  const handleAddCustomPrint = async () => {
    const result = await addToCart({
      id: "custom-print",
      name: "เสื้อสกรีนลายตามสั่ง",
      price: 390,
      image: uploadedFile
        ? URL.createObjectURL(uploadedFile)
        : "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
    });
    if (result?.needLogin) {
      router.push("/login");
    }
  };

  // กดแล้วเพิ่มสินค้าจริงจาก grid เข้าตะกร้า
  const handleAddToCart = async (product) => {
    const result = await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
    });
    if (result?.needLogin) {
      router.push("/login");
    }
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
        <main className="w-full mt-140">
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
            {displayProducts.map((product) => (
              <div
                key={product.id}
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
                  <button onClick={() => handleAddToCart(product)} className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors">
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
