'use client';
import { useState, useEffect } from 'react';

export default function MyProductsPage() {
  // จำลองข้อมูลสินค้าเริ่มต้นของกลุ่มร้านเสื้อผ้า
  const defaultProducts = [
    { id: 1, name: 'Classic Black Hoodie', price: 790, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80', category: 'เสื้อฮู้ด' },
    { id: 2, name: 'Oversized Linen Shirt', price: 450, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80', category: 'เสื้อเชิ้ต' }
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('myProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('myProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  const handleDelete = (id) => {
    if (confirm('คุณแน่ใจใช่ไหมว่าต้องการลบสินค้าชิ้นนี้?')) {
      const updated = products.filter(item => item.id !== id);
      setProducts(updated);
      localStorage.setItem('myProducts', JSON.stringify(updated));
    }
  };

  return (
    <div style={{ width: '100%' }}>
      
      {/* 📊 ส่วนที่เพิ่มเข้ามา: กล่องสรุปสถิติร้านค้า ช่วยแก้ปัญหาหน้าเว็บโล่ง */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '35px'
      }}>
        {/* กล่องที่ 1 */}
        <div style={statCardStyle}>
          <span style={statLabelStyle}>💰 ยอดขายทั้งหมด (เดือนนี้)</span>
          <span style={statValueStyle}>฿12,450</span>
        </div>
        {/* กล่องที่ 2 (ดึงตามจำนวนสินค้าในตารางจริง) */}
        <div style={statCardStyle}>
          <span style={statLabelStyle}>📦 เสื้อผ้าทั้งหมดในระบบ</span>
          <span style={statValueStyle}>{products.length} รายการ</span>
        </div>
        {/* กล่องที่ 3 */}
        <div style={statCardStyle}>
          <span style={statLabelStyle}>⏳ ออเดอร์ที่ต้องจัดส่ง</span>
          <span style={statValueStyle}>3 คำสั่งซื้อ</span>
        </div>
      </div>

      {/* 🏷️ ส่วนหัวข้อและปุ่มเพิ่มสินค้า */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', margin: 0 }}>
          รายการสินค้าทั้งหมด
        </h2>
        <button 
          onClick={() => alert('ฟีเจอร์เพิ่มสินค้ากำลังพัฒนาต่อในกลุ่มครับ')}
          style={addButtonStyle}
        >
          ＋ เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* 📦 ตารางรายการสินค้า */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>สินค้า</th>
              <th style={thStyle}>หมวดหมู่</th>
              <th style={thStyle}>ราคา</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  ไม่มีสินค้าในระบบ
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '50px', height: '55px', borderRadius: '6px', objectFit: 'cover', background: '#f3f4f6' }} 
                      />
                      <span style={{ fontWeight: '500', color: '#111' }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: '#6b7280' }}>{product.category}</td>
                  <td style={{ ...tdStyle, fontWeight: '600', color: '#111' }}>฿{product.price}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button onClick={() => alert('แก้ไขสินค้าชิ้นนี้')} style={actionButtonStyle}>✏️ แก้ไข</button>
                      <button onClick={() => handleDelete(product.id)} style={{ ...actionButtonStyle, color: '#ef4444' }}>🗑️ ลบ</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// สไตล์สำหรับกล่องสถิติร้านค้า
const statCardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  padding: '20px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const statLabelStyle = {
  fontSize: '13px',
  color: '#6b7280',
  fontWeight: '500'
};

const statValueStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#000000'
};

// สไตล์ตารางและปุ่มต่างๆ
const thStyle = { padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#4b5563' };
const tdStyle = { padding: '16px 20px', fontSize: '15px', verticalAlign: 'middle' };
const addButtonStyle = { background: '#000000', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
const actionButtonStyle = { background: 'none', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: '#374151' };