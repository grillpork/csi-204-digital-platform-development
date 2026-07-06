## ผู้พัฒนา

- 67113735 Awirut Jiensakul
- 67118021 Triopp Saibut
- 67156767 Phakjira Deechoi
- 67141535 Lalla Dodchare

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
| role | enum | custuomer|
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
| payment_method | string | บัตรเครดิต / พร้อมเพย์ QR Code |
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
- **ชำระเงิน (Checkout)** – เลือกวิธีชำระเงิน (บัตรเครดิต หรือ พร้อมเพย์ QR Code) แล้วยืนยันคำสั่งซื้อ
- **Popup สำเร็จการสั่งซื้อ** – แสดง popup แจ้งผลการสั่งซื้อสำเร็จหลัง checkout

## วิธีเริ่มใช้งาน (Getting Started)

### Marketplace approval flow

1. ผู้ใช้เข้าสู่ระบบและออกแบบเสื้อที่ `/custom`
2. บันทึกแบบร่างหรือส่งให้ผู้ดูแลตรวจจากหน้าออกแบบ
3. ผู้ใช้ติดตาม/ถอนคำขอ/ลบแบบได้ที่ `/profile/products`
4. ผู้ดูแลเปิด `/dashboard/designs` เพื่อกำหนดราคา จำนวนพร้อมขาย และอนุมัติหรือปฏิเสธ
5. สินค้าที่อนุมัติจะแสดงที่หน้าร้านทันที ส่วนแบบอื่นไม่สามารถใส่ตะกร้าได้

ระบบรูปภาพรองรับ Cloudflare R2 ผ่านตัวแปร `R2_*` ใน `.env.example` และ fallback เป็น `public/uploads` เมื่อพัฒนาในเครื่อง

### ตั้งค่าครั้งแรก / หลัง `git pull` (สำคัญ — ทำตามลำดับ)

> ทีมใช้ **ฐานข้อมูล cloud ตัวเดียวกันทั้งทีม** — schema และข้อมูลเริ่มต้น (roles) ถูกตั้งไว้บน DB กลางแล้ว
> ดังนั้น **ไม่ต้องรัน `prisma migrate` และ `prisma seed`** แค่ทำ 4 ขั้นนี้:

```bash
# 1. ดึงโค้ดล่าสุด
git pull

# 2. วางไฟล์ .env ที่ได้รับจากแชทส่วนตัวของทีม ไว้ที่ root ของโปรเจกต์
#    (ไฟล์นี้มี DATABASE_URL และ JWT_SECRET — ห้าม commit ขึ้น git เด็ดขาด)

# 3. ติดตั้ง dependencies (postinstall จะรัน `prisma generate` ให้อัตโนมัติ)
npm install

# 4. รัน
npm run dev      # เปิดเว็บที่ http://localhost:3000
```

**ข้อกำหนด:** ต้องใช้ **Node.js เวอร์ชัน 18 ขึ้นไป** (แนะนำ 20 หรือ 22) — เช็คด้วย `node --version`

> ⚠️ ถ้าแก้ `prisma/schema.prisma` แล้วโค้ดฟ้องว่าหา field/model ไม่เจอ ให้รัน `npx prisma generate` ใหม่อีกครั้ง

### คำสั่งอื่น ๆ

```bash
npm run build   # build สำหรับ production
npm run start   # รัน production server
npm run lint    # ตรวจสอบโค้ดด้วย ESLint
npm test        # รัน unit/integration test (jest)
```


flowchart TD
    Start(["เข้าเว็บ"]) --> ViewProducts["ดูสินค้าในเว็บ (ไม่ต้อง Login)\n/shop"]
    ViewProducts --> ChoosePath{"เลือกทาง"}

    %% ═══════════════════════════════════════════
    %% Flow A: ซื้อสินค้าที่มีคนลงขาย
    %% ═══════════════════════════════════════════
    ChoosePath -->|"ซื้อสินค้าปกติ"| ProductDetail["เข้าหน้ารายละเอียดสินค้า\n/product/[id]"]
    ProductDetail --> AddCart["กด Add to Cart\n(เลือกสี / ไซส์ / จำนวน)"]
    AddCart --> GuestCheck{"Login แล้ว?"}
    GuestCheck -->|"ใช่"| SaveCartDB["บันทึกลง Cart ใน Database\nPOST /api/cart"]
    GuestCheck -->|"ไม่"| SaveCartLocal["บันทึกลง Local Cart\n(Zustand + localStorage)"]
    SaveCartDB --> CartDrawer["เปิดตะกร้าสินค้า (CartDrawer)\nเพิ่ม / ลบ / แก้ไขได้"]
    SaveCartLocal --> CartDrawer

    CartDrawer --> ClickCheckout{"กดปุ่มดำเนินการสั่งซื้อ"}
    ClickCheckout --> CheckLoginCheckout{"Login แล้ว?"}
    CheckLoginCheckout -->|"ไม่"| LoginPageA["หน้า Login / Register\n/login หรือ /register"]
    LoginPageA --> SyncCart["syncCart: ส่ง Local Cart ทุกรายการ\nไปบันทึกใน DB แล้วดึงกลับ"]
    SyncCart --> CheckoutForm
    CheckLoginCheckout -->|"ใช่"| CheckoutForm["แสดงฟอร์ม Checkout\n(ที่อยู่จัดส่ง — ไม่บังคับกรอก)"]

    CheckoutForm --> PaymentChoice{"เลือกวิธีชำระเงิน"}

    %% Payment: Credit Card (Omise)
    PaymentChoice -->|"บัตรเครดิต"| TokenizeCard["สร้าง Omise Token จากข้อมูลบัตร\n(Omise.js Frontend)"]
    TokenizeCard --> CardCharge["POST /api/checkout\n(paymentMethod: card)"]
    CardCharge --> CardResult{"ผลการชาร์จ?"}
    CardResult -->|"successful"| CreateOrderPaid[("สร้าง Order สถานะ PAID\n+ Payment status: successful\n+ ลด stock + ล้างตะกร้า")]
    CardResult -->|"pending (3DS)"| Redirect3DS["Redirect ไปหน้า 3D Secure\n(authorize_uri)"]
    Redirect3DS --> WebhookVerify
    CardResult -->|"failed"| PaymentFailed["แจ้งเตือน: การชำระเงินไม่สำเร็จ"]
    PaymentFailed --> CheckoutForm

    %% Payment: PromptPay QR (Omise)
    PaymentChoice -->|"PromptPay QR"| PromptPayCharge["POST /api/checkout\n(paymentMethod: transfer)"]
    PromptPayCharge --> CreateOrderPending[("สร้าง Order สถานะ PENDING_PAYMENT\n+ Payment status: pending\n+ QR Code URL + หมดเวลา 30 นาที\n+ ลด stock + ล้างตะกร้า")]
    CreateOrderPending --> ShowQR["แสดง QR Code ให้สแกนจ่าย"]
    ShowQR --> QRDecision{"ลูกค้าจะทำอะไร?"}
    QRDecision -->|"สแกนจ่ายสำเร็จ"| WebhookVerify["Omise Webhook (charge.complete)\nPOST /api/webhooks/omise"]
    QRDecision -->|"จ่ายทีหลัง"| PendingOrder["แจ้งเตือน: รอชำระเงิน\nดูได้ที่ประวัติออเดอร์"]

    WebhookVerify --> VerifyCharge{"ตรวจสอบกับ Omise API โดยตรง\n(status, currency, amount)"}
    VerifyCharge -->|"ยืนยันสำเร็จ"| UpdateToPaid["อัปเดต Order → PAID\nPayment → successful"]
    VerifyCharge -->|"ออเดอร์ยกเลิก/หมดเวลาแล้ว"| PaidAfterClosed["บันทึก paid_after_closed\n(ต้อง review refund)"]

    CreateOrderPaid --> OrderSuccess(["สั่งซื้อสำเร็จ ✓"])
    UpdateToPaid --> OrderSuccess

    %% ═══════════════════════════════════════════
    %% Order Status State Machine (Admin)
    %% ═══════════════════════════════════════════
    OrderSuccess --> AdminDashboard["Admin Dashboard จัดการคำสั่งซื้อ\n/dashboard/order"]
    AdminDashboard --> StatusUpdate["เปลี่ยนสถานะออเดอร์\nPATCH /api/admin/orders"]
    StatusUpdate --> TransitionCheck{"ตรวจสอบ allowedTransitions\n(ห้ามย้อนกลับสถานะ)"}

    TransitionCheck --> AllowedPaths["PENDING → PENDING_PAYMENT / CANCELLED\nPENDING_PAYMENT → PAID / PAYMENT_EXPIRED / CANCELLED\nPAID → PROCESSING / SHIPPED / COMPLETED / CANCELLED\nPROCESSING → SHIPPED / COMPLETED / CANCELLED\nSHIPPED → COMPLETED / CANCELLED\nCOMPLETED ✗ เปลี่ยนไม่ได้\nCANCELLED ✗ เปลี่ยนไม่ได้\nPAYMENT_EXPIRED ✗ เปลี่ยนไม่ได้"]

    %% ═══════════════════════════════════════════
    %% Payment Expiry (เช็คอัตโนมัติ)
    %% ═══════════════════════════════════════════
    PendingOrder -.->|"หมดเวลา 30 นาที"| ExpireCheck["GET /api/orders\nเช็ค payments.expires_at ≤ now"]
    ExpireCheck --> AutoExpire["อัปเดต Order → PAYMENT_EXPIRED\nคืน stock ทุกรายการ\nPayment → expired"]

    %% ═══════════════════════════════════════════
    %% ดูประวัติออเดอร์
    %% ═══════════════════════════════════════════
    OrderSuccess -.->|"ลูกค้าเปิดดู"| OrderHistory["ประวัติคำสั่งซื้อ\n/profile/orders\n(สีสถานะแยกชัดเจน 8 สี)"]

    %% ═══════════════════════════════════════════
    %% Flow B: ออกแบบเสื้อ Custom
    %% ═══════════════════════════════════════════
    ChoosePath -->|"ออกแบบเสื้อสกรีน Custom"| CustomPage["หน้าออกแบบ Custom\n/custom?productId=X\n(ไม่ต้อง Login)\nอัปโหลดลาย / เลือกสี / ตั้งชื่อแบบ\nไซส์ S-XXL อัตโนมัติ / เลือกด้านหน้า-หลัง\nขนาดสกรีน / เทคนิคสกรีน"]

    CustomPage --> SaveDesign{"กดบันทึก (ต้อง Login)"}
    SaveDesign --> CheckLoginCustom{"Login แล้ว?"}
    CheckLoginCustom -->|"ไม่"| LoginPageB["หน้า Login / Register"]
    LoginPageB --> CustomPage
    CheckLoginCustom -->|"ใช่"| UploadImages["อัปโหลดภาพ overlay + composite\nPOST /api/custom-upload"]
    UploadImages --> SaveChoice{"เลือกวิธีบันทึก"}

    SaveChoice -->|"บันทึกแบบร่าง"| SaveDraft["POST /api/designs\napprovalStatus: DRAFT\nis_public: false"]
    SaveChoice -->|"ส่งให้แอดมินตรวจ"| SaveAndSubmit["POST /api/designs → POST /api/designs/submit\napprovalStatus: PENDING\nis_public: false"]

    SaveDraft --> MyDesigns["หน้าแบบเสื้อของฉัน\n/profile/products"]
    SaveAndSubmit --> AdminReview

    %% ═══════════════════════════════════════════
    %% Admin Design Review
    %% ═══════════════════════════════════════════
    MyDesigns -->|"กดส่งตรวจ (DRAFT/REJECTED)"| SubmitReview["POST /api/designs/submit\napprovalStatus → PENDING"]
    SubmitReview --> AdminReview

    MyDesigns -->|"กดถอนคำขอ (PENDING)"| RetractDraft["DELETE /api/designs/submit\napprovalStatus → DRAFT"]
    RetractDraft --> MyDesigns

    AdminReview["Admin ตรวจสอบแบบเสื้อ\n/dashboard/designs\nPATCH /api/admin/designs"]
    AdminReview -->|"อนุมัติ (ตั้งราคา + สต็อก)"| Approved["approvalStatus: APPROVED\nis_public: true\nสินค้าขึ้นหน้าร้าน"]
    Approved --> ViewProducts
    AdminReview -->|"ไม่อนุมัติ (ระบุเหตุผล)"| Rejected["approvalStatus: REJECTED\nrejectionReason: '...'\nis_public: false"]
    Rejected --> MyDesigns

    MyDesigns -->|"กดแก้ไข (DRAFT/REJECTED)"| CustomPage

    %% ═══════════════════════════════════════════
    %% Side Features
    %% ═══════════════════════════════════════════
    subgraph SideFeatures["Side Features (ต้อง Login)"]
        ProfileMgmt["โปรไฟล์: ดู/แก้ชื่อ/เบอร์โทร/ที่อยู่/bio/รูปโปรไฟล์\n/profile + /profile/edit\nPATCH /api/user/profile + POST /api/user/avatar"]
        FavoritePage["รายการโปรด\n/profile/favorites\nPOST /api/favorites + DELETE /api/favorites"]
        RevenuePage["รายได้จากผลงานออกแบบ\n/profile/revenue\nGET /api/user/revenue"]
    end

    %% ═══════════════════════════════════════════
    %% Admin Features
    %% ═══════════════════════════════════════════
    subgraph AdminFeatures["Admin Dashboard (ต้อง Login + Role Admin)"]
        AdminOverview["หน้า Overview\n/dashboard/overview"]
        AdminOrders["จัดการคำสั่งซื้อ\n/dashboard/order"]
        AdminDesigns["ตรวจแบบเสื้อ\n/dashboard/designs"]
        AdminCatalog["จัดการแม่แบบสินค้า\n/dashboard/catalog"]
        AdminRevenue["จัดการรายได้\n/dashboard/revenue"]
    end

    %% ═══════════════════════════════════════════
    %% Infrastructure / External
    %% ═══════════════════════════════════════════
    subgraph Infra["Infrastructure / External"]
        DB[("Neon PostgreSQL\nvia Prisma ORM")]
        ImgStorage[("Image Storage\npublic/uploads/custom")]
        OmiseAPI["Omise Payment Gateway\n(Credit Card + PromptPay)"]
    end

    SaveCartDB --> DB
    SyncCart --> DB
    CardCharge --> OmiseAPI
    PromptPayCharge --> OmiseAPI
    WebhookVerify --> OmiseAPI
    CreateOrderPaid --> DB
    CreateOrderPending --> DB
    UploadImages --> ImgStorage
    SaveDraft --> DB
    SaveAndSubmit --> DB
    LoginPageA --> DB
    LoginPageB --> DB
    FavoritePage --> DB
    OrderHistory --> DB
    ProfileMgmt --> DB
    RevenuePage --> DB
    AdminOrders --> DB
    AdminDesigns --> DB
    AdminCatalog --> DB