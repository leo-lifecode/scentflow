"use client";

import { Plus, Sparkles, Package, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  stock: string;
  setStock: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProductForm({
  name,
  setName,
  price,
  setPrice,
  stock,
  setStock,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  isSubmitting,
  onSubmit,
}: ProductFormProps) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#c5a059] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Formulir Kurasi Varian</h3>
        </div>
        <Sparkles className="w-4 h-4 text-[#c5a059]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Nama Parfum
          </label>
          <input
            type="text"
            required
            placeholder="cth. ScentFlow Santal Mystère (50ml)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Harga (IDR)
            </label>
            <input
              type="number"
              required
              placeholder="550000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Jumlah Stok Botol
            </label>
            <input
              type="number"
              required
              placeholder="25"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            URL Gambar Flacon (Opsional)
          </label>
          <div className="relative">
            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Deskripsi Formula Olfaktori
          </label>
          <textarea
            rows={3}
            placeholder="Deskripsikan top notes, heart notes, dan base notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#121316] transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#121316] hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4 text-amber-400" />
          {isSubmitting ? "Menyimpan Produk..." : "Simpan Produk ke Katalog"}
        </button>
      </form>
    </div>
  );
}