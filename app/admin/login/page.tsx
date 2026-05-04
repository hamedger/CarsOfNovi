"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.message || "Incorrect password.");
        setPassword("");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0EA5E9]/8 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 rounded-2xl items-center justify-center mb-4">
            <Lock size={22} className="text-[#0EA5E9]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-widest">C.A.R.S.</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-8">
          <h2 className="text-white font-semibold text-lg mb-1">Sign In</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  required
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3.5 pr-11 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
              >
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : "Sign In"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          C.A.R.S. — Complete Auto Repair Specialist
        </p>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
