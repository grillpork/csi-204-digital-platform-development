"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, ArrowLeft, Heart, Share2, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import NavbarA from "../../../components/ui/NavbarA";
import { useProductStore } from "../../../store/product";

// ข้อมูลจำลอง (Mock data) แบบเดียวกับหน้าแรก
const mockProducts = [
  {
    id: 1,
    name: "เสื้อยืด รุ่นคลาสสิก",
    price: 370,
    rating: 4,
    reviews: 120,
    image: "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
    description: "เสื้อยืดคอตตอน 100% สวมใส่สบาย ระบายอากาศได้ดีเยี่ยม เหมาะกับทุกโอกาส ดีไซน์เรียบง่ายแต่ดูดี",
  },
  {
    id: 2,
    name: "เสื้อฮู้ด แขนยาว ทรง Oversize",
    price: 370,
    rating: 4,
    reviews: 98,
    image: "https://cdn-images.farfetch-contents.com/24/09/63/05/24096305_54170622_600.jpg",
    description: "ฮู้ดดี้ทรงสวย ตัดเย็บด้วยผ้าหนานุ่ม กันหนาวได้ดี ให้ลุคสตรีทและดูโดดเด่นไม่ซ้ำใคร",
  },
  {
    id: 3,
    name: "เสื้อโปโล พรีเมียม",
    price: 370,
    rating: 5,
    reviews: 210,
    image: "https://editorialist.com/thumbnails/600/2024/11/032/965/456/32965456~black_2.webp",
    description: "เสื้อโปโลผ้าปิเก้ (Pique) เนื้อผ้าคงรูปไม่ย้วยง่าย ดูแลรักษาง่าย เหมาะสำหรับใส่ทำงานหรือวันสบายๆ",
  },
  {
    id: 4,
    name: "เสื้อยืด พิมพ์ลายวินเทจ",
    price: 370,
    rating: 3,
    reviews: 55,
    image: "https://vspconsignment.com/cdn/shop/files/Gucci-back-monogram-embrd-top4_2400x.jpg?v=1759273918",
    description: "เสื้อยืดพิมพ์ลายกราฟิกสไตล์วินเทจ เอาใจสายแฟชั่น ซักแล้วลายไม่หลุดลอก ด้วยสีสกรีนคุณภาพสูง",
  },
  {
    id: 5,
    name: "เสื้อกล้าม เบสิค",
    price: 370,
    rating: 4,
    reviews: 88,
    image: "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
    description: "เสื้อกล้ามผ้าคอตตอน สวมใส่สบายเหมาะสำหรับอากาศร้อน หรือใส่ซับใน",
  },
  {
    id: 6,
    name: "เสื้อยืด ทรงหลวมสไตล์ญี่ปุ่น",
    price: 370,
    rating: 5,
    reviews: 175,
    image: "https://cdn-images.farfetch-contents.com/24/09/63/05/24096305_54170622_600.jpg",
    description: "ดีไซน์เสื้อทรงหลวม (Relaxed Fit) สไตล์มินิมอล ใส่คู่กับกางเกงอะไรก็เข้ากัน",
  },
  {
    id: 7,
    name: "เสื้อฮู้ด ซิปหน้า",
    price: 370,
    rating: 4,
    reviews: 63,
    image: "https://editorialist.com/thumbnails/600/2024/11/032/965/456/32965456~black_2.webp",
    description: "เสื้อฮู้ดแบบมีซิปหน้า สวมใส่และถอดได้สะดวก พร้อมกระเป๋าคู่หน้าสำหรับใส่ของ",
  },
  {
    id: 8,
    name: "เสื้อแจ็คเก็ต ผ้าร่ม",
    price: 370,
    rating: 3,
    reviews: 40,
    image: "https://vspconsignment.com/cdn/shop/files/Gucci-back-monogram-embrd-top4_2400x.jpg?v=1759273918",
    description: "แจ็คเก็ตผ้าร่มน้ำหนักเบา กันลมกันแดด เหมาะสำหรับใส่ขับขี่มอเตอร์ไซค์หรือออกกำลังกาย",
  },
  {
    id: 9,
    name: "เสื้อแขนยาว ผ้าคอตตอนลายทาง",
    price: 370,
    rating: 4,
    reviews: 132,
    image: "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048",
    description: "เสื้อแขนยาวลายทาง (Stripe) ดูดีมีสไตล์ เนื้อผ้าไม่หนาจนเกินไป ใส่ในห้องแอร์กำลังดี",
  },
];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Navy", hex: "#1e3a8a" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [lang, setLang] = useState("TH");
  
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const addToCart = useProductStore((state) => state.addToCart);

  // หาสินค้าจาก id
  const product = mockProducts.find((p) => p.id === parseInt(id)) || mockProducts[0];

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      name: `${product.name} (${selectedColor}, ${selectedSize})`,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      <NavbarA lang={lang} onLangToggle={() => setLang(l => l === "EN" ? "TH" : "EN")} />
      
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
                {colors.map((c) => (
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
                {sizes.map((s) => (
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
