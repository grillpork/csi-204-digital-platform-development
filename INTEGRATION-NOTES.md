# INTEGRATION NOTES — ฝั่ง Lalla (Product Management + Cart)

> สำหรับเพื่อนที่จะ merge งานเข้ากับ branch นี้ — อ่านก่อน merge
> Branch นี้ใช้ `src/` layout, cart ต่อ DB จริงแล้ว (ไม่ใช่ localStorage)

---

## สิ่งที่ branch นี้ทำเสร็จ (เป็น source of truth)
- **Product CRUD** — `POST/GET /api/products`, `GET/PATCH/DELETE /api/products/[id]`, `GET /api/seller/products` (ownership คุมด้วย `sellerId`)
- **Cart ต่อ DB** — `Cart`/`CartItem` ใน DB (ไม่ใช่ localStorage อีกแล้ว)
- หน้า `/seller/products` (จัดการสินค้า, table layout)
- Tests: jest ครบ (product CRUD + cart + auth) — `npx jest`

---

## Cart API contract (ใช้อันนี้)
```
POST   /api/cart            body { productId, quantity? }  → 201 { data: [ {id,name,price,image,quantity} ] }
                                                              400 { error:"Invalid productId" } | 401 ไม่ login
GET    /api/cart            → { data: [...] }   (ว่าง = [])
DELETE /api/cart            → ล้างตะกร้า { data: [] }
DELETE /api/cart/[productId]→ ลบชิ้นเดียว { data: [...] }
```
**ตะกร้าต้อง login** (DB-backed) — กดเพิ่มตอนไม่ login จะได้ 401

---

## ⚠️ Breaking changes — คนที่เอา UI Shop/custom มาต่อต้องแก้
1. **store actions เป็น async แล้ว** — `addToCart` / `removeFromCart` / `clearCart` ใน `src/store/product.js` ยิง API
   - `addToCart(product)` คืน `{ needLogin: true }` เมื่อ 401 → caller ต้อง `await` แล้ว redirect `/login` เอง
   - ดูตัวอย่างที่ wire ไว้แล้วใน `src/app/(shop)/page.jsx` (`handleAddToCart`)
2. **ตะกร้าเก็บได้แค่ Product จริงใน DB** (`CartItem.productId` → `Product`)
   - หน้า product ต้อง fetch `/api/products` / `/api/products/[id]` จริง แล้วส่ง `product.id` (เลข Int) เข้า `addToCart` — ห้ามส่ง mock id
   - **custom-print ("เสื้อสกรีนลายตามสั่ง") ต้องกลายเป็น Product จริงก่อน** ถึงจะ add ลงตะกร้าได้ (ตอนนี้ id `"custom-print"` → 400) — งานฝั่งออมสิน
3. **CartDrawer** รับ props `{ size, className }` แล้ว (NavbarA ส่ง props มาได้)

---

## Schema (prisma)
- Branch นี้ **เพิ่ม** `Product`, `Cart`, `CartItem`, enum `Size`/`Category` (+ `isSeller`/`shopName` บน User) — ตอน merge **เก็บไว้ทั้งหมด**
- `Media` model + enum-`Role` ของ `main` เป็น domain auth/profile — เรา**ไม่แตะ** ฝั่งนั้น reconcile กันเอง
- หลัง pull schema มา: **ต้อง `npx prisma generate` + restart dev server** (ไม่งั้น `prisma.cart` undefined → 500)
