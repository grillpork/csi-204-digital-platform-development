DO $$ BEGIN
  CREATE TYPE "ApprovalStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMP(3);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMP(3);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "reviewed_by_id" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "rejection_reason" TEXT;
UPDATE "products" SET "approval_status" = 'APPROVED' WHERE "is_public" = true AND "approval_status" = 'DRAFT';

ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PENDING_PAYMENT';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_EXPIRED';
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "qr_code_url" TEXT;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP(3);
