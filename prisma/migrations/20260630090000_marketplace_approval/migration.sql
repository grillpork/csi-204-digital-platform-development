CREATE TYPE "ApprovalStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "products"
  ADD COLUMN "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "submitted_at" TIMESTAMP(3),
  ADD COLUMN "reviewed_at" TIMESTAMP(3),
  ADD COLUMN "reviewed_by_id" TEXT,
  ADD COLUMN "rejection_reason" TEXT;

UPDATE "products" SET "approval_status" = 'APPROVED' WHERE "is_public" = true;

DELETE FROM "cart_items" a USING "cart_items" b WHERE a.id > b.id AND a."cartId" = b."cartId" AND a."productId" = b."productId";
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shippings" ADD CONSTRAINT "shippings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
