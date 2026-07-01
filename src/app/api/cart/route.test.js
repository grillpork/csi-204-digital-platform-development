jest.mock("../../../lib/auth/dal", () => ({ requireUser: jest.fn() }));

import { GET, POST, DELETE } from "@/app/api/cart/route";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { HttpError } from "@/lib/http";

const TEST_EMAIL = `cart-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

let testUserId;
let testProductId;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Cart Test User", email: TEST_EMAIL, password: "irrelevant" },
  });
  testUserId = user.id;

  const product = await prisma.product.create({
    data: {
      name: "Cart Test Product",
      description: "Test product for cart route tests",
      price: 100,
      category: "TSHIRT",
      images: [],
      colors: [],
      sizes: [],
      stock: 10,
      sellerId: testUserId,
      is_public: true,
      approvalStatus: "APPROVED",
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

function makeRequest(body) {
  return new Request("http://localhost/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/cart", () => {
  it("adds a product to the cart", async () => {
    const response = await POST(makeRequest({ productId: testProductId }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toMatchObject({ id: testProductId, quantity: 1 });
  });

  it("increments quantity when the same product is added again", async () => {
    await POST(makeRequest({ productId: testProductId }));
    const response = await POST(makeRequest({ productId: testProductId }));
    const body = await response.json();

    const item = body.data.find((i) => i.id === testProductId);
    expect(item.quantity).toBe(2);
  });

  it("rejects a non-existent productId with 400", async () => {
    const response = await POST(makeRequest({ productId: 99999999 }));
    expect(response.status).toBe(400);
  });

  it("rejects a non-numeric productId with 400", async () => {
    const response = await POST(makeRequest({ productId: "abc" }));
    expect(response.status).toBe(400);
  });

  it("returns 401 when requireUser rejects", async () => {
    requireUser.mockRejectedValueOnce(new HttpError(401, "Unauthorized"));
    const response = await POST(makeRequest({ productId: testProductId }));
    expect(response.status).toBe(401);
  });
});

describe("GET /api/cart", () => {
  it("returns the shaped cart item after adding a product", async () => {
    await POST(makeRequest({ productId: testProductId }));

    const response = await GET(new Request("http://localhost/api/cart"));
    const body = await response.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0]).toEqual({
      id: testProductId,
      name: "Cart Test Product",
      price: 100,
      image: null,
      quantity: 1,
    });
  });
});

describe("DELETE /api/cart", () => {
  it("clears the cart", async () => {
    await POST(makeRequest({ productId: testProductId }));

    const deleteResponse = await DELETE(new Request("http://localhost/api/cart", { method: "DELETE" }));
    const deleteBody = await deleteResponse.json();
    expect(deleteBody.data).toEqual([]);

    const getResponse = await GET(new Request("http://localhost/api/cart"));
    const getBody = await getResponse.json();
    expect(getBody.data).toEqual([]);
  });
});
