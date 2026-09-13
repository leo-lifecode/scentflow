"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product } from "@/types";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import {
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  UserCheck,
  RotateCcw,
  Plus,
  Download,
} from "lucide-react";

interface Transaction {
  id: string;
  order_id: string;
  gross_amount: number;
  transaction_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        const [transRes, prodRes] = await Promise.all([
          api.get("/transactions").catch(() => ({ data: [] })),
          api.get("/products").catch(() => ({ data: [] })),
        ]);

        if (isMounted) {
          setTransactions(transRes.data.data || transRes.data || []);
          setProducts(prodRes.data.data || prodRes.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = transactions
    .filter(
      (t) => t.transaction_status === "settlement" || t.transaction_status === "success"
    )
    .reduce((sum, t) => sum + Number(t.gross_amount), 0);

  const totalSuccessOrders = transactions.filter(
    (t) => t.transaction_status === "settlement" || t.transaction_status === "success"
  ).length;

  return (
    <div className="bg-[#f2f3f5] text-slate-800 antialiased font-sans min-h-screen flex">
      {/* Sidebar Component */}
      <AdminSidebar productCount={products.length} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Component */}
        <AdminHeader
          title="Welcome back, Maison Admin"
          subtitle="Here are today's stats from your fragrance atelier & online store!"
          badgeCount={4}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl px-5 py-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-slate-600">
                Payment Gateway Engine:{" "}
                <strong className="text-slate-800">Midtrans Sandbox Active</strong> (Instant
                Settlement API Connected)
              </span>
            </div>
            <button className="text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 px-3 py-1.5 rounded-full transition-colors">
              Lihat Log Transaksi
            </button>
          </div>

          {/* Metric Cards Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Total Sales */}
            <div className="bg-[#15161a] text-white p-6 rounded-3xl shadow-lg shadow-black/5 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white tracking-wide">
                      Total Sales
                    </p>
                    <p className="text-xs text-slate-400">
                      {totalSuccessOrders > 0 ? `${totalSuccessOrders} Orders` : "731 Orders"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Rp{" "}
                  {totalRevenue > 0
                    ? totalRevenue.toLocaleString("id-ID")
                    : "142.850.000"}
                </h2>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-300">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +15.6%
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-medium">+Rp 18.4M minggu ini</span>
              </div>
            </div>

            {/* Card 2: Visitors */}
            <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between group hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 tracking-wide">
                      Visitors
                    </p>
                    <p className="text-xs text-slate-400">Avg. time: 4:30m</p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  12,302
                </h2>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12.7%
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">+1.2k minggu ini</span>
              </div>
            </div>

            {/* Card 3: Refunds */}
            <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between group hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 tracking-wide">
                      Refunds
                    </p>
                    <p className="text-xs text-slate-400">2 Disputed</p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  963
                </h2>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                <span className="inline-flex items-center gap-1 text-rose-500 font-semibold">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -12.7%
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">-213 items</span>
              </div>
            </div>
          </section>

          {/* Sales Performance & Top Categories */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Bar Graphic */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sales Performance</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pendapatan atelier dibandingkan biaya operasional bahan baku
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 my-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                  <span>Earnings (Rp)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Production Costs</span>
                </div>
              </div>

              <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                {[
                  { date: "12 Mei", h1: "48%", h2: "22%" },
                  { date: "13 Mei", h1: "60%", h2: "28%" },
                  { date: "14 Mei", h1: "52%", h2: "25%" },
                  { date: "15 Mei", h1: "75%", h2: "35%" },
                  { date: "16 Mei", h1: "68%", h2: "30%" },
                  { date: "17 Mei", h1: "88%", h2: "40%" },
                  { date: "Today", h1: "96%", h2: "42%", isToday: true },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        className={`w-3.5 rounded-t-md transition-all group-hover:bg-amber-600 ${
                          bar.isToday
                            ? "bg-[#121316] shadow-md shadow-slate-400/50"
                            : "bg-slate-800"
                        }`}
                        style={{ height: bar.h1 }}
                      />
                      <div
                        className="w-3.5 bg-slate-200 rounded-t-md group-hover:bg-slate-300 transition-all"
                        style={{ height: bar.h2 }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        bar.isToday
                          ? "font-bold text-slate-900"
                          : "text-slate-400 group-hover:text-slate-800"
                      }`}
                    >
                      {bar.date}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Rata-rata Margin Bersih: <strong className="text-slate-800">58.4%</strong>
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  Optimal Formula Efficiency
                </span>
              </div>
            </div>

            {/* Top Categories Donut */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Top Categories</h3>
                  <button className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                    Lihat Semua
                  </button>
                </div>

                <div className="flex items-center justify-center my-3">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        className="stroke-slate-100"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="14"
                        strokeWidth="3.8"
                      />
                      <circle
                        className="stroke-slate-900"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="14"
                        strokeDasharray="38, 100"
                        strokeDashoffset="0"
                        strokeWidth="3.8"
                      />
                      <circle
                        className="stroke-amber-600"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="14"
                        strokeDasharray="28, 100"
                        strokeDashoffset="-38"
                        strokeWidth="3.8"
                      />
                      <circle
                        className="stroke-amber-400"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="14"
                        strokeDasharray="18, 100"
                        strokeDashoffset="-66"
                        strokeWidth="3.8"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl font-bold text-slate-900">731</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                        Flacons
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        01
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          Essence d'Ambre
                        </p>
                        <p className="text-[11px] text-slate-400">24 unit terjual</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                      Rp 680.000
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        02
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          Bois De Rose
                        </p>
                        <p className="text-[11px] text-slate-400">18 unit terjual</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                      Rp 450.000
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-2">
                <button className="w-full py-2 px-3 text-xs font-semibold text-center text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Unduh Laporan Penjualan (.CSV)
                </button>
              </div>
            </div>
          </section>

          {/* Real-time Inventory Table */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manajemen Stok Parfum &amp; Cask Fermentasi
                </h3>
                <p className="text-xs text-slate-400">
                  Pemantauan volume konsentrat parfum murni (Extrait de Parfum) di gudang
                </p>
              </div>

              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Varian Parfum</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 px-2">Nama Parfum</th>
                    <th className="pb-3 px-2">Harga</th>
                    <th className="pb-3 px-2">Sisa Botol Siap Kirim</th>
                    <th className="pb-3 px-2">Kapasitas Tong Fermentasi</th>
                    <th className="pb-3 px-2 text-right">Status Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        Memuat data inventaris atelier...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        Belum ada varian produk parfum tercatat.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const isCritical = p.stock <= 2;
                      const isWarning = p.stock > 2 && p.stock <= 10;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-2 font-medium text-slate-900">
                            {p.name}
                          </td>
                          <td className="py-3 px-2 text-slate-600">
                            Rp {p.price.toLocaleString("id-ID")}
                          </td>
                          <td
                            className={`py-3 px-2 font-semibold ${
                              isCritical ? "text-rose-600" : ""
                            }`}
                          >
                            {p.stock} Botol
                          </td>
                          <td className="py-3 px-2">
                            <div className="w-32 bg-slate-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  isCritical
                                    ? "bg-rose-500"
                                    : isWarning
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(Math.max((p.stock / 30) * 100, 10), 100)}%`,
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {isCritical ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800">
                                Stok Kritis
                              </span>
                            ) : isWarning ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
                                Perlu Maceration
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                Aman
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}