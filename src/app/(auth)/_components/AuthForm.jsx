"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { name, email, password } : { email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Something went wrong");
      return;
    }

    await refresh();
    if (!localStorage.getItem("pagesViewed")) {
      localStorage.setItem("pagesViewed", "[]");
    }
    if (!localStorage.getItem("productsViewed")) {
      localStorage.setItem("productsViewed", "[]");
    }

    router.push("/");
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 overflow-hidden font-sans"
      style={{ backgroundImage: "url('/images/auth-bg.png')" }}
    >
  

      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-900/10 transition-all">
        {/* Top central icon box */}
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-md mb-6 mx-auto">
          {isRegister ? (
            <UserPlus className="w-5 h-5 text-slate-700" />
          ) : (
            <LogIn className="w-5 h-5 text-slate-700" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center tracking-tight">
          {isRegister ? "Create an account" : "Sign in with email"}
        </h1>
        
        <p className="text-xs text-slate-500 mb-8 text-center max-w-[280px] mx-auto leading-relaxed">
          {isRegister 
            ? "Sign up today to manage your data, workspace and projects in one place."
            : "Make a new doc to bring your words, data, and teams together. For free."
          }
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div className="relative">
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
            </div>
          )}

          <div className="relative">
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
          </div>

          <div className="relative">
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
          </div>

          {!isRegister && (
            <div className="flex justify-end -mt-1">
              <Link href="#" className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all mt-2 cursor-pointer shadow-lg shadow-slate-900/10"
          >
            {isRegister ? "Get Started" : "Get Started"}
          </button>
        </form>

        {/* Mode switcher link */}
        <p className="text-xs text-slate-500 text-center mt-8">
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
        </p>
      </div>
    </div>
  );
}