import { z } from "zod";

// keep these in sync with the Prisma `Size` / `Category` enums
export const Size = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);
export const Category = z.enum(["TSHIRT", "POLO", "HOODIE", "LONG_SLEEVE", "TANK_TOP"]);

export const productSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  description: z.string().trim().min(1, "description is required"),
  price: z.coerce.number().int().positive("price must be > 0"),
  category: Category,
  colors: z.array(z.string().trim().min(1)).min(1, "at least 1 color"),
  sizes: z.array(Size).min(1, "at least 1 size"),
  stock: z.coerce.number().int().nonnegative("stock must be >= 0"),
});

