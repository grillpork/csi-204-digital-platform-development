"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Shirt,
  Calendar
} from "lucide-react";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    revenue: 4580,
    ordersCount: 14,
    usersCount: 8,
    customSales: 6
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Read local storage orders to compile live stats
    const saved = localStorage.getItem("shirtsy_orders");
    if (saved) {
      try {
        const orders = JSON.parse(saved);
        const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        
        setStats({
          revenue: 4580 + totalRev, // baseline + new
          ordersCount: 14 + orders.length,
          usersCount: 8,
          customSales: 6 + orders.filter(o => o.items.some(i => i.name.includes("Custom"))).length
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div className="space-y-8">
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ยินดีต้อนรับกลับมา, Admin!</h2>
          <p className="text-xs text-slate-500 mt-1">นี่คือสรุปรายงานยอดขายและคำสั่งซื้อทั้งหมดบนแพลตฟอร์ม The Shirtsy ในปัจจุบัน</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm shrink-0">
          <Calendar size={14} />
          <span>ข้อมูลล่าสุด ณ วันนี้</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "ยอดขายสะสม", val: `${stats.revenue.toLocaleString()}.00 AUD`, change: "+12.5% this week", icon: DollarSign, color: "bg-emerald-500" },
          { label: "คำสั่งซื้อทั้งหมด", val: stats.ordersCount, change: "+4 new today", icon: ShoppingBag, color: "bg-sky-500" },
          { label: "ผู้ใช้งานในระบบ", val: stats.usersCount, change: "+2 registered yesterday", icon: Users, color: "bg-indigo-500" },
          { label: "งานสกรีนลายเสื้อ Custom", val: stats.customSales, change: "+8% growth rate", icon: Shirt, color: "bg-amber-500" }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/40 relative overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
                  <h3 className="text-xl font-bold text-slate-900 mt-2.5 tracking-tight">{card.val}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-emerald-600">{card.change.split(" ")[0]}</span>
                <span>{card.change.substring(card.change.indexOf(" "))}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Chart & Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Custom Sales Analytics Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/40 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Weekly Revenue Flow</h3>
              <p className="text-xs text-slate-400 mt-0.5">ยอดขายเฉลี่ยรายสัปดาห์ (AUD)</p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 flex items-center gap-1">
              Sales Trend <ArrowUpRight size={12} />
            </span>
          </div>

          {/* Simple Premium SVG Graph */}
          <div className="h-64 w-full flex items-end justify-between pt-4 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-0 bottom-0 top-4 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
              <div className="w-full border-t border-slate-100" />
            </div>

            {/* Sales Bar Graphs */}
            {[
              { day: "Mon", value: 370 },
              { day: "Tue", value: 660 },
              { day: "Wed", value: 450 },
              { day: "Thu", value: 890 },
              { day: "Fri", value: 720 },
              { day: "Sat", value: 1120 },
              { day: "Sun", value: 950 }
            ].map((d) => {
              const maxVal = 1200;
              const heightPercent = `${(d.value / maxVal) * 100}%`;
              return (
                <div key={d.day} className="flex flex-col items-center flex-1 z-10 group cursor-pointer">
                  <div className="w-8 sm:w-12 bg-slate-100 hover:bg-slate-900 rounded-xl relative transition-all duration-300 flex items-end justify-center" style={{ height: "180px" }}>
                    <div 
                      className="w-full bg-slate-900 group-hover:bg-slate-700 rounded-xl transition-all duration-500 ease-out" 
                      style={{ height: heightPercent }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-transform pointer-events-none z-20 font-mono">
                      {d.value} AUD
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 mt-3">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Orders Feed */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/40">
          <h3 className="text-base font-bold text-slate-800 mb-6">Recent Checkouts</h3>
          
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-500">ไม่มีประวัติคำสั่งซื้อล่าสุด</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.trackingNumber} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold font-mono">
                      #
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 font-mono">{order.trackingNumber}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{order.total}.00 AUD</p>
                    <span className="text-[9px] bg-sky-50 text-sky-600 font-semibold px-2 py-0.5 rounded-full border border-sky-100 mt-1 inline-block">
                      {order.status === "placed" ? "รอดำเนินการ" : "ส่งแล้ว"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
