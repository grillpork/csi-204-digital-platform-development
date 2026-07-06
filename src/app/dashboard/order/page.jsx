"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import { 
  Receipt, User, Clock, MapPin, DollarSign, Package,
  Layers, AlertCircle, Timer, X, CreditCard, Loader2, Truck, Check
} from "lucide-react";

const labels = {
  PENDING: "รอยืนยัน",
  PENDING_PAYMENT: "รอชำระเงิน",
  PAYMENT_EXPIRED: "หมดเวลาชำระ",
  PAID: "ชำระแล้ว",
  PROCESSING: "กำลังผลิต",
  SHIPPED: "กำลังจัดส่ง",
  COMPLETED: "สำเร็จ",
  CANCELLED: "ยกเลิก"
};

const selectColors = {
  PENDING: "bg-yellow-50 border-yellow-200 text-yellow-800 focus:ring-yellow-500 focus:border-yellow-500",
  PENDING_PAYMENT: "bg-amber-50 border-amber-200 text-amber-800 focus:ring-amber-500 focus:border-amber-500",
  PAYMENT_EXPIRED: "bg-slate-50 border-slate-200 text-slate-400 focus:ring-slate-500 focus:border-slate-500",
  PAID: "bg-emerald-50 border-emerald-200 text-emerald-800 focus:ring-emerald-500 focus:border-emerald-500",
  PROCESSING: "bg-blue-50 border-blue-200 text-blue-800 focus:ring-blue-500 focus:border-blue-500",
  SHIPPED: "bg-indigo-50 border-indigo-200 text-indigo-800 focus:ring-indigo-500 focus:border-indigo-500",
  COMPLETED: "bg-green-50 border-green-200 text-green-800 focus:ring-green-500 focus:border-green-500",
  CANCELLED: "bg-rose-50 border-rose-200 text-rose-800 focus:ring-rose-500 focus:border-rose-500"
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PENDING": return AlertCircle;
    case "PENDING_PAYMENT": return Timer;
    case "PAYMENT_EXPIRED": return X;
    case "PAID": return CreditCard;
    case "PROCESSING": return Loader2;
    case "SHIPPED": return Truck;
    case "COMPLETED": return Check;
    case "CANCELLED": return X;
    default: return AlertCircle;
  }
};

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = () => fetch("/api/admin/orders").then(r => r.json()).then(j => setItems(j.data || []));

  useEffect(() => { load() }, []);

  async function update(id, status) {
    const r = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    const j = await r.json();
    setMessage(r.ok ? "อัปเดตสถานะแล้ว" : j.error);
    if (r.ok) load();
  }

  const filteredItems = statusFilter === "ALL" ? items : items.filter(i => i.status === statusFilter);

  const columns = [
    {
      title: 'คำสั่งซื้อ',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div className="flex items-start gap-2 min-w-[120px]">
          <Receipt size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-mono text-xs font-bold text-slate-800">{id}</p>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <Clock size={10} />
              <span>{new Date(record.createdAt).toLocaleString("th-TH")}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'ลูกค้า',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-start gap-2 min-w-[150px]">
          <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-800">{record.user.name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{record.user.email}</p>
          </div>
        </div>
      )
    },
    {
      title: 'ที่อยู่จัดส่ง',
      dataIndex: 'shippingAddress',
      key: 'address',
      render: (text) => (
        <div className="flex items-start gap-2 min-w-[200px]">
          <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-500 whitespace-pre-line leading-relaxed max-w-[250px]">
            {text}
          </p>
        </div>
      )
    },
    {
      title: 'รายการสินค้า',
      key: 'items',
      render: (_, record) => (
        <div className="space-y-1.5 min-w-[180px]">
          {record.items.map(i => (
            <div key={i.id} className="flex items-start gap-1.5 text-[11px]">
              <Package size={12} className="text-slate-400 mt-0.5 shrink-0" />
              <p>
                <span className="font-semibold text-slate-700">{i.product.name}</span>
                <span className="text-slate-400 mx-1">×</span>
                <span className="font-bold">{i.quantity}</span>
              </p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'ยอดรวม',
      dataIndex: 'total_amount',
      key: 'total',
      align: 'right',
      render: (total) => (
        <div className="flex items-center justify-end gap-1 font-bold text-slate-900 min-w-[100px]">
          <DollarSign size={14} className="text-slate-400" />
          <span>{total.toLocaleString("th-TH")}</span>
        </div>
      )
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      fixed: 'right',
      render: (status, record) => (
        <select 
          value={status} 
          onChange={e => update(record.id, e.target.value)} 
          className={`border text-xs rounded-xl px-2 py-1.5 outline-none transition-all cursor-pointer font-bold w-full max-w-[120px] ${selectColors[status] || "bg-slate-50 border-slate-200 text-slate-700"}`}
        >
          {Object.entries(labels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">จัดการคำสั่งซื้อ</h1>
        <p className="mt-1 text-sm text-slate-500">ข้อมูลจริงจากฐานข้อมูล</p>
      </div>

      {message && <p className="rounded-xl bg-white border border-slate-100 p-3 text-sm font-semibold shadow-sm text-indigo-700">{message}</p>}

      {/* Tabs Filter */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start w-full overflow-x-auto hide-scrollbar gap-1 border border-slate-200/50">
        {[
          { id: "ALL", title: "ทั้งหมด" },
          ...Object.entries(labels).map(([k, v]) => ({ id: k, title: v }))
        ].map(tab => {
          const isActive = statusFilter === tab.id;
          const count = tab.id === "ALL" ? items.length : items.filter(i => i.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {tab.title}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-3 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={filteredItems} 
          rowKey="id" 
          pagination={{ pageSize: 10, position: ['bottomCenter'] }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
}
