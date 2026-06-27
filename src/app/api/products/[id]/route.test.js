jest.mock("../../../../lib/auth/dal", () => ({ requireUser: jest.fn() }));
jest.mock("../../../../lib/uploads", () => ({ saveImages: jest.fn().mockResolvedValue(["/images/test.png"]) }));

import { GET, PATCH, DELETE } from "@/app/api/products/[id]/route";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/dal";
import { saveImages } from "@/lib/uploads";
import { HttpError } from "@/lib/http";

const OWNER_EMAIL = `product-id-owner-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
const OTHER_EMAIL = `product-id-other-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

let ownerId;
let otherId;
let productId;

beforeAll(async () => {
  const owner = await prisma.user.create({
    data: { name: "Owner", email: OWNER_EMAIL, password: "irrelevant" },
  });
  ownerId = owner.id;

  const other = await prisma.user.create({
    data: { name: "Other", email: OTHER_EMAIL, password: "irrelevant" },
  });
  otherId = other.id;
});

beforeEach(async () => {
  requireUser.mockReset();
  requireUser.mockResolvedValue({ id: ownerId });
  saveImages.mockClear();
  saveImages.mockResolvedValue(["/images/test.png"]);

  const product = await prisma.product.create({
    data: {
      name: "Owned Product",
      description: "Original description",
      price: 100,
      category: "TSHIRT",
      images: ["/images/original.png"],
      colors: ["red"],
      sizes: ["M"],
      stock: 10,
      sellerId: ownerId,
    },
  });
  productId = product.id;
});

afterEach(async () => {
  await prisma.product.deleteMany({ where: { id: productId } });
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: ownerId } });
  await prisma.user.delete({ where: { id: otherId } });
  await prisma.$disconnect();
});

function makePatchFormData(overrides = {}) {
  const fields = {
    name: "Updated Name",
    description: "Updated description",
    price: "200",
    category: "TSHIRT",
    colors: ["blue"],
    sizes: ["L"],
    stock: "20",
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
  return form;
}

function makePatchRequest(formData) {
  return new Request(`http://localhost/api/products/${productId}`, {
    method: "PATCH",
    body: formData,
  });
}

function makeDeleteRequest() {
  return new Request(`http://localhost/api/products/${productId}`, {
    method: "DELETE",
  });
}

describe("PATCH /api/products/[id]", () => {
  it("updates the product when called by its owner and persists the change", async () => {
    const response = await PATCH(makePatchRequest(makePatchFormData()), {
      params: { id: String(productId) },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({
      name: "Updated Name",
      description: "Updated description",
      price: 200,
      stock: 20,
    });

    const persisted = await prisma.product.findUnique({ where: { id: productId } });
    expect(persisted.name).toBe("Updated Name");
    expect(persisted.price).toBe(200);
  });

  it("returns 404 when a different (non-owner) user attempts the update", async () => {
    requireUser.mockResolvedValue({ id: otherId });

    const response = await PATCH(makePatchRequest(makePatchFormData()), {
      params: { id: String(productId) },
    });
    expect(response.status).toBe(404);

    const persisted = await prisma.product.findUnique({ where: { id: productId } });
    expect(persisted.name).toBe("Owned Product");
  });

  it("returns 401 when not logged in", async () => {
    requireUser.mockRejectedValueOnce(new HttpError(401, "Unauthorized"));

    const response = await PATCH(makePatchRequest(makePatchFormData()), {
      params: { id: String(productId) },
    });
    expect(response.status).toBe(401);
  });
});

describe("DELETE /api/products/[id]", () => {
  it("deletes the product when called by its owner", async () => {
    const response = await DELETE(makeDeleteRequest(), { params: { id: String(productId) } });
    expect(response.status).toBe(200);

    const persisted = await prisma.product.findUnique({ where: { id: productId } });
    expect(persisted).toBeNull();
  });

  it("returns 404 when a different (non-owner) user attempts the delete", async () => {
    requireUser.mockResolvedValue({ id: otherId });

    const response = await DELETE(makeDeleteRequest(), { params: { id: String(productId) } });
    expect(response.status).toBe(404);

    const persisted = await prisma.product.findUnique({ where: { id: productId } });
    expect(persisted).not.toBeNull();
  });

  it("returns 401 when not logged in", async () => {
    requireUser.mockRejectedValueOnce(new HttpError(401, "Unauthorized"));

    const response = await DELETE(makeDeleteRequest(), { params: { id: String(productId) } });
    expect(response.status).toBe(401);
  });
});
