"use client";

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Shield, User, Settings, Check, X } from 'lucide-react';

const initialCases = [
  // Customer
  { id: "UAT-C01", persona: "Customer", name: "สมัครสมาชิก", status: "pass", type: "normal", desc: "" },
  { id: "UAT-C02", persona: "Customer", name: "เข้าสู่ระบบ", status: "pass", type: "normal", desc: "" },
  { id: "UAT-C03", persona: "Customer", name: "ค้นหาสินค้า", status: "pass", type: "normal", desc: "" },
  { id: "UAT-C04", persona: "Customer", name: "เพิ่มสินค้าในตะกร้า", status: "pass", type: "normal", desc: "" },
  // Staff
  { id: "UAT-S01", persona: "Staff", name: "ตรวจสอบคำสั่งซื้อ", status: "pass", type: "normal", desc: "" },
  { id: "UAT-S02", persona: "Staff", name: "อัปเดตสถานะสินค้า", status: "pass", type: "normal", desc: "" },
  { id: "UAT-S03", persona: "Staff", name: "จัดการสต็อกสินค้า", status: "pass", type: "normal", desc: "" },
  // Manager
  { id: "UAT-M01", persona: "Manager", name: "เพิ่มข้อมูลสินค้า", status: "pass", type: "normal", desc: "" },
  { id: "UAT-M02", persona: "Manager", name: "แก้ไขข้อมูลสินค้า", status: "pass", type: "normal", desc: "" },
  { id: "UAT-M03", persona: "Manager", name: "ดูรายงานยอดขาย", status: "pass", type: "normal", desc: "" },
  { id: "UAT-M04", persona: "Manager", name: "ดูแดชบอร์ดผู้บริหาร", status: "pass", type: "normal", desc: "" }
];

export default function UatPage() {
  const [testCases, setTestCases] = useState(initialCases);

  const toggleStatus = (id) => {
    setTestCases(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === "pass" ? "fail" : "pass" };
      }
      return item;
    }));
  };

  const passCount = testCases.filter(c => c.status === "pass").length;
  const totalCount = testCases.length;
  const passPercentage = Math.round((passCount / totalCount) * 100);

  const getPersonaColor = (persona) => {
    switch (persona) {
      case "Customer": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Staff": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Manager": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPersonaIcon = (persona) => {
    switch (persona) {
      case "Customer": return <User className="w-3.5 h-3.5 mr-1" />;
      case "Staff": return <Shield className="w-3.5 h-3.5 mr-1" />;
      case "Manager": return <Settings className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
          บันทึกการทดสอบโดยผู้ใช้ (UAT Testing)
        </h1>
        <p className="text-[15px] leading-7 text-slate-500 max-w-2xl">
          ผลการทดสอบระบบโดยกลุ่มผู้ใช้แบบ UAT (User Acceptance Testing) ครอบคลุมผู้ใช้หลัก 3 กลุ่ม รวมทั้งสิ้น 11 เคสการทดสอบ โดยผลลัพธ์ผ่านการยืนยันทั้งหมดเพื่อพร้อมส่งมอบโครงงาน
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">เคสที่ผ่านการทดสอบ</span>
            <span className="text-2xl font-bold text-slate-950">{passCount} / {totalCount} เคส</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <div className="text-lg font-bold">{passPercentage}%</div>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">เปอร์เซ็นต์ความสำเร็จ</span>
            <span className="text-2xl font-bold text-slate-950">Success Rate</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">ปัญหาที่คงค้าง (Issues)</span>
            <span className="text-2xl font-bold text-slate-950">{totalCount - passCount} เคส</span>
          </div>
        </div>
      </div>

      {/* Interactive UAT Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">รหัสทดสอบ</th>
                <th className="py-4 px-6">กลุ่มผู้ใช้งาน</th>
                <th className="py-4 px-6">รายการทดสอบ</th>
                <th className="py-4 px-6 text-center">สถานะการทดสอบ</th>
                <th className="py-4 px-6">ปัญหา / ข้อผิดพลาด</th>
                <th className="py-4 px-6">รายละเอียดของปัญหา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-sm">
              {testCases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-semibold text-slate-900">{item.id}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${getThemeClasses(item.persona)}`}>
                      {getPersonaIcon(item.persona)}
                      {item.persona}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        item.status === "pass"
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-rose-500 text-white hover:bg-rose-600"
                      }`}
                    >
                      {item.status === "pass" ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {item.status === "pass" ? "ผ่าน" : "ไม่ผ่าน"}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs leading-relaxed">
                    {item.status === "pass" ? (
                      <span className="text-slate-400 font-light">ไม่มีปัญหา / ข้อผิดพลาด</span>
                    ) : (
                      <span className="text-rose-600 font-semibold">พบปัญหาการทำงานของระบบ</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-light text-xs">
                    {item.status === "pass" ? "-" : "ขัดข้องระหว่างประมวลผล (ต้องการตรวจสอบโค้ด API)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getThemeClasses(persona) {
  switch (persona) {
    case "Customer": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Staff": return "bg-blue-50 text-blue-700 border-blue-200";
    case "Manager": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
