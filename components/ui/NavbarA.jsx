import Link from "next/link";
import { Heart, User } from "lucide-react";
import CartDrawer from "./CartDrawer";

// แถบ navbar ของหน้าสินค้า: เป็น nav สีดำแบบ fixed (โลโก้, เมนู, ไอคอนตะกร้า/หัวใจ/โปรไฟล์, ปุ่มเปลี่ยนภาษา)
export default function NavbarA({ lang, onLangToggle }) {
  return (
    <header className="w-full h-[96px] bg-white border-b border-gray-200 flex items-center relative z-50">
      <div className="max-w-[1440px] w-full mx-auto">
        <nav className="py-6 bg-white text-black justify-around flex items-center gap-8 px-6 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tight">
            The Shirtsy
          </div> 
          <div className="flex gap-12">
            {["หน้าแรก", "ร้านค้า", "บทความ", "เกี่ยวกับเรา"].map((item) => (
              <div
                key={item}
                className="text-sm hover:text-black cursor-pointer transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <CartDrawer
              size={20}
              className="hover:text-black cursor-pointer transition-colors"
            />
            <Heart
              size={20}
              className="hover:text-black cursor-pointer transition-colors"
            />
            <Link href="/login">
              <User
                size={20}
                className="hover:text-black cursor-pointer transition-colors"
              />
            </Link>
            <button
              onClick={onLangToggle}
              className="text-xs border border-gray-300 rounded px-2 py-1 hover:border-black hover:text-black transition-colors"
            >
              {lang === "EN" ? "EN" : "TH"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
