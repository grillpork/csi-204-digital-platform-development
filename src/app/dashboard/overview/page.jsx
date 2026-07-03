"use client";

import { useEffect, useState, useMemo } from "react";
import { Banknote, ShoppingBag, PackageCheck, Clock, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Overview() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetch("/api/admin/orders")
      .then(r => r.json())
      .then(j => setOrders(j.data || []));
  }, []);

  const revenue = orders
    .filter(o => !["CANCELLED"].includes(o.status))
    .reduce((s, o) => s + o.total_amount, 0);

  const cards = [
    ["ยอดขายรวม", `฿${revenue.toLocaleString("th-TH")}`, Banknote, "text-indigo-600", "bg-indigo-50"],
    ["คำสั่งซื้อ", `${orders.length} รายการ`, ShoppingBag, "text-emerald-600", "bg-emerald-50"],
    ["กำลังดำเนินการ", `${orders.filter(o => ["PAID", "PROCESSING"].includes(o.status)).length} รายการ`, Clock, "text-amber-600", "bg-amber-50"],
    ["จัดส่งสำเร็จ", `${orders.filter(o => o.status === "COMPLETED").length} รายการ`, PackageCheck, "text-blue-600", "bg-blue-50"]
  ];

  const chartData = useMemo(() => {
    const grouped = {};
    orders.forEach(o => {
      if (o.status === "CANCELLED") return;
      const d = new Date(o.createdAt);
      const dateStr = d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
      const rawDateStr = d.toISOString().split('T')[0];
      
      if (!grouped[rawDateStr]) {
        grouped[rawDateStr] = { dateStr, rawDateStr, revenue: 0, count: 0 };
      }
      grouped[rawDateStr].revenue += o.total_amount;
      grouped[rawDateStr].count += 1;
    });

    return Object.values(grouped).sort((a, b) => a.rawDateStr.localeCompare(b.rawDateStr));
  }, [orders]);

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl">
          <p className="font-bold text-slate-800 text-xs mb-1">{label}</p>
          <p className="text-indigo-600 font-bold text-sm">
            ยอดขาย: ฿{payload[0].value.toLocaleString("th-TH")}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            จำนวน: {payload[0].payload.count} คำสั่งซื้อ
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">ภาพรวมร้านค้า</h1>
        <p className="mt-1 text-sm text-slate-500">สรุปข้อมูลสถิติจากคำสั่งซื้อจริงในระบบ</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, Icon, iconColor, bgColor]) => (
          <div key={label} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${bgColor}`}>
              <Icon size={24} className={iconColor} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">แนวโน้มยอดขาย</h2>
              <p className="text-xs text-slate-500 mt-1">ยอดขายรายวัน ไม่รวมรายการที่ถูกยกเลิก</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="dateStr" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `฿${val.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                กำลังรอข้อมูลคำสั่งซื้อ...
              </div>
            )}
          </div>
        </div>

        {/* Secondary Info */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">สรุปข้อมูลด่วน</h2>
          <div className="space-y-4 flex-1">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">ยอดขายเฉลี่ยต่อออเดอร์</p>
              <p className="text-2xl font-black text-slate-900">
                {orders.filter(o => !["CANCELLED"].includes(o.status)).length > 0 
                  ? `฿${Math.round(revenue / orders.filter(o => !["CANCELLED"].includes(o.status)).length).toLocaleString("th-TH")}` 
                  : "฿0"}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">ออเดอร์ทั้งหมดในระบบ</p>
              <p className="text-2xl font-black text-slate-900">{orders.length} <span className="text-sm font-bold text-slate-500">รายการ</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
