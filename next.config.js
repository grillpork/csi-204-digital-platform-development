/** @type {import('next').NextConfig} */
const nextConfig = {
  // jose เป็น ESM-only — ให้ next/jest (และ Next) transpile เพื่อให้ jest รันผ่าน
  transpilePackages: ["jose"],
};

module.exports = nextConfig;
