'use client'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ดึงข้อมูลจริงจากระบบฐานข้อมูลมาแสดงตอนเปิดหน้าเว็บ
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          const user = data.user;
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            bio: user.bio || '',
            avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // ฟังก์ชันแปลงไฟล์รูปภาพเป็น Base64 String เพื่อให้เซฟลงเครื่องได้
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ตอนกดปุ่มบันทึก: สั่งเซฟลงเครื่องคอมพิวเตอร์และฐานข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('บันทึกข้อมูลสำเร็จ!');
        router.push('/profile');
      } else {
        const data = await res.json();
        alert(data.error || 'บันทึกข้อมูลล้มเหลว');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ fontSize: '15px', color: '#6b7280' }}>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '550px' }}>
        
        <h1 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#111' }}>
          แก้ไขข้อมูลส่วนตัว
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ส่วนอัปโหลดรูปโปรไฟล์ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e7eb', background: '#f3f4f6' }}>
              <img src={formData.avatar} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <label style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              background: '#ffffff',
              transition: '0.2s'
            }}>
              📷 เปลี่ยนรูปโปรไฟล์
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>ชื่อ-นามสกุล</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>อีเมล</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>เบอร์โทรศัพท์</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>ที่อยู่จัดส่งสินค้า</label>
            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>รายละเอียดเกี่ยวกับฉัน (Bio)</label>
            <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <button type="submit" disabled={isSaving} style={{ ...buttonStyle, opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>

        </form>
      </div>
    </div>
  );
}

const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { color: '#4b5563', fontSize: '14px', fontWeight: '500' };
const inputStyle = { background: '#ffffff', border: '1px solid #d1d5db', color: '#1f2937', padding: '12px', borderRadius: '6px', outline: 'none', fontSize: '15px' };
const buttonStyle = { background: '#000000', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', marginTop: '15px' };