"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm border border-gray-200 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isRegister ? "Create an account" : "Welcome back"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-500"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors mt-2"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-black font-medium hover:underline">
                Login
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-black font-medium hover:underline">
                Register
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}