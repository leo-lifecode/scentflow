"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Package,
  LogOut,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayName = String(
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Akun",
  );

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
    } finally {
      window.location.href = "/";
    }
  }

  function openCartFromMenu() {
    setMenuOpen(false);
    onOpenCart();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="ScentFlow beranda" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <img src="/logo-parfum.svg" alt="" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-950">
              Scent<span className="font-sans font-normal text-amber-600">Flow</span>
            </span>
            <span className="-mt-1 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Haute Parfumerie
            </span>
          </div>
        </Link>

        <div className="hidden max-w-md flex-1 px-5 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Cari parfum favorit..."
              aria-label="Cari parfum"
              className="w-full rounded-full border border-slate-200 bg-slate-100/80 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-xs font-medium text-slate-500 sm:block">IDR · ID</span>
          {loading ? (
            <span className="h-10 w-10 animate-pulse rounded-full bg-slate-100" aria-label="Memeriksa sesi" />
          ) : user ? (
            <Link
              href="/orders"
              aria-label={`Akun ${displayName}, buka pesanan`}
              className="flex max-w-40 items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 transition hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-amber-300">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block text-[10px] text-slate-400">Masuk sebagai</span>
                <span className="block truncate text-xs font-semibold text-slate-800">{displayName}</span>
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              title="Masuk"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-amber-100"
            >
              <User className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800 sm:px-4"
            aria-label={`Buka keranjang, ${totalItems} item`}
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-extrabold text-slate-950">
              {totalItems}
            </span>
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:bg-slate-50"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            aria-label="Tutup menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-slate-950/10 backdrop-blur-[1px]"
          />
          <nav
            aria-label="Menu utama"
            className="absolute right-3 top-[calc(100%+10px)] z-50 w-[min(21rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/15 sm:right-6 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-2 pb-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Menu ScentFlow</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Akses cepat ke toko dan akun</p>
              </div>
              <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-1">
              <Link
                onClick={() => setMenuOpen(false)}
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span className="flex-1">Beranda & katalog</span>
              </Link>
              <button
                onClick={openCartFromMenu}
                className="flex w-full items-center gap-3 rounded-xl bg-slate-950 px-3 py-3 text-left text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <ShoppingCart className="h-4 w-4 text-amber-400" />
                <span className="flex-1">Keranjang belanja</span>
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-slate-950">
                  {totalItems}
                </span>
              </button>
              {user ? (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/orders"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Package className="h-4 w-4 text-slate-500" />
                    <span className="flex-1">Pesanan & pengiriman</span>
                  </Link>
                  {user.app_metadata?.role === "admin" && (
                    <Link
                      onClick={() => setMenuOpen(false)}
                      href="/admin/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      Dashboard admin
                    </Link>
                  )}
                  <div className="mx-2 my-2 border-t border-slate-100" />
                  <div className="px-3 py-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Sedang masuk sebagai
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar dari akun
                  </button>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setMenuOpen(false)}
                    href="/login"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
