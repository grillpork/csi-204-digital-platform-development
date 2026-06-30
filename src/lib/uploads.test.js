import { saveImages } from "@/lib/uploads";
import { rename, rm, stat } from "fs/promises";
import path from "path";

const imagesDir = path.join(process.cwd(), "public/images");
// ย้าย public/images/ จริงไปพักไว้ชั่วคราว (ไม่ลบทิ้ง) เพื่อจำลอง "โฟลเดอร์ไม่มีอยู่"
// โดยไม่เสี่ยงทำลายรูปจริงของโปรเจกต์ระหว่างรันเทส
const backupDir = `${imagesDir}.bak-test`;

// 1x1 transparent PNG — ต้องเป็นรูปจริงเพราะ saveImages ใช้ sharp แปลงเป็น webp
const ONE_PX_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function fakeFile(name) {
  const buf = Buffer.from(ONE_PX_PNG_BASE64, "base64");
  return {
    name,
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
  };
}

describe("saveImages", () => {
  let savedPaths = [];

  beforeAll(async () => {
    await rm(backupDir, { recursive: true, force: true }); // เผื่อมี backup ค้างจากรันครั้งก่อนที่ crash
    await rename(imagesDir, backupDir).catch((err) => {
      if (err.code !== "ENOENT") throw err; // ไม่มีโฟลเดอร์อยู่แล้วก็โอเค ตรงกับเคสที่จะเทส
    });
  });

  afterAll(async () => {
    await rm(imagesDir, { recursive: true, force: true }); // ลบโฟลเดอร์ที่ saveImages สร้างขึ้นระหว่างเทส
    await rename(backupDir, imagesDir).catch((err) => {
      if (err.code !== "ENOENT") throw err; // ไม่มี backup (เพราะตอน beforeAll ก็ไม่มีโฟลเดอร์อยู่แล้ว) ก็โอเค
    });
  });

  it("saves files and returns /images/ paths even when public/images/ doesn't exist yet", async () => {
    savedPaths = await saveImages([fakeFile("test-upload.png")]);

    expect(savedPaths).toHaveLength(1);
    expect(savedPaths[0]).toMatch(/^\/images\//);
  });

  it("actually writes the file to disk at the returned path", async () => {
    const fullPath = path.join(process.cwd(), "public", savedPaths[0]);
    const stats = await stat(fullPath);
    expect(stats.isFile()).toBe(true);
  });
});
