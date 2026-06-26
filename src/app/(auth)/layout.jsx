// layout ฝั่ง auth: ฟอร์มกลางจอเปล่าๆ ไม่มี navbar/footer
export default function AuthLayout({ children }) {
  return <main className="flex-1">{children}</main>;
}