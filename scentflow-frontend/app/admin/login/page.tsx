"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Kredensial Admin Sederhana (Dapat disesuaikan dengan Supabase Auth nantinya)
    if (email === "admin@scentflow.com" && password === "admin123") {
      // Simpan cookie admin token selama 1 hari
      document.cookie = "admin_token=scentflow_authenticated_session; path=/; max-age=86400";
      router.push("/admin/dashboard");
    } else {
      setError("Email atau kata sandi admin tidak valid.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
      <header className="flex justify-between items-center">
        <a href="/" className="text-slate-400 hover:text-white text-xs flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Toko
        </a>
      </header>

      <main className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 border border-slate-700">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">ScentFlow Admin</h1>
          <p className="text-slate-400 text-xs mt-1">Masuk untuk mengelola inventaris &amp; transaksi</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 text-xs p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Email Admin
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scentflow.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-lg text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk Console"}
          </button>
        </form>
      </main>

      <footer className="text-center text-[11px] text-slate-600">
        © 2026 ScentFlow Management Console
      </footer>
    </div>
  );
}