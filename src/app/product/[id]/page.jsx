"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { useProductStore } from "@/store/product";

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Navy", hex: "#1e3a8a" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const addToCart = useProductStore((state) => state.addToCart);

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const json = await res.json();
        if (active) {
          const dbProduct = json.data;
          if (dbProduct) {
            dbProduct.image = dbProduct.images?.[0] || "/placeholder.png";
            dbProduct.rating = dbProduct.rating || 5;
            dbProduct.reviews = dbProduct.reviews || 0;
            setProduct(dbProduct);
          }
        }
      } catch (err) {
        if (active) {
          setProduct(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchProduct();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: `${product.name} (${selectedColor}, ${selectedSize})`,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-sans">
        <span className="animate-pulse font-medium text-lg">กำลังโหลดข้อมูลสินค้า...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-500 font-sans gap-4">
        <span className="font-semibold text-xl text-gray-900">ไม่พบสินค้าที่คุณต้องการ</span>
        <Link href="/" className="px-4 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const availableColors = product.colors && product.colors.length > 0
    ? product.colors.map(col => {
        const lowerCol = col.toLowerCase();
        if (lowerCol === 'white') return { name: col, hex: '#ffffff' };
        if (lowerCol === 'black') return { name: col, hex: '#000000' };
        if (lowerCol === 'gray' || lowerCol === 'grey') return { name: col, hex: '#9CA3AF' };
        if (lowerCol === 'navy') return { name: col, hex: '#1e3a8a' };
        return { name: col, hex: '#cccccc' }; // Default gray
      })
    : colors;

  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : sizes;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8 items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> กลับสู่หน้าหลัก
          </Link>
          <span>/</span>
          <span>เสื้อผ้า</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ส่วนรูปภาพ */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-[4/5] relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                <Heart size={20} />
              </button>
            </div>
            {/* Gallery Thumbnails (จำลอง) */}
            <div className="flex gap-4 mt-4">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className={`w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 ${idx === 0 ? "border-black" : "border-transparent"}`}>
                  <img src={product.image} className="w-full h-full object-cover" alt="thumbnail" />
                </div>
              ))}
            </div>
          </div>

          {/* ส่วนรายละเอียด */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < product.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2 font-medium">({product.reviews} รีวิว)</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md">มีสินค้าในสต็อก</span>
              </div>

              <p className="text-3xl font-bold text-gray-900">฿{product.price}</p>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="w-full h-px bg-gray-200 mb-8"></div>

            {/* สี */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">สีเสื้อ</h3>
                <span className="text-sm text-gray-500">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-blue-500 ring-2 ring-blue-500/20 scale-110" : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* ไซส์ */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">ไซส์เสื้อ</h3>
                <button className="text-sm text-blue-600 hover:underline">ตารางไซส์</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 rounded-xl border font-medium text-sm transition-all ${
                      selectedSize === s
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-gray-700 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* จำนวน & Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-xl h-14 w-full sm:w-32 bg-gray-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center bg-transparent outline-none font-semibold text-gray-900 appearance-none" 
                  style={{ MozAppearance: 'textfield' }}
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white rounded-xl h-14 flex items-center justify-center gap-3 font-semibold hover:bg-gray-800 hover:shadow-xl hover:shadow-black/10 transition-all active:scale-[0.98]"
              >
                <ShoppingCart size={20} />
                เพิ่มลงตะกร้า - ฿{product.price * quantity}
              </button>
            </div>

            {/* Service Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">จัดส่งฟรี</h4>
                  <p className="text-xs text-gray-500 mt-0.5">เมื่อสั่งซื้อครบ 1,000 บาท</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                  <RefreshCcw size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">คืนสินค้าได้</h4>
                  <p className="text-xs text-gray-500 mt-0.5">ภายใน 14 วันหลังได้รับสินค้า</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">รับประกันคุณภาพ</h4>
                  <p className="text-xs text-gray-500 mt-0.5">สินค้าของแท้ 100%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                  <Share2 size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">แชร์สินค้า</h4>
                  <p className="text-xs text-gray-500 mt-0.5">แชร์รับส่วนลดเพิ่มเติม</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
