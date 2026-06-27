jest.mock("../../../lib/auth/dal", () => ({ requireUser: jest.fn() }));
jest.mock("../../../lib/uploads", () => ({ saveImages: jest.fn().mockResolvedValue(["/images/test.png"]) }));

import { POST } from "@/app/api/products/route";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { saveImages } from "@/lib/uploads";
import { HttpError } from "@/lib/http";

const TEST_EMAIL = `products-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

let testUserId;
const createdProductIds = [];

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { name: "Products Test Seller", email: TEST_EMAIL, password: "irrelevant" },
  });
  testUserId = user.id;
});

beforeEach(() => {
  requireUser.mockReset();
  requireUser.mockResolvedValue({ id: testUserId });
  saveImages.mockClear();
  saveImages.mockResolvedValue(["/images/test.png"]);
});

afterEach(async () => {
  if (createdProductIds.length > 0) {
    await prisma.product.deleteMany({ where: { id: { in: createdProductIds } } });
    createdProductIds.length = 0;
  }
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: testUserId } });
  await prisma.$disconnect();
});

function makeImageFile(name = "x.png") {
  return new File([Buffer.from([1, 2, 3])], name, { type: "image/png" });
}

function makeFormData(overrides = {}, { withImage = true } = {}) {
  const fields = {
    name: "Test Shirt",
    description: "A nice shirt",
    price: "100",
    category: "TSHIRT",
    colors: ["red"],
    sizes: ["M"],
    stock: "10",
    ...overrides,
  };

  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      for (const v of value) form.append(key, v);
    } else if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  }
  if (withImage) {
    form.append("images", makeImageFile());
  }
  return form;
}

function makeRequest(formData) {
  return new Request("http://localhost/api/products", {
    method: "POST",
    body: formData,
  });
}

describe("POST /api/products", () => {
  it("creates a product when logged in with a valid body and 1 image", async () => {
    const response = await POST(makeRequest(makeFormData()));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data).toMatchObject({
      name: "Test Shirt",
      description: "A nice shirt",
      price: 100,
      category: "TSHIRT",
      colors: ["red"],
      sizes: ["M"],
      stock: 10,
      sellerId: testUserId,
      images: ["/images/test.png"],
    });

    createdProductIds.push(body.data.id);

    const persisted = await prisma.product.findUnique({ where: { id: body.data.id } });
    expect(persisted).not.toBeNull();
    expect(persisted.sellerId).toBe(testUserId);
  });

  it("returns 401 when not logged in", async () => {
    requireUser.mockRejectedValueOnce(new HttpError(401, "Unauthorized"));

    const response = await POST(makeRequest(makeFormData()));
    expect(response.status).toBe(401);
  });

  it("returns 400 for an invalid body (price <= 0) even with a valid image", async () => {
    const response = await POST(makeRequest(makeFormData({ price: "0" })));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors).toBeTruthy();
  });

  it("returns 400 when no images are provided", async () => {
    const response = await POST(makeRequest(makeFormData({}, { withImage: false })));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors.images).toBeTruthy();
  });

  it("returns 400 when more than 5 images are provided", async () => {
    const form = makeFormData({}, { withImage: false });
    for (let i = 0; i < 6; i++) {
      form.append("images", makeImageFile(`img-${i}.png`));
    }

    const response = await POST(makeRequest(form));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.errors.images).toBeTruthy();
  });
});
