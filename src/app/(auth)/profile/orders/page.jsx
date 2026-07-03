"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const labels = { PENDING: "รอยืนยัน", PENDING_PAYMENT: "รอชำระเงิน", PAYMENT_EXPIRED: "หมดเวลาชำระ", PAID: "ชำระแล้ว", PROCESSING: "กำลังผลิต", SHIPPED: "กำลังจัดส่ง", COMPLETED: "สำเร็จ", CANCELLED: "ยกเลิก" };
const statusColors = {
  PENDING: "bg-amber-100 text-amber-800",
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAYMENT_EXPIRED: "bg-black text-white",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-green-100 text-green-800",
  SHIPPED: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800"
};
async function body(response){const text=await response.text();try{return text?JSON.parse(text):{}}catch{return{}}}

export default function OrdersPage(){
 const[orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[payment,setPayment]=useState(null);
 async function load(){try{const r=await fetch("/api/orders");const j=await body(r);if(!r.ok)throw new Error(j.error);setOrders(j.data)}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function resume(id){const r=await fetch(`/api/orders/${id}/payment`);const j=await body(r);if(!r.ok)return setError(j.error||"เปิดข้อมูลชำระเงินไม่ได้");setPayment(j.data)}
 async function cancel(id){if(!confirm("ยกเลิกคำสั่งซื้อนี้และคืนสินค้าเข้าสต็อกหรือไม่?"))return;const r=await fetch(`/api/orders/${id}/cancel`,{method:"POST"});const j=await body(r);if(!r.ok)return setError(j.error||"ยกเลิกไม่สำเร็จ");setPayment(null);await load()}
  return <div><h1 className="mb-6 text-2xl font-bold">ประวัติการสั่งซื้อ</h1>{error&&<p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{loading?<p>กำลังโหลด…</p>:orders.length===0?<div className="rounded-2xl border p-10 text-center"><p className="text-slate-500">ยังไม่มีคำสั่งซื้อ</p><Link href="/" className="mt-3 inline-block font-semibold underline">เลือกซื้อสินค้า</Link></div>:<div className="space-y-4">{orders.map(o=><article key={o.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-slate-500">เลขที่คำสั่งซื้อ</p><p className="font-mono text-sm font-bold">{o.id}</p><p className="mt-1 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString("th-TH")}</p></div><div className="text-right"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[o.status] || "bg-slate-100 text-slate-800"}`}>{labels[o.status]||o.status}</span><p className="mt-2 font-bold">฿{o.total_amount.toLocaleString("th-TH")}</p></div></div><div className="mt-4 border-t pt-4 text-sm text-slate-600">{o.items.map(i=><p key={i.id}>{i.product.name} × {i.quantity}</p>)}</div><div className="mt-4 flex flex-wrap gap-3">{o.status==="PENDING_PAYMENT"&&<><button onClick={()=>resume(o.id)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">ชำระเงินต่อ</button><button onClick={()=>cancel(o.id)} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600">ยกเลิกออเดอร์</button></>}</div></article>)}</div>}
 {payment&&<div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center"><h2 className="text-lg font-bold">ชำระเงินผ่าน PromptPay</h2><p className="mt-1 text-xs text-slate-500">ออเดอร์ {payment.orderId}</p><img src={payment.qrCodeUrl} alt="PromptPay QR Code" className="mx-auto my-5 h-52 w-52 rounded-xl border p-2"/><p className="font-bold">฿{payment.amount.toLocaleString("th-TH")}</p><p className="mt-1 text-xs text-slate-500">ใช้ได้ถึง {new Date(payment.expiresAt).toLocaleString("th-TH")}</p><p className="mt-3 text-xs text-amber-700">ระบบจะอัปเดตเป็นชำระแล้วหลังได้รับ webhook ยืนยันเท่านั้น</p><button onClick={()=>setPayment(null)} className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white">ปิดและชำระภายหลัง</button></div></div>}
 </div>
}
