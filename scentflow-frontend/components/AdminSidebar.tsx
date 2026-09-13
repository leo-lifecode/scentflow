"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  FileText,
  Users,
  ArrowLeft,
  LogOut,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface AdminSidebarProps {
  productCount?: number;
}

export default function AdminSidebar({ productCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const isOverviewActive = pathname === "/admin/dashboard";
  const isProductsActive = pathname === "/admin/products";

  return (
    <aside className="w-64 bg-[#121316] text-slate-300 flex-shrink-0 flex flex-col justify-between select-none min-h-screen border-r border-slate-800/80">
      <div>
        {/* ScentFlow Brand Logo Header */}
        <div className="h-20 px-6 flex items-center border-b border-slate-800/60 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c5a059] to-amber-200 text-[#0a0b0d] flex items-center justify-center font-serif font-bold text-lg shadow-md shadow-amber-900/30">
            SF
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-widest text-white text-base font-semibold leading-tight uppercase">
              ScentFlow
            </span>
            <span className="text-[10px] tracking-wider text-amber-300/70 uppercase">
              Haute Parfumerie
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="mt-6 px-3 space-y-1.5">
          {/* Overview Group */}
          <div className="space-y-1">
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center justify-between px-3 py-2 font-medium text-sm rounded-xl transition-colors ${
                isOverviewActive
                  ? "text-slate-100 bg-slate-800/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid
                  className={`w-4 h-4 ${
                    isOverviewActive ? "text-[#c5a059]" : "text-slate-400"
                  }`}
                />
                <span>Overview</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </Link>

            {isOverviewActive && (
              <div className="pl-4 pr-1 space-y-1 mt-1">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 px-3 py-2 bg-[#1c1d22] text-white text-xs font-medium rounded-xl shadow-inner border border-slate-700/50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Summary</span>
                </Link>
              </div>
            )}
          </div>

          {/* Products */}
          <Link
            href="/admin/products"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
              isProductsActive
                ? "text-white font-medium bg-slate-800/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag
                className={`w-4 h-4 ${
                  isProductsActive ? "text-[#c5a059]" : "text-slate-400"
                }`}
              />
              <span>Products</span>
            </div>
            {productCount !== undefined && (
              <span className="w-5 h-5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center justify-center">
                {productCount}
              </span>
            )}
          </Link>

          {/* Orders */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl text-sm transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Orders</span>
          </Link>

          {/* Customers */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl text-sm transition-colors"
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Customers</span>
          </Link>
        </nav>
      </div>

      {/* Sidebar Footer Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-slate-800/40 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-amber-300/90 hover:text-amber-200 hover:bg-slate-800/40 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Toko Utama</span>
        </Link>
      </div>
    </aside>
  );
}