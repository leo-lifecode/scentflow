"use client";

import { useState } from "react";
import { Plus, Sparkles, Package, Image as ImageIcon, Upload, X } from "lucide-react";

interface ProductFormProps {
  name: string; setName: (val: string) => void;
  price: string; setPrice: (val: string) => void;
  stock: string; setStock: (val: string) => void;
  description: string; setDescription: (val: string) => void;
  imageUrl: string; setImageUrl: (val: string) => void;
  imageFile: File | null; setImageFile: (file: File | null) => void;
  isSubmitting: boolean; onSubmit: (e: React.FormEvent) => void;
}

export default function ProductForm({ name, setName, price, setPrice, stock, setStock, description, setDescription, imageUrl, setImageUrl, imageFile, setImageFile, isSubmitting, onSubmit }: ProductFormProps) {
  const [preview, setPreview] = useState("");
  function selectImage(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) { alert("Pilih gambar JPG atau PNG."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Ukuran gambar maksimal 5 MB."); return; }
    setImageFile(file);
    setImageUrl("");
    setPreview(URL.createObjectURL(file));
  }
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-amber-100 text-[#c5a059] flex items-center justify-center"><Plus className="w-4 h-4" /></div><h3 className="text-base font-bold text-slate-900">Tambah Produk</h3></div>
        <Sparkles className="w-4 h-4 text-[#c5a059]" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div><label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Parfum</label><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama parfum" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Harga (IDR)</label><input type="number" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="550000" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs" /></div>
          <div><label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Stok</label><input type="number" min="0" required value={stock} onChange={(e) => setStock(e.target.value)} placeholder="25" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs" /></div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Foto Produk (JPG/PNG, maks. 5 MB)</label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 hover:border-amber-500">
            <Upload className="h-5 w-5 text-amber-600" /><span className="text-xs text-slate-600">{imageFile ? imageFile.name : "Klik untuk memilih gambar JPG atau PNG"}</span>
            <input className="hidden" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={(e) => selectImage(e.target.files?.[0])} />
          </label>
          {preview && <div className="relative mt-3 w-32"><img src={preview} alt="Pratinjau produk" className="h-32 w-32 rounded-xl object-cover" /><button type="button" onClick={() => { setImageFile(null); setPreview(""); }} className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow" aria-label="Hapus foto"><X className="h-4 w-4" /></button></div>}
          <details className="mt-3"><summary className="cursor-pointer text-xs text-slate-500">Atau masukkan URL gambar</summary><div className="relative mt-2"><ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="url" placeholder="https://..." value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) { setImageFile(null); setPreview(""); } }} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 text-xs" /></div></details>
        </div>
        <div><label className="mb-1 block text-xs font-semibold text-slate-600 uppercase tracking-wider">Deskripsi Produk</label><textarea rows={3} placeholder="Deskripsikan parfum..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs" /></div>
        <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#121316] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-slate-800 disabled:opacity-50"><Package className="h-4 w-4 text-amber-400" />{isSubmitting ? "Menyimpan Produk..." : "Simpan Produk"}</button>
      </form>
    </div>
  );
}