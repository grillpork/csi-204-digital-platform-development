import { describe, it, expect } from "vitest";
import { SignJWT } from "jose";
import { signToken, verifyToken } from "@/lib/auth/jwt";

describe("signToken / verifyToken", () => {
  it("returns the original payload after signing and verifying", async () => {
    const token = await signToken({ userId: "abc123", role: "customer" });
    const payload = await verifyToken(token);

    expect(payload.userId).toBe("abc123");
    expect(payload.role).toBe("customer");
  });
});
it("returns null for a tampered token", async () => {
  const token = await signToken({ userId: "abc123" });
  const tampered = token.slice(0, -1) + (token.endsWith("a") ? "b" : "a");

  expect(await verifyToken(tampered)).toBeNull();
});
it("returns null for an expired token", async () => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const expiredToken = await new SignJWT({ userId: "abc123" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) - 10) // หมดอายุไปแล้ว 10 วินาที
    .sign(secret);

  expect(await verifyToken(expiredToken)).toBeNull();
});