-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('TSHIRT', 'POLO', 'HOODIE', 'LONG_SLEEVE', 'TANK_TOP');
ALTER TABLE "products" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Size" ADD VALUE 'XS';

