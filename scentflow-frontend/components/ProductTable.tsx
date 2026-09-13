"use client";

import { Product } from "@/types";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
}

export default function ProductTable({ products, loading }: ProductTableProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Katalog &amp; Inventaris Aktif</h3>
        <span className="text-xs text-slate-400 font-medium">
          {products.length} Varian Terdaftar
        </span>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-8">Memuat katalog parfum...</p>
      ) : products.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">
          Tidak ada produk yang cocok dengan pencarian.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 px-2">Visual &amp; Nama</th>
                <th className="pb-3 px-2">Harga</th>
                <th className="pb-3 px-2">Stok Botol</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {products.map((p) => {
                const isCritical = p.stock <= 2;
                const isWarning = p.stock > 2 && p.stock <= 10;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.image_url ||
                            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200/60"
                        />
                        <div className="truncate max-w-[180px]">
                          <p className="font-bold text-slate-900 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {p.description || "Extrait de Parfum"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-semibold">
                      Rp {p.price.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`py-3 px-2 font-bold ${
                        isCritical ? "text-rose-600" : ""
                      }`}
                    >
                      {p.stock} Botol
                    </td>
                    <td className="py-3 px-2 text-right">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" /> Kritis
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
                          Sedikit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Aman
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}