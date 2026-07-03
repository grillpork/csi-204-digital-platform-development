"use client";

import { useEffect, useState } from "react";
import { 
  Grid, 
  Ruler, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Loader2, 
  AlertCircle, 
  Info,
  DollarSign
} from "lucide-react";

export default function CatalogManagement() {
  const [activeTab, setActiveTab] = useState("type"); // "type" | "size" | "quality"
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data States
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [qualities, setQualities] = useState([]);
  
  // Loading & Feedback States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Modal & Form States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // { id, target, name, code, description/chestSize, price }
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form input states (for adding new items)
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState(""); // used for description/chestSize
  const [newPrice, setNewPrice] = useState(0);

  // Load catalog specs
  const fetchCatalog = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/catalog");
      const result = await res.json();
      if (res.ok && result.success) {
        setTypes(result.data.types || []);
        setSizes(result.data.sizes || []);
        setQualities(result.data.qualities || []);
      } else {
        setErrorMsg(result.error || "ไม่สามารถดึงข้อมูลสเปกสินค้าได้");
      }
    } catch (err) {
      setErrorMsg("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Flash alert helper
  const triggerAlert = (type, msg) => {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3500);
    }
  };

  // Create speculative item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      triggerAlert("error", "กรุณาระบุชื่อ");
      return;
    }
    if (activeTab !== "quality" && !newCode.trim()) {
      triggerAlert("error", "กรุณาระบุรหัสภาษาอังกฤษ (Code)");
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        name: newName,
        isActive: true,
      };

      if (activeTab === "type") {
        data.code = newCode;
        data.description = newDesc;
      } else if (activeTab === "size") {
        data.code = newCode;
        data.chestSize = newDesc;
      } else if (activeTab === "quality") {
        data.description = newDesc;
        data.price = newPrice;
      }

      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: activeTab, data }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        triggerAlert("success", "เพิ่มรายการสำเร็จ!");
        
        // Refresh local data list
        if (activeTab === "type") setTypes(prev => [...prev, result.data]);
        else if (activeTab === "size") setSizes(prev => [...prev, result.data]);
        else if (activeTab === "quality") setQualities(prev => [...prev, result.data]);
        
        // Reset fields
        setNewName("");
        setNewCode("");
        setNewDesc("");
        setNewPrice(0);
        setShowAddForm(false);
      } else {
        triggerAlert("error", result.error || "เกิดข้อผิดพลาดในการสร้างรายการ");
      }
    } catch (err) {
      triggerAlert("error", "ไม่สามารถเชื่อมต่อระบบเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status helper
  const handleToggleStatus = async (item, target) => {
    try {
      const updatedStatus = !item.isActive;
      const res = await fetch("/api/admin/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          id: item.id,
          data: { isActive: updatedStatus },
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        triggerAlert("success", `เปลี่ยนสถานะสำเร็จ!`);
        
        // Update list state locally
        const updateList = list => list.map(x => x.id === item.id ? { ...x, isActive: updatedStatus } : x);
        if (target === "type") setTypes(updateList);
        else if (target === "size") setSizes(updateList);
        else if (target === "quality") setQualities(updateList);
      } else {
        triggerAlert("error", result.error || "ล้มเหลวในการอัปเดตสถานะ");
      }
    } catch (err) {
      triggerAlert("error", "เกิดข้อผิดพลาดในการปรับปรุงสถานะ");
    }
  };

  // Update existing record
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editItem.name.trim()) {
      triggerAlert("error", "กรุณาระบุชื่อ");
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        name: editItem.name,
      };

      if (editItem.target === "type") {
        data.code = editItem.code;
        data.description = editItem.description;
      } else if (editItem.target === "size") {
        data.code = editItem.code;
        data.chestSize = editItem.chestSize;
      } else if (editItem.target === "quality") {
        data.description = editItem.description;
        data.price = editItem.price;
      }

      const res = await fetch("/api/admin/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: editItem.target,
          id: editItem.id,
          data,
        }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        triggerAlert("success", "แก้ไขสเปกสำเร็จ!");
        
        // Update list state locally
        const updateList = list => list.map(x => x.id === editItem.id ? result.data : x);
        if (editItem.target === "type") setTypes(updateList);
        else if (editItem.target === "size") setSizes(updateList);
        else if (editItem.target === "quality") setQualities(updateList);
        
        setIsEditModalOpen(false);
        setEditItem(null);
      } else {
        triggerAlert("error", result.error || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      }
    } catch (err) {
      triggerAlert("error", "ไม่สามารถแก้ไขข้อมูลได้เนื่องจากเครือข่ายขัดข้อง");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete spec item
  const handleDeleteItem = async (id, target) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/catalog?target=${target}&id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok && result.success) {
        triggerAlert("success", "ลบรายการสำเร็จ!");
        
        // Remove locally from state list
        const filterList = list => list.filter(x => x.id !== id);
        if (target === "type") setTypes(filterList);
        else if (target === "size") setSizes(filterList);
        else if (target === "quality") setQualities(filterList);
      } else {
        triggerAlert("error", result.error || "ไม่สามารถลบรายการได้");
      }
    } catch (err) {
      triggerAlert("error", "เกิดข้อผิดพลาดทางเทคนิคระหว่างเชื่อมต่อลบข้อมูล");
    }
  };

  // Open edit modal
  const openEdit = (item, target) => {
    setEditItem({
      ...item,
      target,
    });
    setIsEditModalOpen(true);
  };

  // Filtering list based on tab and query
  const getFilteredItems = () => {
    let list = [];
    if (activeTab === "type") list = types;
    else if (activeTab === "size") list = sizes;
    else if (activeTab === "quality") list = qualities;

    if (!searchQuery.trim()) return list;

    return list.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.chestSize && item.chestSize.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Messages banner */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-400 animate-slide-in">
          <Check size={18} className="shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 bg-rose-500 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-rose-400 animate-slide-in">
          <AlertCircle size={18} className="shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Clean Page Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">ตั้งค่าสเปกสินค้าเสื้อ</h1>
        <p className="text-slate-500 text-xs">
          จัดการข้อมูลที่ใช้ในการตั้งชื่อประเภทเสื้อ ขนาดรอบอก และตัวเลือกเนื้อผ้า/คุณภาพการผลิตสำหรับลูกค้าในหน้าดีไซเนอร์และ Marketplace
        </p>
      </div>

      {/* Add Dialog Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setShowAddForm(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 overflow-hidden animate-zoom-in z-10">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Plus size={18} className="text-indigo-600" />
                <span>เพิ่มตัวเลือก {activeTab === "type" ? "ประเภทเสื้อ" : activeTab === "size" ? "ไซส์เสื้อ" : "คุณภาพเนื้อผ้า"}</span>
              </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">ชื่อภาษาไทย</label>
                <input
                  type="text"
                  placeholder={activeTab === "type" ? "เช่น เสื้อคอปกลายขวาง" : activeTab === "size" ? "เช่น M" : "เช่น Cotton 100% (Premium)"}
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              {activeTab !== "quality" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">รหัสอ้างอิงภาษาอังกฤษ (Code)</label>
                  <input
                    type="text"
                    placeholder={activeTab === "type" ? "เช่น POLO_STRIPE" : "เช่น M"}
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  {activeTab === "type" ? "คำอธิบายเสื้อ" : activeTab === "size" ? "รายละเอียดรอบอก" : "รายละเอียดคุณภาพผ้า"}
                </label>
                <input
                  type="text"
                  placeholder={activeTab === "type" ? "เช่น เสื้อโปโลพิมพ์แถบเท่ๆ" : activeTab === "size" ? "เช่น อก 38\"" : "เช่น นุ่มพิเศษ ทนทาน ไม่ย้วยง่าย"}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              {activeTab === "quality" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">ราคาบวกเพิ่ม (฿)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="เช่น 50"
                    value={newPrice}
                    onChange={e => setNewPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>บันทึกตัวเลือก</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3-Column Grid Cards (Acts as filter tabs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Shirt Types */}
        <div 
          onClick={() => { setActiveTab("type"); setShowAddForm(false); }}
          className={`p-6 rounded-3xl cursor-pointer transition-all ${
            activeTab === "type"
              ? "bg-slate-900 text-white shadow-lg active:scale-98"
              : "bg-white text-slate-800 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${activeTab === "type" ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-650"}`}>
              <Grid size={22} />
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              activeTab === "type" ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {types.filter(x => x.isActive).length} / {types.length} ใช้งาน
            </span>
          </div>
          <div className="mt-5 space-y-1">
            <h3 className="text-md font-bold">ประเภทเสื้อ (Types)</h3>
            <p className={`text-xs leading-relaxed ${activeTab === "type" ? "text-slate-300" : "text-slate-400"}`}>
              สเปกหมวดหมู่หลัก เช่น เสื้อยืด, โปโล, เสื้อกันหนาวฮู้ดดี้
            </p>
          </div>
        </div>

        {/* Card 2: Sizes */}
        <div 
          onClick={() => { setActiveTab("size"); setShowAddForm(false); }}
          className={`p-6 rounded-3xl cursor-pointer transition-all ${
            activeTab === "size"
              ? "bg-slate-900 text-white shadow-lg active:scale-98"
              : "bg-white text-slate-800 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${activeTab === "size" ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-650"}`}>
              <Ruler size={22} />
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              activeTab === "size" ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {sizes.filter(x => x.isActive).length} / {sizes.length} ใช้งาน
            </span>
          </div>
          <div className="mt-5 space-y-1">
            <h3 className="text-md font-bold">ขนาดเสื้อ (Sizes)</h3>
            <p className={`text-xs leading-relaxed ${activeTab === "size" ? "text-slate-300" : "text-slate-400"}`}>
              ขนาดไซส์มาตรฐานอ้างอิงรอบอก เช่น S, M, L, XL, 2XL
            </p>
          </div>
        </div>

        {/* Card 3: Qualities */}
        <div 
          onClick={() => { setActiveTab("quality"); setShowAddForm(false); }}
          className={`p-6 rounded-3xl cursor-pointer transition-all ${
            activeTab === "quality"
              ? "bg-slate-900 text-white shadow-lg active:scale-98"
              : "bg-white text-slate-800 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${activeTab === "quality" ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-650"}`}>
              <Layers size={22} />
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              activeTab === "quality" ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {qualities.filter(x => x.isActive).length} / {qualities.length} ใช้งาน
            </span>
          </div>
          <div className="mt-5 space-y-1">
            <h3 className="text-md font-bold">คุณภาพเนื้อผ้า (Qualities)</h3>
            <p className={`text-xs leading-relaxed ${activeTab === "quality" ? "text-slate-300" : "text-slate-400"}`}>
              เกรดคุณภาพเนื้อผ้าและตัวเลือกราคาบวกเพิ่มเสริมการผลิต
            </p>
          </div>
        </div>

      </div>



      {/* Main Spec List Panel */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 size={36} className="animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">กำลังโหลดรายละเอียดสเปกสินค้า...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center gap-3">
            <Info size={32} />
            <div>
              <p className="font-bold text-slate-700">ไม่พบสเปกเสื้อตามที่เลือก</p>
              <p className="text-xs text-slate-400 mt-1">ยังไม่มีรายการข้อมูล หรือไม่มีรายการที่สอดคล้องกับคีย์เวิร์ดค้นหา</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">ชื่อเรียกภาษาไทย</th>
                  {activeTab !== "quality" && <th className="px-6 py-4">รหัสอ้างอิง (Code)</th>}
                  <th className="px-6 py-4">
                    {activeTab === "type" ? "คำอธิบายประเภทเสื้อ" : activeTab === "size" ? "ขนาดอก" : "คำอธิบายเนื้อผ้า"}
                  </th>
                  {activeTab === "quality" && <th className="px-6 py-4 text-right">ราคาเพิ่ม (฿)</th>}
                  <th className="px-6 py-4 text-center">การแสดงผล (Status)</th>
                  <th className="px-6 py-4 text-right">จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {filteredItems.map(item => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${!item.isActive ? "bg-slate-50/30 opacity-70" : ""}`}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{item.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                    
                    {activeTab !== "quality" && (
                      <td className="px-6 py-4 font-mono text-xs">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md">{item.code}</span>
                      </td>
                    )}
                    
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {activeTab === "type" ? item.description : activeTab === "size" ? item.chestSize : item.description}
                    </td>

                    {activeTab === "quality" && (
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600 font-mono">
                        +{item.price.toLocaleString("th-TH")} ฿
                      </td>
                    )}

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item, activeTab)}
                        className={`cursor-pointer inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                        <span>{item.isActive ? "ใช้งานอยู่" : "ปิดใช้งาน"}</span>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item, activeTab)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, activeTab)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="ลบสเปกสินค้า"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Dialog Modal */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            onClick={() => setIsEditModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 overflow-hidden animate-zoom-in z-10">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="font-bold text-slate-800 text-lg">แก้ไขข้อมูลสเปก</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">ชื่อภาษาไทย</label>
                <input
                  type="text"
                  value={editItem.name}
                  onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              {editItem.target !== "quality" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">รหัสภาษาอังกฤษ (Code)</label>
                  <input
                    type="text"
                    value={editItem.code || ""}
                    onChange={e => setEditItem({ ...editItem, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              )}

              {editItem.target === "type" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">คำอธิบายประเภทเสื้อ</label>
                  <input
                    type="text"
                    value={editItem.description || ""}
                    onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              )}

              {editItem.target === "size" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">รายละเอียดขนาดรอบอก</label>
                  <input
                    type="text"
                    value={editItem.chestSize || ""}
                    onChange={e => setEditItem({ ...editItem, chestSize: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              )}

              {editItem.target === "quality" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">คำอธิบายเนื้อผ้า</label>
                    <input
                      type="text"
                      value={editItem.description || ""}
                      onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">ราคาเพิ่ม (฿)</label>
                    <input
                      type="number"
                      min="0"
                      value={editItem.price}
                      onChange={e => setEditItem({ ...editItem, price: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditItem(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>บันทึกการแก้ไข</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => {
          setShowAddForm(true);
          setNewName("");
          setNewCode("");
          setNewDesc("");
          setNewPrice(0);
        }}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all active:scale-95 hover:scale-105 cursor-pointer group"
        title="เพิ่มสเปกใหม่"
      >
        <Plus size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-bold whitespace-nowrap">
          เพิ่มสเปกใหม่
        </span>
      </button>

    </div>
  );
}
