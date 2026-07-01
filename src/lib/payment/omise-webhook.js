import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_TIMESTAMP_AGE_SECONDS = 5 * 60;

export function verifyOmiseWebhookSignature({ rawBody, signatureHeader, timestampHeader, secret, now = Date.now() }) {
  if (!secret || !signatureHeader || !timestampHeader) return false;

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Math.floor(now / 1000) - timestamp) > MAX_TIMESTAMP_AGE_SECONDS) return false;

  let secretBuffer;
  try {
    secretBuffer = Buffer.from(secret, "base64");
  } catch {
    return false;
  }
  if (!secretBuffer.length) return false;

  const expected = createHmac("sha256", secretBuffer)
    .update(`${timestampHeader}.${rawBody}`)
    .digest();

  return signatureHeader.split(",").some((signature) => {
    const normalized = signature.trim();
    if (!/^[a-f0-9]{64}$/i.test(normalized)) return false;
    const actual = Buffer.from(normalized, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
}

export async function retrieveOmiseCharge(chargeId, secretKey = process.env.OMISE_SECRET_KEY) {
  if (!secretKey) throw new Error("OMISE_SECRET_KEY is not configured");
  if (!/^chrg_[a-zA-Z0-9]+$/.test(chargeId)) throw new Error("Invalid charge ID");

  const response = await fetch(`https://api.omise.co/charges/${encodeURIComponent(chargeId)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}` },
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Unable to verify Omise charge");
  return result;
}
