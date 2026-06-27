jest.mock("../../../../lib/auth/dal", () => ({ requireUser: jest.fn() }));

import { GET } from "@/app/api/seller/products/route";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

const USER_A_EMAIL = `seller-products-a-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
const USER_B_EMAIL = `seller-products-b-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

let userAId;
let userBId;
let productAId;
let productBId;

beforeAll(async () => {
  const userA = await prisma.user.create({
    data: { name: "Seller A", email: USER_A_EMAIL, password: "irrelevant" },
  });
  userAId = userA.id;

  const userB = await prisma.user.create({
    data: { name: "Seller B", email: USER_B_EMAIL, password: "irrelevant" },
  });
  userBId = userB.id;

  const productA = await prisma.product.create({
    data: {
      name: "Product A",
      description: "Owned by A",
      price: 100,
      category: "TSHIRT",
      images: [],
      colors: ["red"],
      sizes: ["M"],
      stock: 10,
      sellerId: userAId,
    },
  });
  productAId = productA.id;

  const productB = await prisma.product.create({
    data: {
      name: "Product B",
      description: "Owned by B",
      price: 150,
      category: "POLO",
      images: [],
      colors: ["blue"],
      sizes: ["L"],
      stock: 5,
      sellerId: userBId,
    },
  });
  productBId = productB.id;
});

beforeEach(() => {
  requireUser.mockReset();
  requireUser.mockResolvedValue({ id: userAId });
});

afterAll(async () => {
  await prisma.product.deleteMany({ where: { id: { in: [productAId, productBId] } } });
  await prisma.user.deleteMany({ where: { id: { in: [userAId, userBId] } } });
  await prisma.$disconnect();
});

describe("GET /api/seller/products", () => {
  it("returns only the logged-in user's products", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe(productAId);
    expect(body.data.find((p) => p.id === productBId)).toBeUndefined();
  });

  it("returns 401 when not logged in", async () => {
    requireUser.mockRejectedValueOnce(new HttpError(401, "Unauthorized"));

    const response = await GET();
    expect(response.status).toBe(401);
  });
});
