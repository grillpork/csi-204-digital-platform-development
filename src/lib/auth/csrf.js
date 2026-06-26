// กัน CSRF เบื้องต้นสำหรับ route handler ที่ mutate: เทียบ Origin กับ Host
// ไม่มี Origin (เรียกจาก server/same-origin บางเคส) = ปล่อยผ่าน
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return new URL(origin).host === request.headers.get("host");
}