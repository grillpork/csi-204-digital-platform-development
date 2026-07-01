import { createHmac } from "node:crypto";
import { verifyOmiseWebhookSignature } from "./omise-webhook";

describe("verifyOmiseWebhookSignature", () => {
  const rawBody = JSON.stringify({ key: "charge.complete" });
  const timestampHeader = "1782871200";
  const now = Number(timestampHeader) * 1000;
  const secret = Buffer.from("test-webhook-secret").toString("base64");
  const signature = createHmac("sha256", Buffer.from(secret, "base64"))
    .update(`${timestampHeader}.${rawBody}`)
    .digest("hex");

  it("accepts a valid Omise signature", () => {
    expect(verifyOmiseWebhookSignature({ rawBody, timestampHeader, signatureHeader: signature, secret, now })).toBe(true);
  });

  it("accepts the matching signature during secret rotation", () => {
    expect(verifyOmiseWebhookSignature({ rawBody, timestampHeader, signatureHeader: `deadbeef,${signature}`, secret, now })).toBe(true);
  });

  it("rejects invalid or expired signatures", () => {
    expect(verifyOmiseWebhookSignature({ rawBody, timestampHeader, signatureHeader: "0".repeat(64), secret, now })).toBe(false);
    expect(verifyOmiseWebhookSignature({ rawBody, timestampHeader, signatureHeader: signature, secret, now: now + 301_000 })).toBe(false);
  });
});
