"use client";

import { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";
import { DollarOutlined, SyncOutlined } from "@ant-design/icons";
import { Wallet, Store, TrendingUp } from "lucide-react";

export default function RevenuePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching revenue:", err);
        setLoading(false);
      });
  }, []);

  const totalPayout = data.reduce((sum, item) => sum + item.designerRevenue, 0);
  const totalSales = data.reduce((sum, item) => sum + item.grossRevenue, 0);

  const columns = [
    {
      title: "ร้านค้า / ดีไซเนอร์",
      key: "seller",
      render: (_, record) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <Store size={14} className="text-slate-400" />
              {record.shopName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{record.name} ({record.email})</p>
          </div>
        </div>
      )
    },
    {
      title: "สินค้าที่ขายได้",
      dataIndex: "itemsSold",
      key: "itemsSold",
      align: "center",
      render: (val) => (
        <span className="font-semibold text-slate-700">{val} ชิ้น</span>
      )
    },
    {
      title: "ยอดขายรวม (Gross)",
      dataIndex: "grossRevenue",
      key: "grossRevenue",
      align: "right",
      render: (val) => (
        <span className="text-slate-500">฿{val.toLocaleString("th-TH")}</span>
      )
    },
    {
      title: "ส่วนแบ่งที่ต้องจ่าย (20%)",
      dataIndex: "designerRevenue",
      key: "designerRevenue",
      align: "right",
      render: (val) => (
        <span className="font-bold text-emerald-600 text-lg">฿{val.toLocaleString("th-TH")}</span>
      )
    },
    {
      title: "สถานะ",
      key: "status",
      align: "center",
      render: () => (
        <Tag icon={<SyncOutlined spin />} color="processing">รอโอนเงิน</Tag>
      )
    },
    {
      title: "จัดการ",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<DollarOutlined />}
          className="bg-indigo-600 hover:bg-indigo-700 border-none font-semibold text-xs rounded-lg"
          onClick={() => alert(`จำลองการโอนเงิน ฿${record.designerRevenue.toLocaleString("th-TH")} ให้ ${record.shopName}`)}
        >
          โอนเงิน
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Wallet className="text-indigo-600" />
          จัดการรายได้ดีไซเนอร์
        </h1>
        <p className="mt-1 text-sm text-slate-500">ตรวจสอบยอดขายและจัดการการโอนเงินส่วนแบ่ง (20%) ให้กับดีไซเนอร์</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <DollarOutlined style={{ fontSize: '28px' }} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">ยอดค้างจ่ายดีไซเนอร์รวม</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              ฿{totalPayout.toLocaleString("th-TH")}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">ยอดขายจากดีไซเนอร์รวม</p>
            <p className="text-3xl font-black text-slate-900 mt-1">
              ฿{totalSales.toLocaleString("th-TH")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 overflow-hidden">
        <Table
          columns={columns}
          dataSource={data.map(item => ({...item, key: item.sellerId}))}
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
}
