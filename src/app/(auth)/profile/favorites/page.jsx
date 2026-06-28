'use client';
import { useState, useEffect } from 'react';

export default function FavoritesPage() {
  // จำลองข้อมูลสินค้าที่ถูกใจให้เข้ากับหน้าหลักของร้าน
  const defaultFavorites = [
    { id: 101, name: 'Minimalist White T-Shirt', price: 390, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
    { id: 102, name: 'Oversized Linen Shirt', price: 450, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80' },
    { id: 103, name: 'Striped Summer Dress', price: 690, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80' },
    { id: 104, name: 'Casual Denim Jacket', price: 1290, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80' }
  ];

  const [favorites, setFavorites] = useState([]);

  // ดึงข้อมูลจาก localStorage ถ้าไม่มีให้ใช้ค่าเริ่มต้น
  useEffect(() => {
    const savedFavs = localStorage.getItem('myFavorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    } else {
      setFavorites(defaultFavorites);
      localStorage.setItem('myFavorites', JSON.stringify(defaultFavorites));
    }
  }, []);

  // ฟังก์ชันกดลบออกจากรายการโปรด
  const removeFavorite = (id) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    localStorage.setItem('myFavorites', JSON.stringify(updated));
  };

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', marginBottom: '30px' }}>
        สินค้าที่ถูกใจ ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#888', border: '1px dashed #ddd', borderRadius: '8px' }}>
          ❤️ ยังไม่มีสินค้าที่ถูกใจในรายการของคุณ
        </div>
      ) : (
        // 🛍️ แสดงผลเป็น Grid 4 คอลัมน์แบบมินิมอล
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '25px',
          width: '100%'
        }}>
          {favorites.map((item) => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              
              {/* รูปภาพสินค้า */}
              <div style={{ width: '100%', height: '280px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', marginBottom: '12px' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* ปุ่มรูปหัวใจสีแดงสำหรับกดลบออก (ลอยอยู่มุมขวาบนของการ์ด) */}
              <button 
                onClick={() => removeFavorite(item.id)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                title="ลบออกจากรายการโปรด"
              >
                ❤️
              </button>

              {/* ชื่อสินค้าและราคา */}
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '500', color: '#111' }}>{item.name}</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold', color: '#000' }}>฿{item.price}</p>

              {/* ปุ่มดูรายละเอียดสไตล์แบรนด์เสื้อผ้าสีดำสนิท */}
              <button 
                onClick={() => alert(`ลิงก์ไปหน้าสินค้าชิ้นที่ ${item.id}`)}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: '0.2s',
                  textAlign: 'center'
                }}
              >
                ดูรายละเอียดสินค้า
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}