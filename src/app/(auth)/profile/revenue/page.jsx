"use client";

import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { Wallet, Package, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

export default function UserRevenuePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/revenue")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user revenue:", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "สินค้า (ผลงานออกแบบ)",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {record.image ? (
              <img src={record.image} alt={record.name} className="w-full h-full object-cover" />
            ) : (
              <Package size={20} className="text-slate-400" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{record.name}</p>
            <Link href={`/product/${record.id}`} className="text-[10px] text-indigo-600 hover:underline">
              ดูสินค้าในร้านค้า
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "จำนวนที่ขายได้",
      dataIndex: "itemsSold",
      key: "itemsSold",
      align: "center",
      render: (val) => (
        <span className="font-semibold text-slate-700">{val} ชิ้น</span>
      )
    },
    {
      title: "ยอดขายรวม",
      dataIndex: "grossRevenue",
      key: "grossRevenue",
      align: "right",
      render: (val) => (
        <span className="text-slate-500">฿{val.toLocaleString("th-TH")}</span>
      )
    },
    {
      title: "ส่วนแบ่งที่ได้รับ (20%)",
      dataIndex: "designerRevenue",
      key: "designerRevenue",
      align: "right",
      render: (val) => (
        <span className="font-bold text-emerald-600 text-lg">฿{val.toLocaleString("th-TH")}</span>
      )
    }
  ];

  if (loading) {
    return <div className="p-10 text-center text-slate-500 font-medium">กำลังโหลดข้อมูลรายได้...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center text-red-500 font-medium">ไม่สามารถโหลดข้อมูลได้</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 mb-1">
          <Wallet className="text-indigo-600" />
          รายได้ของฉัน
        </h1>
        <p className="text-sm text-slate-500">สรุปยอดขายจากผลงานการออกแบบของคุณและส่วนแบ่งที่ได้รับ (20%)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">ส่วนแบ่งที่ได้รับรวม</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              ฿{data.designerRevenue.toLocaleString("th-TH")}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">สินค้าที่ขายได้ทั้งหมด</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {data.totalItemsSold} <span className="text-lg font-bold text-slate-500">ชิ้น</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 overflow-hidden">
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-2">ยอดขายแยกตามสินค้า</h2>
        {data.products.length === 0 ? (
          <div className="text-center py-10">
            <Package size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">คุณยังไม่มียอดขายสินค้า</p>
            <Link href="/seller/products/new" className="text-indigo-600 hover:underline text-sm font-semibold mt-2 inline-block">
              สร้างผลงานใหม่เพื่อเพิ่มยอดขาย!
            </Link>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={data.products.map(p => ({...p, key: p.id}))}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        )}
      </div>
    </div>
  );
}
