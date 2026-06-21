# CustomShirt

ระบบร้านค้าออนไลน์ (E-commerce) สำหรับสั่งทำและสกรีนโลโก้ลงบนเสื้อยืด พัฒนาขึ้นเพื่อ **การศึกษารูปแบบการทำงานของระบบ E-commerce** ในรายวิชา CSI-204 Digital Platform Development

## วัตถุประสงค์ของโปรเจกต์

เพื่อศึกษาและฝึกปฏิบัติการออกแบบ/พัฒนาเว็บแอปพลิเคชันแบบ E-commerce ตั้งแต่การออกแบบโครงสร้างฐานข้อมูล หน้าเว็บ และฟังก์ชันการทำงานหลักของระบบร้านค้าออนไลน์ โดยใช้กรณีศึกษาเป็นร้านรับสั่งทำเสื้อสกรีนโลโก้ตามสั่ง (custom logo printing)

## เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วน | เทคโนโลยี | เวอร์ชัน |
|---|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) | 16.2.9 |
| UI Library | [React](https://react.dev/) | 19.2.4 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (v4, ผ่าน `@tailwindcss/postcss`) | ^4 |
| State Management | [Zustand](https://github.com/pmndrs/zustand) (พร้อม `persist` middleware เก็บตะกร้าไว้ใน localStorage) | ^5.0.14 |
| Icons | [lucide-react](https://lucide.dev/) | ^1.20.0 |
| Linting | [ESLint](https://eslint.org/) + `eslint-config-next` | ^9 |
| Fonts | `next/font/google` (Geist, Geist Mono) | - |

## โครงสร้างโปรเจกต์ (Project Structure)

```
csi-204-digital-platform-development/
├── app/
│   ├── layout.jsx        # Root layout: โหลดฟอนต์ Geist, ครอบ Footer ทุกหน้า
│   ├── page.jsx          # หน้า All Products (Navbar, Filters, รายการสินค้า, Pagination)
│   ├── globals.css       # Global styles + Tailwind
│   └── favicon.ico
├── components/
│   └── ui/
│       ├── CartDrawer.jsx   # ตะกร้าสินค้าแบบ Drawer: ดูตะกร้า, ลบสินค้า, Checkout, Popup สำเร็จ
│       └── Footer.jsx       # Footer ของเว็บไซต์ (เมนูจาก context/site.js)
├── context/
│   └── site.js           # ค่าคงที่ของไซต์ (NavbarMenu, FooterMenu)
├── store/
│   └── product.js        # Zustand store: cart, favorites, addToCart, removeFromCart, clearCart, toggleFavorite
├── public/                # Static assets (svg, ไอคอน)
├── package.json
└── README.md
```

> หมายเหตุ: ปัจจุบันหน้า **Shop (All Products)** ถูกพัฒนาไว้ใน `app/page.jsx` แล้ว ส่วนหน้า **Home, Blog, About** อยู่ในแผนของโครงสร้างเมนู (`NavbarMenu` ใน `context/site.js`) แต่ยังไม่ได้แยกเป็น route ของตัวเอง (`app/shop/`, `app/blog/`, `app/about/`) ตามแนวทาง Next.js App Router

### โครงสร้างหน้าเว็บ (Pages)

- **Home** – หน้าแรกแนะนำร้าน
- **Shop** – แสดงสินค้าทั้งหมด (All Products), ค้นหา, กรองสินค้า (หมวดหมู่/สี/ไซส์/แขนเสื้อ), อัปโหลดโลโก้, เพิ่มสินค้าลงตะกร้า
- **Blog** – บทความ/เนื้อหาเกี่ยวกับร้าน
- **About** – ข้อมูลเกี่ยวกับร้าน

## โครงสร้างฐานข้อมูลเบื้องต้น (Database Schema)

ออกแบบไว้สำหรับข้อมูลหลักที่ระบบต้องจัดเก็บ (ปัจจุบันฝั่ง frontend ยังจำลองสินค้าด้วย mock data และเก็บตะกร้าไว้ใน localStorage ผ่าน Zustand ยังไม่ได้เชื่อมต่อฐานข้อมูลจริง)

### `users`
| Field | Type | Description |
|---|---|---|
| id | PK | รหัสผู้ใช้ |
| name | string | ชื่อผู้ใช้ |
| email | string | อีเมล (ใช้ login) |
| password | string | รหัสผ่าน (hashed) |
| address | string | ที่อยู่จัดส่ง |
| phone | string | เบอร์โทร |
| role | enum | customer / admin |
| created_at | datetime | วันที่สมัคร |

### `products`
| Field | Type | Description |
|---|---|---|
| id | PK | รหัสสินค้า |
| name | string | ชื่อสินค้า |
| description | text | รายละเอียดสินค้า |
| price | decimal | ราคา |
| category | string | หมวดหมู่ (T-Shirt, Polo, Hoodie, ...) |
| color | string | สี |
| size | string | ไซส์ (XS–XXL) |
| sleeve_type | string | ประเภทแขนเสื้อ |
| image_url | string | รูปสินค้า |
| stock | integer | จำนวนคงเหลือ |

### `logo_uploads`
| Field | Type | Description |
|---|---|---|
| id | PK | รหัสไฟล์ |
| user_id | FK → users.id | ผู้ที่อัปโหลด |
| file_url | string | ที่อยู่ไฟล์ภาพโลโก้ |
| file_name | string | ชื่อไฟล์ต้นฉบับ |
| uploaded_at | datetime | วันที่อัปโหลด |

### `orders`
| Field | Type | Description |
|---|---|---|
| id | PK | รหัสคำสั่งซื้อ |
| user_id | FK → users.id | ผู้สั่งซื้อ |
| status | enum | pending / paid / shipped / completed |
| payment_method | string | โอนเงิน / บัตรเครดิต / เก็บเงินปลายทาง (COD) |
| total_price | decimal | ยอดรวม |
| created_at | datetime | วันที่สั่งซื้อ |

### `order_items`
| Field | Type | Description |
|---|---|---|
| id | PK | รหัสรายการ |
| order_id | FK → orders.id | คำสั่งซื้อที่เกี่ยวข้อง |
| product_id | FK → products.id | สินค้าที่สั่ง |
| logo_upload_id | FK → logo_uploads.id | ไฟล์โลโก้ที่ใช้สกรีน (ถ้ามี) |
| quantity | integer | จำนวน |
| price | decimal | ราคาต่อหน่วย ณ ตอนสั่ง |

## ฟังก์ชันการทำงาน (Features)

- **ดู All Products** – แสดงสินค้าทั้งหมดพร้อมค้นหาและกรองสินค้า (หมวดหมู่, สี, ไซส์, ประเภทแขนเสื้อ)
- **เลือกสินค้า** – ดูรายละเอียดสินค้า, อัปโหลดภาพโลโก้ที่ต้องการสกรีน
- **เพิ่มสินค้าลงตะกร้า (Add to Cart)** – เพิ่ม/ลบสินค้าในตะกร้า, ตะกร้าจะถูกจำไว้ในเครื่อง (localStorage)
- **ชำระเงิน (Checkout)** – เลือกวิธีชำระเงิน (โอนเงิน/บัตรเครดิต หรือ เก็บเงินปลายทาง) แล้วยืนยันคำสั่งซื้อ
- **Popup สำเร็จการสั่งซื้อ** – แสดง popup แจ้งผลการสั่งซื้อสำเร็จหลัง checkout

## วิธีเริ่มใช้งาน (Getting Started)

ติดตั้ง dependencies:

```bash
npm install
```

รัน development server:

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

คำสั่งอื่น ๆ:

```bash
npm run build   # build สำหรับ production
npm run start   # รัน production server
npm run lint    # ตรวจสอบโค้ดด้วย ESLint
```

## ผู้พัฒนา

- 67113735 Awirut Jiensakul
- 67118021 Triopp Saibut
- 67156767 Phakjira Deechoi
- 67141535 Lalla Dodchare
- 66083478 nanthamon supo