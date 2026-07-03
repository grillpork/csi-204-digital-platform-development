"use client";

import { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  Search, 
  User, 
  Mail, 
  DollarSign, 
  Layers, 
  Loader2, 
  Eye,
  AlertCircle
} from "lucide-react";

const STATUS_LABELS = {
  DRAFT: "แบบร่าง",
  PENDING: "รอตรวจสอบ",
  APPROVED: "อนุมัติขายแล้ว",
  REJECTED: "ปฏิเสธการขาย",
};

export default function ReviewDesigns() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // "success" | "error"
  const [form, setForm] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "PENDING" | "APPROVED" | "REJECTED"

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/designs");
      const j = await r.json();
      setItems(j.data || []);
    } catch (err) {
      setMessage("เกิดข้อผิดพลาดในการโหลดข้อมูลดีไซน์");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const val = (id, k, d) => form[id]?.[k] ?? d;
  const set = (id, k, v) => setForm((x) => ({ ...x, [id]: { ...x[id], [k]: v } }));

  const showFeedback = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  async function review(p, status) {
    const body = {
      id: p.id,
      status,
      price: Number(val(p.id, "price", p.price || 390)),
      stock: Number(val(p.id, "stock", p.stock || 100)),
      reason: val(p.id, "reason", ""),
    };

    try {
      const r = await fetch("/api/admin/designs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (r.ok) {
        showFeedback(status === "APPROVED" ? "อนุมัติการออกแบบนี้แล้ว" : "ปฏิเสธการออกแบบแล้ว", "success");
        load();
      } else {
        showFeedback(j.error || "เกิดข้อผิดพลาดในการบันทึก", "error");
      }
    } catch (err) {
      showFeedback("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์", "error");
    }
  }

  // Filter items based on search and status filter
  const getFilteredItems = () => {
    return items.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" ? true : item.approvalStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">ตรวจและอนุมัติแบบเสื้อ</h1>
        <p className="mt-1 text-sm text-slate-500">
          ตรวจสอบผลงานออกแบบของดีไซเนอร์ กำหนดราคาขายเริ่มต้น และจำนวนสต็อกเปล่าพร้อมขายก่อนอนุมัติลงร้านค้า
        </p>
      </div>

      {/* Feedback Banner */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-sm animate-fade-in ${
          messageType === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          {messageType === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          <span className="text-xs font-semibold">{message}</span>
        </div>
      )}

      {/* 4-Column Grid Cards (Acts as filter tabs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "ALL", title: "ทั้งหมด (All)", desc: "ผลงานออกแบบทั้งหมด", icon: Layers, count: items.length },
          { id: "PENDING", title: "รอตรวจสอบ (Pending)", desc: "ผลงานที่รอการพิจารณา", icon: AlertCircle, count: items.filter(i => i.approvalStatus === "PENDING").length },
          { id: "APPROVED", title: "อนุมัติแล้ว (Approved)", desc: "ผลงานที่อนุมัติลงร้านค้า", icon: Check, count: items.filter(i => i.approvalStatus === "APPROVED").length },
          { id: "REJECTED", title: "ปฏิเสธแล้ว (Rejected)", desc: "ผลงานที่ไม่ผ่านเงื่อนไข", icon: X, count: items.filter(i => i.approvalStatus === "REJECTED").length }
        ].map((card) => {
          const Icon = card.icon;
          const isActive = statusFilter === card.id;
          return (
            <div 
              key={card.id}
              onClick={() => setStatusFilter(card.id)}
              className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg border-slate-900 active:scale-98"
                  : "bg-white text-slate-800 border-slate-100 hover:shadow-md hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${isActive ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-650"}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${
                  isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {card.count} รายการ
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-sm font-bold">{card.title}</h3>
                <p className={`text-[11px] leading-relaxed ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Input Container */}
      <div className="flex justify-end">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อแบบเสื้อ, ชื่อผู้สร้าง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500 focus:shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 size={36} className="animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">กำลังดึงข้อมูลแบบเสื้อ...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center gap-3">
            <Layers size={36} />
            <div>
              <p className="font-bold text-slate-700">ไม่พบข้อมูลผลงานออกแบบ</p>
              <p className="text-xs text-slate-400 mt-1">ไม่มีรายการรอตรวจสอบ หรือไม่มีชื่อที่ค้นหาในระบบ</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">แบบเสื้อ</th>
                  <th className="px-6 py-4">ผู้ออกแบบ (Creator)</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4">ตั้งค่าการขาย (ราคา / สต็อก)</th>
                  <th className="px-6 py-4">เหตุผล (กรณีปฏิเสธ)</th>
                  <th className="px-6 py-4 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {filteredItems.map((p) => {
                  const isPending = p.approvalStatus === "PENDING";
                  return (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-slate-50/40 transition-colors ${!isPending ? "bg-slate-50/10" : ""}`}
                    >
                      {/* Column 1: Design Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative group shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={p.images[0]} 
                              alt={p.name} 
                              className="h-16 w-14 rounded-lg object-cover border border-slate-100 shadow-sm transition-transform duration-250 group-hover:scale-105"
                            />
                            <a 
                              href={p.images[0]} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity duration-200"
                              title="ดูรูปขนาดเต็ม"
                            >
                              <Eye size={14} className="text-white" />
                            </a>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]" title={p.description}>
                              {p.description || "ไม่มีรายละเอียดดีไซน์"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Designer Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-800 font-medium text-xs">
                            <User size={13} className="text-slate-400" />
                            <span>{p.seller.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Mail size={11} />
                            <span>{p.seller.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Status Badge */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          p.approvalStatus === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : p.approvalStatus === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                            : p.approvalStatus === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            p.approvalStatus === "PENDING"
                              ? "bg-amber-500 animate-pulse"
                              : p.approvalStatus === "APPROVED"
                              ? "bg-emerald-500"
                              : p.approvalStatus === "REJECTED"
                              ? "bg-rose-500"
                              : "bg-slate-400"
                          }`} />
                          <span>{STATUS_LABELS[p.approvalStatus] || p.approvalStatus}</span>
                        </span>
                      </td>

                      {/* Column 4: Pricing & Stock Inputs */}
                      <td className="px-6 py-4">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            {/* Price */}
                            <div className="relative w-24">
                              <span className="absolute inset-y-0 left-2.5 flex items-center text-[10px] font-bold text-slate-400">
                                ฿
                              </span>
                              <input
                                type="number"
                                min="1"
                                placeholder="ราคา"
                                value={val(p.id, "price", p.price || 390)}
                                onChange={(e) => set(p.id, "price", e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-2 py-1 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all font-mono"
                                aria-label="ราคาขาย"
                              />
                            </div>
                            
                            {/* Stock */}
                            <input
                              type="number"
                              min="0"
                              placeholder="สต็อก"
                              value={val(p.id, "stock", p.stock || 100)}
                              onChange={(e) => set(p.id, "stock", e.target.value)}
                              className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none transition-all font-mono"
                              aria-label="จำนวนสต็อก"
                            />
                          </div>
                        ) : (
                          <div className="text-xs font-mono space-y-0.5">
                            <p className="text-slate-800 font-semibold">
                              ราคา: <span className="text-emerald-600">฿{p.price}</span>
                            </p>
                            <p className="text-slate-400">
                              สต็อก: <span className="font-bold">{p.stock} ชิ้น</span>
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Column 5: Rejection Reason */}
                      <td className="px-6 py-4">
                        {isPending ? (
                          <input
                            type="text"
                            placeholder="ระบุสาเหตุหากไม่ผ่าน..."
                            value={val(p.id, "reason", "")}
                            onChange={(e) => set(p.id, "reason", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-700 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                          />
                        ) : (
                          <p className="text-xs text-slate-400 italic max-w-[200px] truncate" title={p.rejectionReason}>
                            {p.rejectionReason || "-"}
                          </p>
                        )}
                      </td>

                      {/* Column 6: Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => review(p, "APPROVED")}
                              className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-[10px] font-bold text-white shadow-sm transition-all"
                            >
                              <Check size={11} />
                              <span>อนุมัติ</span>
                            </button>
                            <button
                              onClick={() => review(p, "REJECTED")}
                              className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition-all"
                            >
                              <X size={11} />
                              <span>ปฏิเสธ</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 font-medium">ตรวจแล้ว</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
