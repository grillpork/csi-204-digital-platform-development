jest.mock("../../../../lib/auth/dal", () => ({ requireUser: jest.fn() }));

import { DELETE } from "@/app/api/cart/[productId]/route";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";

const TEST_EMAIL = `cart-item-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

let testUserId;
let testProductId;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Cart Item Test User", email: TEST_EMAIL, password: "irrelevant" },
  });
  testUserId = user.id;

  const product = await prisma.product.create({
    data: {
      name: "Cart Item Test Product",
      description: "Test product for cart [productId] route tests",
      price: 100,
      category: "TSHIRT",
      images: [],
      colors: [],
      sizes: [],
      stock: 10,
      sellerId: testUserId,
    },
  });
  testProductId = product.id;
});

beforeEach(() => {
  requireUser.mockReset();
  requireUser.mockResolvedValue({ id: testUserId });
});

afterEach(async () => {
  const cart = await prisma.cart.findUnique({ where: { userId: testUserId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });
  }
});

afterAll(async () => {
  const cart = await prisma.cart.findUnique({ where: { userId: testUserId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });
  }
  await prisma.product.delete({ where: { id: testProductId } });
  await prisma.user.delete({ where: { id: testUserId } });
  await prisma.$disconnect();
});

describe("DELETE /api/cart/[productId]", () => {
  it("removes the product from the cart", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });
    await prisma.cartItem.create({ data: { cartId: cart.id, productId: testProductId, quantity: 1 } });

    const request = new Request(`http://localhost/api/cart/${testProductId}`, { method: "DELETE" });
    const response = await DELETE(request, { params: { productId: String(testProductId) } });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.data.find((i) => i.id === testProductId)).toBeUndefined();
  });
});
