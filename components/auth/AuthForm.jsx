"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, EyeOff, Eye } from "lucide-react";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#dcedf9] to-[#f4f9fd] px-4 font-sans">
      
      {/* Background Decorative Rings (approximate from image) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] border-[1px] border-white rounded-full absolute"></div>
        <div className="w-[900px] h-[900px] border-[1px] border-white rounded-full absolute"></div>
        <div className="w-[1200px] h-[1200px] border-[1px] border-white rounded-full absolute"></div>
      </div>

      {/* Top Left Logo */}
      <div className="absolute top-6 left-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
        </div>
        <span className="font-bold text-lg text-gray-900 tracking-tight">The Shirty</span>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[32px] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white/60">
        
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
            <LogIn className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">
            {isRegister ? "สร้างบัญชีใหม่" : "เข้าสู่ระบบด้วยอีเมล"}
          </h1>
          <p className="text-[14px] text-gray-500 leading-relaxed px-2">
            ยินดีต้อนรับเข้าสู่ระบบ The Shirtsy ร้านค้าออนไลน์สำหรับคุณ
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          


          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="w-4.5 h-4.5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f7f7f9] border border-transparent rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock className="w-4.5 h-4.5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f7f7f9] border border-transparent rounded-xl pl-11 pr-11 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-300 focus:ring-0 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
            </button>
          </div>

          {!isRegister && (
            <div className="flex justify-end mt-[-4px] mb-2">
              <a href="#" className="text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors">
                ลืมรหัสผ่าน?
              </a>
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#1c1c1e] text-white rounded-xl py-3.5 text-[15px] font-medium hover:bg-black transition-colors shadow-md mt-1"
          >
            {isRegister ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center mt-8 mb-6">
          <div className="absolute border-t border-dashed border-gray-200 w-full"></div>
          <span className="bg-white px-4 text-[13px] text-gray-400 relative z-10">
            หรือ {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"} ด้วย
          </span>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button className="w-14 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            {/* Google Logo SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button className="w-14 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            {/* Facebook Logo SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>

        {/* Footer Toggle */}
        <p className="text-[13px] text-gray-500 text-center mt-6">
          {isRegister ? (
            <>
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" className="text-gray-900 font-medium hover:underline">
                เข้าสู่ระบบ
              </Link>
            </>
          ) : (
            <>
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-gray-900 font-medium hover:underline">
                สร้างบัญชี
              </Link>
            </>
          )}
        </p>

      </div>
    </div>
  );
}