import { POST } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/prisma";

const TEST_EMAIL = `test-register-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;

afterEach(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/auth/register", () => {
  it("creates a new user and returns it without the password", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: TEST_EMAIL,
        password: "mySecret123",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.user.email).toBe(TEST_EMAIL);
    expect(body.user.password).toBeUndefined();
  });

  it("rejects registration when the email already exists", async () => {
    await prisma.user.create({
      data: { name: "Existing User", email: TEST_EMAIL, password: "irrelevant" },
    });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: TEST_EMAIL,
        password: "mySecret123",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(409);
  });

  it("rejects registration when required fields are missing", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: TEST_EMAIL }), // ไม่ส่ง name กับ password มา
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
