"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Sparkles, Search, User, Menu, X, Package, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayName = String(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Akun");

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link href="/" aria-label="ScentFlow beranda" className="flex items-center gap-3">
          <div className="bg-slate-950 text-white p-2 rounded-xl shadow-sm"><Sparkles className="w-5 h-5 text-amber-500" /></div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tight text-slate-950">Scent<span className="text-amber-600 font-sans font-normal">Flow</span></span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 -mt-1 font-semibold">Haute Parfumerie</span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari wewangian, notes, atau seri koleksi..." className="w-full bg-slate-100/80 border border-slate-200/60 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium"><span>IDR — ID</span></div>
          {loading ? (
            <span className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" aria-label="Memeriksa sesi" />
          ) : user ? (
            <Link href="/orders" className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 hover:bg-slate-50" aria-label={`Akun ${displayName}, buka pesanan`}>
              <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-amber-300"><User className="w-4 h-4" /></span>
              <span className="hidden sm:block max-w-28"><span className="block text-[10px] text-slate-400">Masuk sebagai</span><span className="block text-xs font-semibold text-slate-800 truncate">{displayName}</span></span>
            </Link>
          ) : (
            <Link href="/login" aria-label="Login" title="Masuk" className="w-10 h-10 rounded-full bg-slate-100 hover:bg-amber-100 flex items-center justify-center text-slate-700 transition-colors"><User className="w-4 h-4" /></Link>
          )}
          <button onClick={onOpenCart} className="relative bg-slate-950 hover:bg-slate-800 text-white px-3 sm:px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider" aria-label="Buka Keranjang">
            <ShoppingBag className="w-4 h-4 text-amber-400" /><span className="hidden sm:inline">Keranjang</span>
            <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
          </button>
          <button onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav aria-label="Menu utama" className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-7xl flex flex-col gap-1">
            <Link onClick={() => setMenuOpen(false)} href="/" className="rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50">Beranda & Katalog</Link>
            {user ? (
              <>
                <Link onClick={() => setMenuOpen(false)} href="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"><Package className="w-4 h-4" /> Pesanan Saya & Pengiriman</Link>
                {user.app_metadata?.role === "admin" && <Link onClick={() => setMenuOpen(false)} href="/admin/dashboard" className="rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50">Dashboard Admin</Link>}
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"><LogOut className="w-4 h-4" /> Keluar ({displayName})</button>
              </>
            ) : (
              <>
                <Link onClick={() => setMenuOpen(false)} href="/login" className="rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50">Login</Link>
                <Link onClick={() => setMenuOpen(false)} href="/register" className="rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50">Buat Akun</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}