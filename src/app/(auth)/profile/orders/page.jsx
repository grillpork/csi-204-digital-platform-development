"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Truck, 
  Package, 
  AlertCircle, 
  RotateCcw, 
  XOctagon, 
  ChevronRight, 
  Eye, 
  ShoppingBag,
  Star,
  RefreshCcw,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const TABS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "pending", label: "รอชำระเงิน" },
  { id: "placed", label: "ชำระเงินแล้ว" },
  { id: "processing", label: "เตรียมสินค้า" },
  { id: "shipped", label: "กำลังจัดส่ง" },
  { id: "delivered", label: "จัดส่งสำเร็จ" },
  { id: "problem", label: "ติดปัญหา" },
  { id: "returned", label: "ส่งคืนสินค้า" },
  { id: "cancelled", label: "ยกเลิกออเดอร์" }
];

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Default mockup orders mirroring the user's uploaded layout design
  const mockupOrders = [
    {
      trackingNumber: "ORD235902",
      date: "02/05/2026",
      time: "11:30 น.",
      paymentMethod: "transfer",
      total: 23500,
      status: "placed", // "ชำระเงินแล้ว"
      latestUpdate: "ชำระเงินเรียบร้อยแล้ว",
      items: [
        {
          id: 101,
          name: "Ace Embroidered Sneakers (White/Green-Red Web)",
          sku: "SKU: BAG239223",
          price: 23500,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80"
        }
      ]
    },
    {
      trackingNumber: "ORD235903",
      date: "02/05/2026",
      time: "11:30 น.",
      paymentMethod: "transfer",
      total: 195000,
      status: "shipped", // "กำลังจัดส่ง"
      latestUpdate: "อยู่ระหว่างการจัดส่ง",
      carrierTrackingId: "TH1234HH4FH5A",
      items: [
        {
          id: 102,
          name: "Small Lady Dior Cannage Lambskin Bag with Strap (Black)",
          sku: "SKU: BAG194330",
          price: 195000,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80"
        }
      ]
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    // Combine local storage checkouts with default mockup orders
    const saved = localStorage.getItem("shirtsy_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map localized checkout states to tab statuses
        const formatted = parsed.map((o) => {
          // If order has no tracking prefix or ORD, give it ORD
          const num = o.trackingNumber.startsWith("SHIRTSY-") 
            ? o.trackingNumber.replace("SHIRTSY-", "ORD") 
            : o.trackingNumber;

          // Map state keys
          let statusText = "ชำระเงินแล้ว";
          if (o.status === "processing") statusText = "เตรียมสินค้า";
          if (o.status === "shipped") statusText = "กำลังจัดส่ง";
          if (o.status === "delivering") statusText = "อยู่ระหว่างนำจ่าย";
          if (o.status === "delivered") statusText = "จัดส่งสำเร็จ";

          return {
            trackingNumber: num,
            date: o.date,
            time: "10:15 น.",
            paymentMethod: o.paymentMethod,
            total: o.total,
            status: o.status === "processing" ? "processing" : o.status === "shipped" ? "shipped" : o.status === "delivering" ? "shipped" : o.status === "delivered" ? "delivered" : "placed",
            latestUpdate: statusText,
            items: o.items.map((it, idx) => ({
              id: it.id || idx,
              name: it.name,
              sku: `SKU: SHIRTSY${it.id || idx}`,
              price: it.price,
              quantity: it.quantity,
              image: it.image
            }))
          };
        });
        setOrders([...formatted, ...mockupOrders]);
      } catch (e) {
        console.error(e);
        setOrders(mockupOrders);
      }
    } else {
      setOrders(mockupOrders);
    }
  }, []);

  const getStatusDetails = (status) => {
    switch (status) {
      case "pending":
        return { label: "รอชำระเงิน", color: "text-amber-600 bg-amber-50 border-amber-200", icon: CreditCard };
      case "placed":
        return { label: "ชำระเงินแล้ว", color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: CreditCard };
      case "processing":
        return { label: "เตรียมสินค้า", color: "text-amber-600 bg-amber-50 border-amber-100", icon: Package };
      case "shipped":
        return { label: "กำลังจัดส่ง", color: "text-sky-600 bg-sky-50 border-sky-100", icon: Truck };
      case "delivered":
        return { label: "จัดส่งสำเร็จ", color: "text-slate-600 bg-slate-100 border-slate-200", icon: CheckCircle2 };
      case "problem":
        return { label: "ติดปัญหา", color: "text-red-600 bg-red-50 border-red-100", icon: AlertCircle };
      case "returned":
        return { label: "ส่งคืนสินค้า", color: "text-rose-600 bg-rose-50 border-rose-100", icon: RotateCcw };
      case "cancelled":
        return { label: "ยกเลิกออเดอร์", color: "text-gray-500 bg-gray-50 border-gray-200", icon: XOctagon };
      default:
        return { label: "รอดำเนินการ", color: "text-slate-600 bg-slate-50 border-slate-200", icon: Clock };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 font-sans text-slate-800">
      
      {/* Title */}
      <h1 className="text-xl font-bold text-center mb-8 text-amber-700/80">
        ประวัติการสั่งซื้อ
      </h1>

      {/* Tabs Menu Navigation */}
      <div className="w-full overflow-x-auto scrollbar-none border-b border-slate-200 mb-6 shrink-0">
        <div className="flex space-x-6 min-w-max pb-2.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative text-xs font-semibold pb-1.5 focus:outline-none transition-colors"
                style={{ color: isActive ? "#b45309" : "#64748b" }}
              >
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-700" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List Container */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-md flex flex-col items-center justify-center"
            >
              <ShoppingBag className="w-12 h-12 text-slate-300 mb-4 animate-pulse" />
              <p className="text-sm font-semibold text-slate-600">ไม่พบประวัติการสั่งซื้อในหมวดหมู่นี้</p>
            </motion.div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusDetails(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <motion.div
                  key={order.trackingNumber}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">เลขออเดอร์</span>
                      <span className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-700">
                        {order.trackingNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">สถานะออเดอร์</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Shipment Tracking Update strip */}
                  <Link 
                    href={`/tracking?id=${order.trackingNumber}`}
                    className="flex items-center justify-between bg-slate-50/70 border border-slate-150 hover:bg-slate-50 rounded-xl p-3.5 mb-4 group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                        order.status === "delivered" 
                          ? "bg-slate-500" 
                          : order.status === "shipped" 
                            ? "bg-sky-500" 
                            : "bg-emerald-500"
                      }`}>
                        <StatusIcon className="w-4 h-4" />
                      </span>
                      <div className="text-left">
                        <p className="text-xs text-slate-400 font-medium">
                          อัปเดตสถานะล่าสุด ({order.date}; {order.time})
                        </p>
                        <p className="text-xs font-semibold text-slate-800 mt-0.5">
                          {order.latestUpdate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.carrierTrackingId && (
                        <span className="bg-white border border-sky-200 text-sky-600 text-xs font-bold font-mono px-3 py-1 rounded-lg">
                          {order.carrierTrackingId}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>

                  {/* Order Items list */}
                  <div className="space-y-4 py-2 border-b border-slate-100 mb-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 leading-normal">{item.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium mt-1">{item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">฿{item.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400 mt-1">จำนวน: {item.quantity} ชิ้น</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Net Total & Action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400 font-medium">ราคาสุทธิ ({order.items?.length} รายการ):</span>
                      <span className="text-lg font-bold text-amber-700">
                        ฿{order.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shrink-0">
                        <RefreshCcw className="w-3.5 h-3.5" />
                        ขอเงินคืน
                      </button>
                      <button className="flex items-center gap-1 bg-amber-600/10 hover:bg-amber-600/20 text-amber-800 text-xs font-semibold px-4 py-2.5 rounded-xl border border-amber-200 transition-colors shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-600" />
                        รีวิวสินค้า
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
