"use client";

import { ShoppingBag, Sparkles, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  onOpenCart: () => void;
}

export default function Navbar({ onOpenCart }: NavbarProps) {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 text-white p-2 rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tight text-slate-950">
              Scent<span className="text-amber-600 font-sans font-normal">Flow</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 -mt-1 font-semibold">
              Haute Parfumerie
            </span>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari wewangian, notes, atau seri koleksi..."
              className="w-full bg-slate-100/80 border border-slate-200/60 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Actions & Cart Trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>IDR — ID</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <User className="w-4 h-4" />
          </div>

          <button
            onClick={onOpenCart}
            className="relative bg-slate-950 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all shadow-sm active:scale-95 text-xs font-semibold uppercase tracking-wider"
            aria-label="Buka Keranjang"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-inner">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}