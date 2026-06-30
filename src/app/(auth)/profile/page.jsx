'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ fontSize: '15px', color: '#6b7280' }}>กำลังโหลดข้อมูลโปรไฟล์...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ fontSize: '15px', color: '#ef4444' }}>กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</div>
      </div>
    );
  }

  const userAvatar = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
  const userBio = user.bio || 'ยังไม่ได้ระบุข้อมูลเกี่ยวกับตนเอง';
  const userAddress = user.address || 'ยังไม่ได้ระบุที่อยู่จัดส่งสินค้า';
  const userPhone = user.phone || 'ยังไม่ได้ระบุเบอร์โทรศัพท์';

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
              <img src={userAvatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{user.name}</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                {user.isSeller ? 'นักออกแบบ / ผู้ขาย (Seller)' : 'สมาชิกทั่วไป'}
              </p>
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
            <span style={valueStyle}>{userPhone}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>เกี่ยวกับฉัน (Bio)</span>
            <span style={valueStyle}>{userBio}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
            <span style={labelStyle}>ที่อยู่สำหรับจัดส่งสินค้า</span>
            <span style={{ ...valueStyle, lineHeight: '1.6' }}>{userAddress}</span>
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