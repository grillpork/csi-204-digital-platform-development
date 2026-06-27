import Footer from "@/components/shared/Footer";

// layout ฝั่งร้านค้า: เนื้อหายืดเต็ม (flex-1) แล้วต่อด้วย Footer ให้ติดล่างจอ
export default function ShopLayout({ children }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}