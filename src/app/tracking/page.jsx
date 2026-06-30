"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  CreditCard
} from "lucide-react";

// Status stages definition
const STAGES = [
  { key: "placed", label: "รับคำสั่งซื้อแล้ว", icon: ClipboardList, desc: "ยืนยันคำสั่งซื้อเรียบร้อยแล้ว" },
  { key: "processing", label: "กำลังผลิตสินค้า", icon: Package, desc: "เสื้อของคุณกำลังผลิตและสกรีนลาย" },
  { key: "shipped", label: "กำลังจัดส่ง", icon: Truck, desc: "พัสดุถูกส่งมอบให้บริษัทขนส่งแล้ว" },
  { key: "delivering", label: "กำลังนำจ่าย", icon: MapPin, desc: "พนักงานกำลังนำพัสดุไปส่งยังที่อยู่ของคุณ" },
  { key: "delivered", label: "จัดส่งสำเร็จ", icon: CheckCircle2, desc: "คุณได้รับพัสดุเรียบร้อยแล้ว" }
];

function TrackingDetails() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [order, setOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");

  // Retrieve recent orders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shirtsy_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentOrders(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Handle URL search parameter
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      handleSearch(id);
    }
  }, [searchParams]);

  const handleSearch = (idToSearch) => {
    const id = (idToSearch || trackingId).trim().toUpperCase();
    if (!id) return;

    setError("");
    setSearchedId(id);

    // 1. Look in local orders
    const saved = localStorage.getItem("shirtsy_orders");
    let foundOrder = null;
    if (saved) {
      try {
        const orders = JSON.parse(saved);
        foundOrder = orders.find(o => o.trackingNumber.toUpperCase() === id);
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fallback to mock generated order if not found
    if (!foundOrder) {
      // If it looks like a Shirtsy tracking ID, or they typed anything, generate a realistic mock order
      if (id.startsWith("SHIRTSY-") || id.length > 5) {
        foundOrder = {
          trackingNumber: id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toLocaleDateString("th-TH"),
          paymentMethod: "transfer",
          total: 660,
          status: "shipped", // default stage for mock search
          items: [
            { id: 991, name: "Premium Cotton T-Shirt (Custom Print)", price: 370, quantity: 1, image: "https://josephineco.com/cdn/shop/files/6217024316_010_1.jpg?v=1773234174&width=2048" },
            { id: 992, name: "Minimalist Typography Hoodie", price: 290, quantity: 1, image: "https://cdn-images.farfetch-contents.com/24/09/63/05/24096305_54170622_600.jpg" }
          ],
          shippingAddress: "123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
        };
      } else {
        setError("ไม่พบข้อมูลรหัสติดตามพัสดุนี้ กรุณาตรวจสอบความถูกต้องอีกครั้ง (ตัวอย่างรหัส: SHIRTSY-12345)");
        setOrder(null);
        return;
      }
    }

    setOrder(foundOrder);
  };

  // Determine current active stage index
  const getActiveIndex = (status) => {
    const idx = STAGES.findIndex(s => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const activeIndex = order ? getActiveIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-sky-50 text-sky-600 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-sky-100 uppercase tracking-wider">
              Order Delivery
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              ติดตามการขนส่งสินค้า
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              ป้อนหมายเลขพัสดุเพื่อติดตามสถานะการสกรีนเสื้อและการจัดส่งของคุณแบบเรียลไทม์
            </p>
          </motion.div>
        </div>

        {/* Search Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/50 mb-8"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="ป้อนหมายเลขพัสดุ (เช่น SHIRTSY-12345)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white rounded-2xl px-8 py-3.5 text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 shrink-0"
            >
              ค้นหาสถานะ <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {/* Tracking Details & Timeline */}
        <AnimatePresence mode="wait">
          {order ? (
            <motion.div
              key={searchedId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Order Info Bar */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">หมายเลขพัสดุ</p>
                  <p className="text-xl font-bold tracking-tight font-mono mt-1">{order.trackingNumber}</p>
                </div>
                <div className="h-px sm:h-12 w-full sm:w-px bg-slate-800" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">วันที่สั่งซื้อ</p>
                  <p className="text-base font-semibold mt-1">{order.date}</p>
                </div>
                <div className="h-px sm:h-12 w-full sm:w-px bg-slate-800" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ยอดรวมคำสั่งซื้อ</p>
                  <p className="text-base font-semibold mt-1">{order.total}.00 AUD</p>
                </div>
                <div className="h-px sm:h-12 w-full sm:w-px bg-slate-800" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">สถานะล่าสุด</p>
                  <span className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-sky-500/30 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {STAGES[activeIndex].label}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50">
                <h3 className="text-base font-bold text-slate-800 mb-8">ไทม์ไลน์การจัดส่ง</h3>

                {/* Horizontal Timeline (Desktop) */}
                <div className="hidden md:flex justify-between items-start relative mb-12">
                  <div className="absolute top-6 left-8 right-8 h-0.5 bg-slate-100 z-0">
                    <div 
                      className="h-full bg-slate-950 transition-all duration-700 ease-out animate-pulse"
                      style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
                    />
                  </div>

                  {STAGES.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <div key={stage.key} className="flex flex-col items-center text-center relative z-10 w-32">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive 
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-110" 
                            : isCompleted 
                              ? "bg-white border-slate-900 text-slate-900" 
                              : "bg-white border-slate-200 text-slate-400"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`text-xs font-bold mt-3.5 ${
                          isActive ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-400"
                        }`}>
                          {stage.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal px-1">
                          {stage.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Timeline (Mobile) */}
                <div className="md:hidden space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div 
                    className="absolute left-6 top-2 w-0.5 bg-slate-900 transition-all duration-700 ease-out"
                    style={{ height: `${(activeIndex / (STAGES.length - 1)) * 92}%` }}
                  />

                  {STAGES.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <div key={stage.key} className="flex gap-4 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                          isActive 
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/25 scale-105" 
                            : isCompleted 
                              ? "bg-white border-slate-900 text-slate-900" 
                              : "bg-white border-slate-200 text-slate-400"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className={`text-sm font-bold ${
                            isActive ? "text-slate-900" : isCompleted ? "text-slate-800" : "text-slate-400"
                          }`}>
                            {stage.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Items Summary */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 flex flex-col">
                  <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    รายละเอียดสินค้า
                  </h3>
                  <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-60 pr-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-16 object-cover rounded-lg bg-slate-50 border border-slate-100 animate-fade-in" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">จำนวน: {item.quantity} ชิ้น</p>
                          <p className="text-xs font-bold text-slate-900 mt-1">{item.price}.00 AUD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Summary */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      ที่อยู่จัดส่ง
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
                      {order.shippingAddress || "ไม่ระบุที่อยู่จัดส่ง"}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      วิธีชำระเงิน: 
                    </span>
                    <span className="font-semibold text-slate-700">
                      {order.paymentMethod === "cod" ? "เก็บเงินปลายทาง (COD)" : "โอนเงิน / บัตรเครดิต"}
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            // Empty / Welcome state
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-slate-100/50 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6">
                <Truck className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">ค้นหารายละเอียดการจัดส่งของคุณ</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                ป้อนรหัสพัสดุของคุณด้านบน หรือเลือกรหัสสั่งซื้อล่าสุดด้านล่างเพื่อตรวจสอบรายละเอียดสถานะจัดส่งเสื้อสกรีน
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Orders List */}
        {recentOrders.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50"
          >
            <h3 className="text-base font-bold text-slate-800 mb-6">ประวัติการสั่งซื้อล่าสุด</h3>
            <div className="divide-y divide-slate-100">
              {recentOrders.map((item) => (
                <div 
                  key={item.trackingNumber} 
                  onClick={() => {
                    setTrackingId(item.trackingNumber);
                    handleSearch(item.trackingNumber);
                  }}
                  className="flex items-center justify-between py-4 cursor-pointer hover:bg-slate-50 rounded-xl px-2 transition-all group first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-mono font-bold text-slate-800 group-hover:text-black">{item.trackingNumber}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.date} • {item.items?.length || 0} รายการ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-md">
                      {STAGES.find(s => s.key === item.status)?.label || item.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900" />
      </div>
    }>
      <TrackingDetails />
    </Suspense>
  );
}
