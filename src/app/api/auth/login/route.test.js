import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";

const TEST_EMAIL = `test-login-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
const TEST_PASSWORD = "mySecret123";

beforeEach(async () => {
  await prisma.user.create({
    data: {
      name: "Test User",
      email: TEST_EMAIL,
      password: await hashPassword(TEST_PASSWORD),
    },
  });
});

afterEach(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials and returns the user with a session cookie", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user.email).toBe(TEST_EMAIL);
    expect(response.headers.get("Set-Cookie")).toContain("token=");
  });

  it("rejects login with the wrong password", async () => {
  const request = new Request("http://localhost/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: TEST_EMAIL, password: "wrongPassword" }),
  });

  const response = await POST(request);

  expect(response.status).toBe(401);
});


it("rejects login when the email does not exist", async () => {
  const request = new Request("http://localhost/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "nobody@example.com", password: "anything" }),
  });

  const response = await POST(request);

  expect(response.status).toBe(401);
});



});
