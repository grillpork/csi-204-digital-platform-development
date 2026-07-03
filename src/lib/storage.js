import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
const ext = { "image/png":"png", "image/jpeg":"jpg", "image/webp":"webp" };

function r2Config() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    throw new Error("ระบบจัดเก็บข้อมูล Cloudflare R2 ยังไม่ได้ตั้งค่าหรือข้อมูลไม่ครบถ้วน");
  }
  return { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL };
}

export function validateImage(file) {
  if (!file || !allowed.has(file.type)) throw new Error("รองรับเฉพาะ PNG, JPG และ WebP");
  if (file.size > 10 * 1024 * 1024) throw new Error("ไฟล์ต้องมีขนาดไม่เกิน 10MB");
}

export async function uploadImage(file, folder = "designs") {
  validateImage(file);
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext[file.type]}`;
  const body = Buffer.from(await file.arrayBuffer());
  const config = r2Config();
  
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY
    }
  });

  await client.send(new PutObjectCommand({
    Bucket: config.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: file.type,
    CacheControl: "public, max-age=31536000, immutable"
  }));

  return { key, url: `${config.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`, provider: "r2" };
}

export async function deleteImage(key) {
  if (!key || key.includes("..")) return;
  const config = r2Config();
  
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY
    }
  });

  await client.send(new DeleteObjectCommand({
    Bucket: config.R2_BUCKET_NAME,
    Key: key
  }));
}

export function storageKeyFromUrl(url) {
  if (!url) return null;
  if (url.startsWith("/uploads/")) return url.slice(9);
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  return base && url.startsWith(`${base}/`) ? url.slice(base.length + 1) : null;
}
