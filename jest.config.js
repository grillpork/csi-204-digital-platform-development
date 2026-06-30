const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "node",
  // จำกัด worker เหลือ 1 — แต่ละไฟล์เทสสร้าง pg Pool ของตัวเอง (จาก src/lib/db/prisma.js)
  // เพราะ jest reset module cache ทุกไฟล์ ถ้ารัน parallel หลายไฟล์พร้อมกันจะยิง connection
  // ไปที่ Neon เกินจำนวนที่ pooler endpoint รับได้ ทำให้ test timeout แบบสุ่ม
  maxWorkers: 1,
};

module.exports = createJestConfig(config);