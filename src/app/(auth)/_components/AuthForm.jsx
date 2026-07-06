"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProductStore } from "@/store/product";
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        setError(data?.error ?? "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      await refresh();
      try {
        const syncCart = useProductStore.getState().syncCart;
        if (syncCart) await syncCart();
      } catch (syncErr) {
        console.error("Cart sync error during login:", syncErr);
      }
      if (!localStorage.getItem("pagesViewed")) {
        localStorage.setItem("pagesViewed", "[]");
      }
      if (!localStorage.getItem("productsViewed")) {
        localStorage.setItem("productsViewed", "[]");
      }

      router.push("/");
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 overflow-hidden font-sans"
      style={{ backgroundImage: "url('/images/auth-bg.png')" }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-900/10 transition-all"
      >
        {/* Top central icon box */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-md mb-6 mx-auto"
        >
          {isRegister ? (
            <UserPlus className="w-5 h-5 text-slate-700" />
          ) : (
            <LogIn className="w-5 h-5 text-slate-700" />
          )}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-2xl font-bold text-slate-800 mb-2 text-center tracking-tight"
        >
          {isRegister ? "Create an account" : "Sign in with email"}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xs text-slate-500 mb-8 text-center max-w-[280px] mx-auto leading-relaxed"
        >
          {isRegister 
            ? "Sign up today to manage your data, workspace and projects in one place."
            : "Make a new doc to bring your words, data, and teams together. For free."
          }
        </motion.p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="relative"
            >
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </motion.div>

          {!isRegister && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex justify-end -mt-1"
            >
              <Link href="#" className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium">
                Forgot password?
              </Link>
            </motion.div>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all mt-2 cursor-pointer shadow-lg shadow-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "กำลังดำเนินการ..." : isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </motion.button>
        </form>

        {/* Mode switcher link */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.3 }}
          className="text-xs text-slate-500 text-center mt-8"
        >
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-slate-800 font-semibold hover:underline">
                Login
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-slate-800 font-semibold hover:underline">
                Register
              </Link>
            </>
          )}
        </motion.p>
      </motion.div>
    </div>
  );
}
