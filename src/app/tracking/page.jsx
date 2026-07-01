"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Truck, CheckCircle2 } from "lucide-react";

const stages = [
  ["PENDING", "รับคำสั่งซื้อแล้ว"], ["PAID", "ชำระเงินแล้ว"],
  ["PROCESSING", "กำลังผลิต"], ["SHIPPED", "กำลังจัดส่ง"], ["COMPLETED", "จัดส่งสำเร็จ"],
];

function TrackingContent() {
  const searchParams = useSearchParams();
  const [id, setId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e?.preventDefault();
    const value = id.trim();
    if (!value) return setError("กรุณากรอกเลขที่คำสั่งซื้อ");
    setLoading(true); setError(""); setOrder(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(value)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "ไม่พบคำสั่งซื้อ");
      setOrder(json.data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  const index = order ? (order.status === "PENDING_PAYMENT" ? 0 : stages.findIndex(([key]) => key === order.status)) : -1;
  return <main className="min-h-screen bg-slate-50 px-4 py-12">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center"><h1 className="text-3xl font-bold text-slate-900">ติดตามคำสั่งซื้อ</h1><p className="mt-2 text-sm text-slate-500">ใช้เลขที่คำสั่งซื้อจากหน้ายืนยันหรือประวัติการสั่งซื้อ</p></div>
      <form onSubmit={search} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input value={id} onChange={e=>setId(e.target.value)} placeholder="เลขที่คำสั่งซื้อ" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 font-mono text-sm"/></div>
        <button disabled={loading} className="rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white disabled:opacity-50">{loading ? "กำลังค้นหา…" : "ค้นหา"}</button>
      </form>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {order && <section className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-3 border-b pb-5"><div><p className="text-xs text-slate-500">เลขที่คำสั่งซื้อ</p><p className="font-mono font-bold">{order.id}</p></div><div className="text-right"><p className="text-xs text-slate-500">ยอดรวม</p><p className="font-bold">฿{order.total_amount.toLocaleString("th-TH")}</p></div></div>
        {order.status === "PENDING_PAYMENT" && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">ออเดอร์นี้ยังรอชำระเงิน กรุณาเปิดประวัติคำสั่งซื้อเพื่อชำระต่อ</p>}
        <div className="grid gap-3 sm:grid-cols-5">{stages.map(([key,label],i)=><div key={key} className={`rounded-xl border p-3 text-center text-xs ${i<=index?"border-slate-900 bg-slate-900 text-white":"border-slate-200 text-slate-400"}`}>{i===4?<CheckCircle2 className="mx-auto mb-2"/>:i===3?<Truck className="mx-auto mb-2"/>:<Package className="mx-auto mb-2"/>}{label}</div>)}</div>
        <div><p className="text-xs font-semibold text-slate-500">ที่อยู่จัดส่ง</p><p className="mt-1 whitespace-pre-line text-sm">{order.shippingAddress}</p></div>
      </section>}
    </div>
  </main>;
}

export default function TrackingPage(){ return <Suspense><TrackingContent/></Suspense>; }
