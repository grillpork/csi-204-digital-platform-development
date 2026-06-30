'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  // ข้อมูลเริ่มต้นเผื่อกรณีเปิดครั้งแรกแล้วยังไม่มีข้อมูลในเครื่อง
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0987654321',
    address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    bio: 'Hello, world! ยินดีต้อนรับสู่โปรไฟล์ของฉัน',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
  });

  // คอยดึงข้อมูลล่าสุดจาก localStorage มาโชว์ในหน้าหลัก
  useEffect(() => {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      setUser(JSON.parse(savedData));
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '650px' }}>
        
        <h1 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#111' }}>
          ข้อมูลส่วนตัวของฉัน
        </h1>

        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '30px',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          {/* แสดงรูปภาพโปรไฟล์ล่าสุดที่ดึงมาจากเครื่อง */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <img src={user.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{user.name}</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>สมาชิกทั่วไป</p>
            </div>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>ชื่อ-นามสกุล</span>
            <span style={valueStyle}>{user.name}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>อีเมล</span>
            <span style={valueStyle}>{user.email}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>เบอร์โทรศัพท์</span>
            <span style={valueStyle}>{user.phone}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>เกี่ยวกับฉัน (Bio)</span>
            <span style={valueStyle}>{user.bio}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            <span style={labelStyle}>ที่อยู่สำหรับจัดส่งสินค้า</span>
            <span style={{ ...valueStyle, lineHeight: '1.6' }}>{user.address}</span>
          </div>

        </div>

        <button onClick={() => router.push('/profile/edit')} style={{ ...buttonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Edit3 size={16} /> แก้ไขข้อมูลโปรไฟล์
        </button>

      </div>
    </div>
  );
}

const infoRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' };
const labelStyle = { color: '#6b7280', fontSize: '14px', fontWeight: '500' };
const valueStyle = { color: '#111111', fontSize: '15px', fontWeight: '500' };
const buttonStyle = { width: '100%', background: '#000000', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', marginTop: '25px' };