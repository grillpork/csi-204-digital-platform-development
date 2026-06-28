'use client'; 
import Link from 'next/link'; 
import { usePathname } from 'next/navigation';

export default function ProfileLayout({ children }) {
  const pathname = usePathname();

  const baseLinkStyle = {
    color: '#555',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: '0.2s',
  };

  const activeLinkStyle = {
    ...baseLinkStyle,
    background: '#000000',
    color: '#ffffff',
  };

  // สไตล์สำหรับลิงก์ข้อตกลงด้านล่างสุด (Footer)
  const footerLinkStyle = {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    transition: '0.2s',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      background: '#ffffff', 
      color: '#000000', 
      fontFamily: 'sans-serif' 
    }}>
      
      {/* 🧭 แถบเมนูย่อยด้านบน (Sub-Navbar) */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 50px',
        borderBottom: '1px solid #eee',
        background: '#ffffff'
      }}>
        
        {/* 🏠 ฝั่งซ้าย: ไอคอนรูปบ้านย้อนกลับและหัวข้อ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/" style={{ 
            textDecoration: 'none', 
            fontSize: '22px', 
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: '0.2s',
            cursor: 'pointer'
          }} title="กลับสู่หน้าหลัก">
            🏠
          </Link>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>
            จัดการบัญชี
          </h2>
        </div>

        {/* ฝั่งขวา: เมนูย่อยสำหรับการสลับหน้าต่าง ๆ */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/profile" style={pathname === '/profile' ? activeLinkStyle : baseLinkStyle}>
            👤 โปรไฟล์ของฉัน
          </Link>
          {/* ข้อมูลจุดนี้ได้รับการแก้ไขภาษาเรียบร้อยแล้วครับ ✅ */}
          <Link href="/profile/edit" style={pathname === '/profile/edit' ? activeLinkStyle : baseLinkStyle}>
            📝 แก้ไขโปรไฟล์
          </Link>
          <Link href="/profile/products" style={pathname === '/profile/products' ? activeLinkStyle : baseLinkStyle}>
            📦 สินค้าของฉัน
          </Link>
          <Link href="/profile/favorites" style={pathname === '/profile/favorites' ? activeLinkStyle : baseLinkStyle}>
            ❤️ สินค้าที่ถูกใจ
          </Link>
        </div>
      </nav>

      {/* 📄 เนื้อหาภายในแดชบอร์ด */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 50px' }}>
        {children}
      </main>

      {/* 📋 แถบข้อตกลงและนโยบายด้านล่างสุด (Footer) */}
      <footer style={{
        borderTop: '1px solid #f3f4f6',
        padding: '25px 50px',
        background: '#ffffff',
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
      }}>
        <Link href="/privacy" style={footerLinkStyle}>นโยบายความเป็นส่วนตัว</Link>
        <Link href="/terms" style={footerLinkStyle}>ข้อตกลงการใช้บริการ</Link>
        <Link href="/help" style={footerLinkStyle}>ช่วยเหลือ</Link>
      </footer>

    </div>
  );
}