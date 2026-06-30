"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  Edit3
} from "lucide-react";

const STAGES = [
  { key: "placed", label: "รับคำสั่งซื้อแล้ว", icon: Clock },
  { key: "processing", label: "กำลังผลิตสินค้า", icon: Package },
  { key: "shipped", label: "กำลังจัดส่ง", icon: Truck },
  { key: "delivering", label: "กำลังนำจ่าย", icon: MapPin },
  { key: "delivered", label: "จัดส่งสำเร็จ", icon: CheckCircle2 }
];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const saved = localStorage.getItem("shirtsy_orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Update status of a specific order
  const handleUpdateStatus = (trackingNo, nextStatus) => {
    const updated = orders.map((order) => {
      if (order.trackingNumber === trackingNo) {
        return { ...order, status: nextStatus };
      }
      return order;
    });

    setOrders(updated);
    localStorage.setItem("shirtsy_orders", JSON.stringify(updated));
    
    // Update active modal order view if open
    if (selectedOrder && selectedOrder.trackingNumber === trackingNo) {
      setSelectedOrder({ ...selectedOrder, status: nextStatus });
    }
  };

  // Delete an order
  const handleDeleteOrder = (trackingNo) => {
    const updated = orders.filter((o) => o.trackingNumber !== trackingNo);
    setOrders(updated);
    localStorage.setItem("shirtsy_orders", JSON.stringify(updated));
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h2>
        <p className="text-xs text-slate-500 mt-1">
          จัดการคำสั่งซื้อและเปลี่ยนสถานะการจัดส่งพัสดุ (เชื่อมต่อกับหน้าติดตามพัสดุของลูกค้า)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Orders List Table */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/40 lg:col-span-2 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">รายการคำสั่งซื้อทั้งหมด</h3>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md">
              {orders.length} Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="text-center py-20 px-4">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-800">ไม่มีคำสั่งซื้อในระบบ</p>
                <p className="text-xs text-slate-400 mt-1">ทดลองหยิบสินค้าใส่ตะกร้าและกดเช็คเอาท์เพื่อสร้างออเดอร์ใหม่</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3.5 px-6">Tracking Number</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr 
                      key={order.trackingNumber} 
                      className={`hover:bg-slate-50/50 cursor-pointer transition-all ${
                        selectedOrder?.trackingNumber === order.trackingNumber ? "bg-slate-50" : ""
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {order.trackingNumber}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {order.date}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {order.total}.00 AUD
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          order.status === "delivered" 
                            ? "bg-green-50 border-green-200 text-green-700" 
                            : order.status === "shipped" 
                              ? "bg-blue-50 border-blue-200 text-blue-700" 
                              : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}>
                          {STAGES.find((s) => s.key === order.status)?.label || order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-all"
                            title="Manage Order"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.trackingNumber)}
                            className="p-1 text-red-400 hover:text-red-600 rounded transition-all"
                            title="Delete Order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Selected Order Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedOrder ? (
            <motion.div
              key={selectedOrder.trackingNumber}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/40 space-y-6"
            >
              <div>
                <h3 className="font-bold text-slate-800 text-base">การจัดการพัสดุ</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Tracking No: {selectedOrder.trackingNumber}</p>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  อัพเดทสถานะจัดส่ง
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {STAGES.map((stage) => {
                    const isActive = selectedOrder.status === stage.key;
                    const Icon = stage.icon;
                    return (
                      <button
                        key={stage.key}
                        onClick={() => handleUpdateStatus(selectedOrder.trackingNumber, stage.key)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                          isActive 
                            ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10" 
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800"
                        }`}
                      >
                        <Icon size={14} />
                        <span>{stage.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Shipping Address info */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  ที่อยู่ผู้รับสินค้า
                </label>
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 leading-relaxed">
                  {selectedOrder.shippingAddress}
                </p>
              </div>

              {/* Items details */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  รายการสินค้า ({selectedOrder.items?.length || 0})
                </label>
                <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex gap-3 py-2 first:pt-0 last:pb-0 items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-8 h-10 object-cover rounded bg-slate-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{item.price} AUD x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pmt Method */}
              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="flex items-center gap-1.5"><CreditCard size={14} /> ชำระด้วย:</span>
                <span className="font-semibold text-slate-700">
                  {selectedOrder.paymentMethod === "cod" ? "เก็บเงินปลายทาง (COD)" : "โอนเงิน / บัตรเครดิต"}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 border-dashed rounded-3xl p-8 text-center text-slate-400">
              <p className="text-xs font-semibold">เลือกคำสั่งซื้อจากตารางเพื่อดำเนินการจัดการสถานะ</p>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
