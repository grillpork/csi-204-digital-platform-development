"use client";

import React, { useState } from 'react';
import { DollarSign, ShieldAlert, Award, ArrowUpRight, TrendingUp, CheckCircle, Clock, CheckCircle2 } from 'lucide-react';

const mockTransactions = [
  { id: "TX-9902", date: "2026-06-28", design: "Retro Sunset Tee", type: "DFT", qty: 2, earnings: 140, status: "Cleared" },
  { id: "TX-9844", date: "2026-06-25", design: "Cyberpunk Cat", type: "DTG", qty: 1, earnings: 90, status: "Cleared" },
  { id: "TX-9812", date: "2026-06-24", design: "Classic Vintage", type: "DFT", qty: 3, earnings: 210, status: "Cleared" },
  { id: "TX-9788", date: "2026-06-20", design: "Abstract Dream", type: "DTG", qty: 1, earnings: 95, status: "Pending" },
  { id: "TX-9721", date: "2026-06-18", design: "Retro Sunset Tee", type: "DFT", qty: 1, earnings: 70, status: "Cleared" }
];

export default function EarningsPage() {
  const [kycVerified, setKycVerified] = useState(false);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  
  // KYC Form fields
  const [idCard, setIdCard] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('SCB');
  
  // Withdrawal Form fields
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleKycSubmit = (e) => {
    e.preventDefault();
    setKycSubmitted(true);
    // Simulate auto-approval after 2 seconds for interactive feel
    setTimeout(() => {
      setKycVerified(true);
    }, 2000);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) > 440) {
      alert("ยอดเงินคงเหลือไม่เพียงพอสำหรับการถอนจำนวนนี้");
      return;
    }
    setWithdrawSuccess(true);
    setWithdrawAmount('');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 bg-white text-slate-800 font-sans">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">รายได้ของฉัน (My Earnings)</h1>
        <p className="text-sm text-slate-500">
          ข้อมูลวิเคราะห์ผลตอบแทน ส่วนแบ่งค่าลิขสิทธิ์ดีไซน์เสื้อยืด และการเบิกถอนรายได้ของนักออกแบบ
        </p>
      </div>

      {/* Stats Summary Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">รายได้รวมทั้งหมด</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">฿605</span>
            <span className="text-xs text-green-500 font-medium">ยอดขายรวม</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ถอนได้ (Balance)</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 text-blue-600">฿440</span>
            <span className="text-xs text-slate-400">พร้อมเบิก</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ยอดรอดำเนินการ</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 text-amber-600">฿95</span>
            <span className="text-xs text-slate-400">รอเคลียร์</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ถอนสะสมแล้ว</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 text-slate-700">฿70</span>
            <span className="text-xs text-slate-400">โอนสำเร็จแล้ว</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Left Column: KYC / Withdraw Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              การจัดการเบิกเงิน
            </h3>

            {/* If KYC not verified yet */}
            {!kycVerified ? (
              <div>
                {kycSubmitted ? (
                  <div className="py-4 text-center">
                    <Clock className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">กำลังตรวจสอบข้อมูลเอกสาร...</p>
                    <p className="text-[10px] text-slate-400 mt-1">ใช้เวลาประมวลผลประมาณ 2 วินาที</p>
                  </div>
                ) : (
                  <form onSubmit={handleKycSubmit} className="space-y-3.5">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2 text-amber-900 text-[11px] leading-relaxed mb-1">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <span>คุณจำเป็นต้องทำเรื่องยืนยันตัวตน (KYC) และบัญชีผู้รับเงินก่อนจะถอนรายได้สะสมออกไปได้</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">เลขบัตรประชาชน</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={13} 
                        placeholder="เลข 13 หลัก" 
                        value={idCard} 
                        onChange={(e) => setIdCard(e.target.value)} 
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white outline-none focus:border-slate-400 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ธนาคารรับเงิน</label>
                      <select 
                        value={bankName} 
                        onChange={(e) => setBankName(e.target.value)} 
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white outline-none focus:border-slate-400 text-slate-800"
                      >
                        <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                        <option value="KBANK">กสิกรไทย (KBank)</option>
                        <option value="BBL">กรุงเทพ (BBL)</option>
                        <option value="KTB">กรุงไทย (KTB)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">เลขบัญชีธนาคาร</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="เลขบัญชีธนาคาร" 
                        value={bankAccount} 
                        onChange={(e) => setBankAccount(e.target.value)} 
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white outline-none focus:border-slate-400 text-slate-800"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                    >
                      ยืนยันตัวตน (KYC)
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* If KYC verified, show withdraw form */
              <div>
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 border border-green-200/60 p-2.5 rounded-xl text-xs font-semibold mb-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>ยืนยันตัวตน KYC ผ่านแล้ว</span>
                </div>

                {withdrawSuccess ? (
                  <div className="py-4 text-center bg-white border border-slate-200 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-900">ส่งคำขอถอนเงินสำเร็จ!</p>
                    <p className="text-[10px] text-slate-500 mt-1">เงินจะโอนเข้าบัญชีภายใน 24 ชม.</p>
                    <button 
                      onClick={() => setWithdrawSuccess(false)}
                      className="mt-3 text-[10px] font-semibold text-blue-600 hover:underline"
                    >
                      ทำรายการใหม่
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ระบุจำนวนเงินที่ต้องการถอน</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs text-slate-400">฿</span>
                        <input 
                          type="number" 
                          required 
                          placeholder="ขั้นต่ำ ฿100" 
                          value={withdrawAmount} 
                          onChange={(e) => setWithdrawAmount(e.target.value)} 
                          className="w-full text-xs border border-slate-200 rounded-lg pl-6 pr-3 py-2 bg-white outline-none focus:border-slate-400 text-slate-800 font-semibold"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                    >
                      ถอนเข้าบัญชี
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="md:col-span-2 space-y-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">ประวัติรายรับสะสม (Sales Transactions)</h3>
              <span className="text-xs text-slate-400 font-semibold">{mockTransactions.length} รายการ</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-500">
                <thead className="bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th scope="col" className="px-5 py-3">ออเดอร์</th>
                    <th scope="col" className="px-5 py-3">รายละเอียดผลงาน</th>
                    <th scope="col" className="px-5 py-3 text-center">สกรีน</th>
                    <th scope="col" className="px-5 py-3 text-right">กำไรสุทธิ</th>
                    <th scope="col" className="px-5 py-3 text-center">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {tx.id}
                        <span className="block text-[10px] text-slate-400 font-normal font-sans mt-0.5">{tx.date}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {tx.design}
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">จำนวน {tx.qty} ชิ้น</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200/60 font-semibold font-mono rounded text-[10px] text-slate-600">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        ฿{tx.earnings}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.status === "Cleared" 
                            ? "bg-green-50 text-green-700 border border-green-100" 
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {tx.status === "Cleared" ? "สำเร็จ" : "รอดำเนินการ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
