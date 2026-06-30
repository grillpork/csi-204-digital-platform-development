# Database Schema & Mermaid ER Diagram

เอกสารนี้รวบรวมโครงสร้างฐานข้อมูล (Database Schema) ทั้งในรูปแบบของ **Prisma Schema** และ **Mermaid ER Diagram** สำหรับธุรกิจ Print-on-Demand (POD) Marketplace (ระบบสั่งผลิตและสกรีนเสื้อออนไลน์แบบเปิดให้ Creator ลงลายขายได้)

คุณสามารถคัดลอกโค้ด Mermaid ด้านล่างนี้ไปใส่ในโปรแกรมวาดไดอะแกรม เช่น [draw.io / diagrams.net](https://app.diagrams.net/) หรือโปรแกรมที่รองรับ Mermaid ได้ทันทีครับ

---

## 1. Mermaid ER Diagram

```mermaid
erDiagram
    ROLE ||--o{ USER : "has"
    USER ||--o{ CREATOR_DESIGN : "owns"
    USER ||--o{ ORDER : "places"
    USER ||--o{ PAYOUT : "receives"
    USER ||--OB CART : "has"
    
    PRODUCT_BASE ||--o{ PRODUCT_BASE_STOCK : "has"
    PRODUCT_BASE ||--o{ CART_ITEM : "added_in"
    PRODUCT_BASE ||--o{ ORDER_ITEM : "ordered_in"
    
    CREATOR_DESIGN ||--o{ CART_ITEM : "applied_to"
    CREATOR_DESIGN ||--o{ ORDER_ITEM : "applied_to"
    
    CART ||--o{ CART_ITEM : "contains"
    
    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER ||--o{ CLAIM : "has"
    
    ORDER_ITEM ||--o{ CLAIM_ITEM : "claimed_in"
    CLAIM ||--o{ CLAIM_ITEM : "contains"
    
    USER {
        string id PK
        string name
        string email UK
        string password
        string address
        string phone
        int roleId FK
        boolean isSeller
        string shopName
        string bankName
        string bankAccountNo
        string bankAccountName
        string taxId
        datetime createdAt
    }

    ROLE {
        int id PK
        string name UK
    }

    PRODUCT_BASE {
        int id PK
        string name
        string description
        int basePrice
        string category
        string allowedColors
        string allowedSizes
        string imageUrls
        boolean isActive
    }

    PRODUCT_BASE_STOCK {
        int id PK
        int productBaseId FK
        string color
        string size
        int stock
    }

    CREATOR_DESIGN {
        string id PK
        string title
        string description
        string designUrl
        string previewUrl
        int markupPrice
        string status "PENDING | APPROVED | REJECTED"
        string rejectReason
        string creatorId FK
        datetime createdAt
    }

    CART {
        int id PK
        string userId FK "UK"
        datetime createdAt
        datetime updatedAt
    }

    CART_ITEM {
        int id PK
        int cartId FK
        int productBaseId FK
        string creatorDesignId FK "nullable"
        string selectedColor
        string selectedSize
        int quantity
        datetime addedAt
    }

    ORDER {
        string id PK
        string userId FK
        string status "PENDING | PAID | IN_PRODUCTION | SHIPPED | DELIVERED | COMPLETED | CANCELLED"
        string paymentStatus "UNPAID | PAID | REFUNDED"
        string paymentMethod
        string paymentProofUrl
        int totalBasePrice
        int totalMarkupPrice
        int shippingFee
        int grandTotal
        string shippingName
        string shippingAddress
        string shippingPhone
        string trackingNumber
        datetime paidAt
        datetime createdAt
        datetime updatedAt
    }

    ORDER_ITEM {
        int id PK
        string orderId FK
        int productBaseId FK
        string creatorDesignId FK "nullable"
        string selectedColor
        string selectedSize
        int priceAtOrder
        int markupAtOrder
        int quantity
    }

    CLAIM {
        string id PK
        string orderId FK
        string reason
        string detail
        string proofUrls
        string status "PENDING | APPROVED | REJECTED"
        string adminComment
        datetime createdAt
    }

    CLAIM_ITEM {
        int id PK
        string claimId FK
        int orderItemId FK
        int quantity
    }

    PAYOUT {
        string id PK
        string creatorId FK
        int amount
        string status "PENDING | PAID | FAILED"
        string transferSlipUrl
        datetime payoutCycleStart
        datetime payoutCycleEnd
        datetime paidAt
        datetime createdAt
    }
```

---

## 2. โครงสร้างตาราง (Prisma Schema Specification)

ด้านล่างนี้คือโครงสร้างโมเดลที่จะใช้ปรับปรุงในไฟล์ `prisma/schema.prisma` ต่อไป:

```prisma
// 1. ระบบจัดการผู้ใช้และสิทธิ์
model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique // ADMIN, CREATOR, CUSTOMER
  users User[]

  @@map("roles")
}

model User {
  id              String          @id @default(cuid())
  name            String
  email           String          @unique
  password        String
  address         String?
  phone           String?
  roleId          Int             @default(1)
  role            Role            @relation(fields: [roleId], references: [id])
  
  // ข้อมูลฝั่ง Creator/Seller
  isSeller        Boolean         @default(false) @map("is_seller")
  shopName        String?         @map("shop_name")
  bankName        String?         @map("bank_name")        // สำหรับโอนเงิน
  bankAccountNo   String?         @map("bank_account_no")
  bankAccountName String?         @map("bank_account_name")
  taxId           String?         @map("tax_id")           // สำหรับหักภาษี ณ ที่จ่าย

  designs         CreatorDesign[]
  cart            Cart?
  orders          Order[]
  payouts         Payout[]
  createdAt       DateTime        @default(now()) @map("created_at")

  @@map("users")
}

// 2. ระบบสินค้าและสต็อก (แยกเสื้อเปล่าออกจากลายดีไซน์)
enum Category {
  TSHIRT
  POLO
  HOODIE
  LONG_SLEEVE
  TANK_TOP
}

model ProductBase {
  id           Int                @id @default(autoincrement())
  name         String             // เช่น "เสื้อยืด Cotton 100% เกรดพรีเมียม"
  description  String
  basePrice    Int                @map("base_price") // ราคาต้นทุนเสื้อเปล่า + ค่าสกรีนพื้นฐาน
  category     Category
  images       String[]           // รูปเสื้อเปล่ามุมต่างๆ
  colors       String[]           // สีที่รองรับ
  sizes        Size[]             // ไซส์ที่รองรับ
  isActive     Boolean            @default(true) @map("is_active")
  
  stocks       ProductBaseStock[]
  cartItems    CartItem[]
  orderItems   OrderItem[]
  createdAt    DateTime           @default(now()) @map("created_at")

  @@map("product_bases")
}

model ProductBaseStock {
  id            Int         @id @default(autoincrement())
  productBaseId Int         @map("product_base_id")
  productBase   ProductBase @relation(fields: [productBaseId], references: [id], onDelete: Cascade)
  color         String
  size          Size
  stock         Int         @default(0)

  @@unique([productBaseId, color, size])
  @@map("product_base_stocks")
}

enum Size {
  XS
  S
  M
  L
  XL
  XXL
}

// 3. ลายดีไซน์ของ Creator
enum DesignStatus {
  PENDING
  APPROVED
  REJECTED
}

model CreatorDesign {
  id           String        @id @default(cuid())
  title        String
  description  String?
  designUrl    String        @map("design_url")    // ไฟล์ความละเอียดสูงสำหรับพิมพ์ (ซ่อนไว้ให้เฉพาะโรงงานดู)
  previewUrl   String        @map("preview_url")   // ไฟล์สำหรับแสดงผลหน้าเว็บ (แปะลายน้ำ)
  markupPrice  Int           @default(0) @map("markup_price") // ราคาที่ Creator บวกเพิ่ม (จะได้ส่วนนี้เป็น Royalty)
  status       DesignStatus  @default(PENDING)
  rejectReason String?       @map("reject_reason")
  
  creatorId    String        @map("creator_id")
  creator      User          @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  
  cartItems    CartItem[]
  orderItems   OrderItem[]
  createdAt    DateTime      @default(now()) @map("created_at")

  @@map("creator_designs")
}

// 4. ตะกร้าสินค้า
model Cart {
  id        Int        @id @default(autoincrement())
  userId    String     @unique @map("user_id")
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  @@map("carts")
}

model CartItem {
  id              Int            @id @default(autoincrement())
  cartId          Int            @map("cart_id")
  cart            Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  
  productBaseId   Int            @map("product_base_id")
  productBase     ProductBase    @relation(fields: [productBaseId], references: [id])
  
  creatorDesignId String?        @map("creator_design_id") // เป็น Nullable เผื่อลูกค้าสั่งเสื้อเปล่าไม่สกรีนลาย
  creatorDesign   CreatorDesign? @relation(fields: [creatorDesignId], references: [id])
  
  selectedColor   String         @map("selected_color")
  selectedSize    Size           @map("selected_size")
  quantity        Int            @default(1)
  addedAt         DateTime       @default(now()) @map("added_at")

  @@map("cart_items")
}

// 5. ระบบคำสั่งซื้อและการผลิต
enum OrderStatus {
  PENDING          // รอชำระเงิน
  PAID             // ชำระเงินแล้ว / รอคิวผลิต
  IN_PRODUCTION    // กำลังผลิต/สกรีนลาย
  SHIPPED          // จัดส่งแล้ว
  DELIVERED        // ได้รับสินค้าแล้ว (เริ่มนับถอยหลังประกันเคลมสินค้า)
  COMPLETED        // สำเร็จเรียบร้อย (พ้นระยะประกัน พร้อมตัดยอดเงินให้ Creator)
  CANCELLED        // ยกเลิกออเดอร์
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
}

model Order {
  id               String        @id @default(cuid())
  userId           String        @map("user_id")
  user             User          @relation(fields: [userId], references: [id])
  
  status           OrderStatus   @default(PENDING)
  paymentStatus    PaymentStatus @default(UNPAID) @map("payment_status")
  paymentMethod    String        @map("payment_method")     // Transfer, CreditCard, COD
  paymentProofUrl  String?       @map("payment_proof_url")  // สลิปโอนเงิน
  
  totalBasePrice   Int           @map("total_base_price")   // ยอดรวมราคาต้นทุน (เข้าบริษัท)
  totalMarkupPrice Int           @map("total_markup_price") // ยอดรวมที่บวกเพิ่ม (เตรียมจ่ายให้ Creator)
  shippingFee      Int           @map("shipping_fee")
  grandTotal       Int           @map("grand_total")        // ยอดรวมสุทธิที่ลูกค้าจ่ายจริง
  
  // ข้อมูลการจัดส่ง
  shippingName     String        @map("shipping_name")
  shippingAddress  String        @map("shipping_address")
  shippingPhone    String        @map("shipping_phone")
  trackingNumber   String?       @map("tracking_number")
  
  items            OrderItem[]
  claims           Claim[]
  
  paidAt           DateTime?     @map("paid_at")
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  @@map("orders")
}

model OrderItem {
  id              Int            @id @default(autoincrement())
  orderId         String         @map("order_id")
  order           Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productBaseId   Int            @map("product_base_id")
  productBase     ProductBase    @relation(fields: [productBaseId], references: [id])
  
  creatorDesignId String?        @map("creator_design_id")
  creatorDesign   CreatorDesign? @relation(fields: [creatorDesignId], references: [id])
  
  selectedColor   String         @map("selected_color")
  selectedSize    Size           @map("selected_size")
  priceAtOrder    Int            @map("price_at_order")     // บันทึกราคาต้นทุน ณ ตอนสั่งซื้อ (ป้องกันราคาเปลี่ยนภายหลัง)
  markupAtOrder   Int            @map("markup_at_order")    // บันทึกราคาบวกเพิ่ม ณ ตอนสั่งซื้อ
  quantity        Int
  
  claimItems      ClaimItem[]

  @@map("order_items")
}

// 6. ระบบเคลมสินค้าชำรุด (เนื่องจากไม่รับตีกลับทุกกรณี ยกเว้นชำรุด/ส่งผิด)
enum ClaimStatus {
  PENDING
  APPROVED
  REJECTED
}

model Claim {
  id           String      @id @default(cuid())
  orderId      String      @map("order_id")
  order        Order       @relation(fields: [orderId], references: [id])
  
  reason       String      // หัวข้อเคลม เช่น ลายสกรีนลอก, เสื้อขาด, ส่งผิดไซส์
  detail       String      // รายละเอียดเพิ่มเติม
  proofUrls    String[]    @map("proof_urls") // รูปภาพหรือวิดีโอหลักฐาน
  status       ClaimStatus @default(PENDING)
  adminComment String?     @map("admin_comment")
  
  items        ClaimItem[]
  createdAt    DateTime    @default(now()) @map("created_at")

  @@map("claims")
}

model ClaimItem {
  id          Int       @id @default(autoincrement())
  claimId     String    @map("claim_id")
  claim       Claim     @relation(fields: [claimId], references: [id], onDelete: Cascade)
  orderItemId Int       @map("order_item_id")
  orderItem   OrderItem @relation(fields: [orderItemId], references: [id])
  quantity    Int       // จำนวนชิ้นที่ต้องการเคลม

  @@map("claim_items")
}

// 7. ระบบตัดรอบรายได้และโอนเงินให้ Creator (โอนทุกสิ้นเดือน)
enum PayoutStatus {
  PENDING
  PAID
  FAILED
}

model Payout {
  id               String       @id @default(cuid())
  creatorId        String       @map("creator_id")
  creator          User         @relation(fields: [creatorId], references: [id])
  amount           Int          // ยอดสุทธิหลังจากคำนวณและหักภาษีแล้ว
  status           PayoutStatus @default(PENDING)
  transferSlipUrl  String?      @map("transfer_slip_url") // หลักฐานการโอนเงินจากแอดมิน
  
  payoutCycleStart DateTime     @map("payout_cycle_start") // วันเริ่มต้นรอบ เช่น 2026-06-01
  payoutCycleEnd   DateTime     @map("payout_cycle_end")   // วันสิ้นสุดรอบ เช่น 2026-06-30
  
  paidAt           DateTime?    @map("paid_at")
  createdAt        DateTime     @default(now()) @map("created_at")

  @@map("payouts")
}
```
