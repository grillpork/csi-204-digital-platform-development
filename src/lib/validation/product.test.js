import { productSchema } from "@/lib/validation/product";

function validInput(overrides = {}) {
  return {
    name: "Test Shirt",
    description: "A nice shirt",
    price: 100,
    category: "TSHIRT",
    colors: ["red"],
    sizes: ["M"],
    stock: 10,
    ...overrides,
  };
}

describe("productSchema", () => {
  it("accepts a valid input", () => {
    const result = productSchema.safeParse(validInput());
    expect(result.success).toBe(true);
  });

  it("rejects price <= 0", () => {
    const result = productSchema.safeParse(validInput({ price: 0 }));
    expect(result.success).toBe(false);
  });

  it("rejects a negative price", () => {
    const result = productSchema.safeParse(validInput({ price: -5 }));
    expect(result.success).toBe(false);
  });

  it("rejects an empty sizes array", () => {
    const result = productSchema.safeParse(validInput({ sizes: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects an empty colors array", () => {
    const result = productSchema.safeParse(validInput({ colors: [] }));
    expect(result.success).toBe(false);
  });

  it("rejects an invalid category enum value", () => {
    const result = productSchema.safeParse(validInput({ category: "NOT_A_CATEGORY" }));
    expect(result.success).toBe(false);
  });

  it("rejects an invalid size enum value", () => {
    const result = productSchema.safeParse(validInput({ sizes: ["NOT_A_SIZE"] }));
    expect(result.success).toBe(false);
  });

  it("coerces numeric string price and stock into numbers", () => {
    const result = productSchema.safeParse(validInput({ price: "100", stock: "5" }));
    expect(result.success).toBe(true);
    expect(result.data.price).toBe(100);
    expect(result.data.stock).toBe(5);
  });

  it("rejects a non-integer price", () => {
    const result = productSchema.safeParse(validInput({ price: 1.5 }));
    expect(result.success).toBe(false);
  });

  it("rejects a negative stock", () => {
    const result = productSchema.safeParse(validInput({ stock: -1 }));
    expect(result.success).toBe(false);
  });

  it("rejects a missing name", () => {
    const { name, ...rest } = validInput();
    const result = productSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = productSchema.safeParse(validInput({ name: "" }));
    expect(result.success).toBe(false);
  });
});
