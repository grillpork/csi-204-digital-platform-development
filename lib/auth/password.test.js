import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("hashPassword", () => {
  it("returns a string different from the plain password", async () => {
    const hash = await hashPassword("mySecret123");
    expect(hash).not.toBe("mySecret123");
    expect(typeof hash).toBe("string");
  });

  it("produces a different hash each time (salted)", async () => {
    const hashA = await hashPassword("mySecret123");
    const hashB = await hashPassword("mySecret123");
    expect(hashA).not.toBe(hashB);
  });
});

describe("verifyPassword", () => {
  it("returns true for the correct password", async () => {
    const hash = await hashPassword("mySecret123");
    expect(await verifyPassword("mySecret123", hash)) .toBe(true);
  });

  it("returns false for the wrong password", async () => {
    const hash = await hashPassword("mySecret123");
    expect(await verifyPassword("wrongPassword", hash)).toBe(false);
  });
 });
