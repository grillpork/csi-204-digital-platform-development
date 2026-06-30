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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
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