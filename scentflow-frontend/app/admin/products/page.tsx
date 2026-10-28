"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { ImagePlus, Pencil, Plus, Search, Trash2, X, PackageCheck, PackageX } from "lucide-react";

interface ProductFormState {
  name: string;
  variant: string;
  size: string;
  price: string;
  stock: string;
  description: string;
  image_url: string;
}
const emptyForm: ProductFormState = { name: "", variant: "", size: "", price: "", stock: "0", description: "", image_url: "" };
interface ApiErrorResponse { response?: { data?: { message?: string } } }
const money = (value: number) => `Rp ${Number(value).toLocaleString("id-ID")}`;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Gagal membaca gambar."));
    reader.onerror = () => reject(new Error("Gagal membaca gambar."));
    reader.readAsDataURL(file);
  });
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    api.get("/products")
      .then((response) => { if (active) setProducts(response.data.data || response.data || []); })
      .catch(() => { if (active) setError("Katalog gagal dimuat. Periksa koneksi backend."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey]);

  const setField = (key: keyof ProductFormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const resetForm = () => { setForm(emptyForm); setEditingId(null); setImageFile(null); setPreview(""); setError(""); };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name ?? "",
      variant: product.variant ?? "",
      size: product.size == null ? "" : String(product.size),
      price: String(product.price ?? 0),
      stock: String(product.stock ?? 0),
      description: product.description ?? "",
      image_url: product.image_url ?? "",
    });
    setImageFile(null);
    setPreview(product.image_url ?? "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Gunakan gambar JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      event.target.value = "";
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setForm((current) => ({ ...current, image_url: "" }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const price = Number(form.price);
    const stock = Number(form.stock);
    const size = form.size.trim() ? Number(form.size) : null;
    if (!form.name.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0 || (size !== null && (!Number.isInteger(size) || size <= 0))) {
      setError("Periksa nama, harga, stok, dan ukuran produk.");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = form.image_url.trim();
      if (imageFile) {
        const dataUrl = await readFileAsDataUrl(imageFile);
        const upload = await api.post("/uploads/product-image", {
          file_name: imageFile.name,
          content_type: imageFile.type,
          base64: dataUrl,
        }, { withCredentials: true });
        imageUrl = upload.data.data.image_url;
      }
      const payload = {
        name: form.name.trim(),
        variant: form.variant.trim() || null,
        size,
        price,
        stock,
        description: form.description.trim(),
        image_url: imageUrl || null,
      };
      if (editingId) {
        await api.put(`/products/${encodeURIComponent(editingId)}`, payload, { withCredentials: true });
      } else {
        await api.post("/products", payload, { withCredentials: true });
      }
      resetForm();
      setLoading(true);
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      const apiError = requestError as ApiErrorResponse;
      setError(apiError.response?.data?.message || (requestError instanceof Error ? requestError.message : "Gagal menyimpan produk."));
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Hapus produk "${product.name}"${product.size ? ` ${product.size} ml` : ""}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusyId(product.id);
    setError("");
    try {
      await api.delete(`/products/${encodeURIComponent(product.id)}`, { withCredentials: true });
      setProducts((current) => current.filter((item) => item.id !== product.id));
      if (editingId === product.id) resetForm();
    } catch (requestError) {
      const apiError = requestError as ApiErrorResponse;
      setError(apiError.response?.data?.message || "Produk gagal dihapus. Produk yang sudah tercatat dalam pesanan mungkin tidak dapat dihapus.");
    } finally {
      setBusyId(null);
    }
  };

  const setOutOfStock = async (product: Product) => {
    setBusyId(product.id);
    setError("");
    try {
      const nextStock = product.stock > 0 ? 0 : 1;
      const response = await api.put(`/products/${encodeURIComponent(product.id)}`, {
        name: product.name,
        variant: product.variant ?? null,
        size: product.size ?? null,
        price: product.price,
        stock: nextStock,
        description: product.description ?? "",
        image_url: product.image_url ?? null,
      }, { withCredentials: true });
      const updated = response.data.data;
      setProducts((current) => current.map((item) => item.id === product.id ? updated : item));
      if (editingId === product.id) setForm((current) => ({ ...current, stock: String(nextStock) }));
    } catch (requestError) {
      const apiError = requestError as ApiErrorResponse;
      setError(apiError.response?.data?.message || "Status stok gagal diperbarui.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredProducts = products.filter((product) => `${product.name} ${product.variant ?? ""} ${product.size ?? ""}`.toLowerCase().includes(searchTerm.trim().toLowerCase()));
  const outOfStockCount = products.filter((product) => product.stock <= 0).length;

  return (
    <div className="min-h-screen flex bg-[#f2f3f5] font-sans text-slate-800">
      <AdminSidebar productCount={products.length} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader title="Manajemen Produk & Katalog" subtitle="Edit informasi parfum, kelola stok, gambar, dan status ketersediaan." badgeCount={outOfStockCount} searchValue={searchTerm} onSearchChange={setSearchTerm} />
        <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-8">
          {error && <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{error}</span><button onClick={() => setError("")} aria-label="Tutup pesan"><X className="h-4 w-4" /></button></div>}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-4">
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div><h2 className="font-bold text-slate-900">{editingId ? "Edit Produk" : "Tambah Produk"}</h2><p className="mt-1 text-xs text-slate-500">Stok 0 otomatis menandai produk habis.</p></div>
                {editingId ? <button onClick={resetForm} type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Batal edit"><X className="h-4 w-4" /></button> : <Plus className="h-5 w-5 text-amber-600" />}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-xs font-semibold text-slate-600">Nama parfum<input required value={form.name} onChange={(event) => setField("name", event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
                <label className="block text-xs font-semibold text-slate-600">Kategori / karakter aroma<input value={form.variant} onChange={(event) => setField("variant", event.target.value)} placeholder="Fresh · Woody" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-slate-600">Ukuran (ml)<input type="number" min="1" step="1" value={form.size} onChange={(event) => setField("size", event.target.value)} placeholder="100" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
                  <label className="block text-xs font-semibold text-slate-600">Harga (Rp)<input type="number" min="0" step="1" required value={form.price} onChange={(event) => setField("price", event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
                </div>
                <label className="block text-xs font-semibold text-slate-600">Jumlah stok<input type="number" min="0" step="1" required value={form.stock} onChange={(event) => setField("stock", event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /><span className="mt-1 block font-normal text-slate-400">Isi 0 jika stok habis, atau tambah angka untuk restock.</span></label>
                <label className="block text-xs font-semibold text-slate-600">Deskripsi<textarea rows={3} value={form.description} onChange={(event) => setField("description", event.target.value)} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Gambar produk (JPG/PNG, maks. 5 MB)</label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 hover:border-amber-500"><ImagePlus className="h-5 w-5 text-amber-600" /><span className="text-xs text-slate-600">{imageFile ? imageFile.name : "Pilih gambar dari perangkat"}</span><input type="file" accept="image/jpeg,image/png" className="hidden" onChange={chooseImage} /></label>
                  {preview && <div className="relative mt-3 w-28"><img src={preview} alt="Pratinjau produk" className="h-28 w-28 rounded-xl border border-slate-200 object-cover" /><button type="button" onClick={() => { setImageFile(null); setPreview(""); setField("image_url", ""); }} className="absolute -right-2 -top-2 rounded-full bg-white p-1.5 shadow" aria-label="Hapus gambar"><X className="h-4 w-4" /></button></div>}
                  <label className="mt-3 block text-xs text-slate-500">Atau URL gambar<input type="url" value={form.image_url} onChange={(event) => { setField("image_url", event.target.value); setImageFile(null); setPreview(event.target.value); }} placeholder="https://..." className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-900" /></label>
                </div>
                <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"} <PackageCheck className="h-4 w-4 text-amber-400" /></button>
              </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><div><h2 className="font-bold text-slate-900">Katalog Produk</h2><p className="mt-1 text-xs text-slate-500">{products.length} varian · {outOfStockCount} habis</p></div><div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari parfum..." className="w-36 text-sm outline-none sm:w-48" /></div></div>
              {loading ? <p className="p-10 text-center text-sm text-slate-500">Memuat katalog...</p> : filteredProducts.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">Tidak ada produk ditemukan.</p> : (
                <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Produk</th><th className="px-3 py-3">Harga</th><th className="px-3 py-3">Stok</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Aksi</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => {
                      const out = product.stock <= 0;
                      return <tr key={product.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={product.image_url || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80"} alt={product.name} className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-100 object-cover" /><div className="max-w-[220px]"><p className="truncate font-semibold text-slate-900">{product.name}</p><p className="mt-0.5 text-xs text-slate-500">{product.size ? `${product.size} ml · ` : ""}{product.variant || "Tanpa kategori"}</p></div></div></td>
                        <td className="whitespace-nowrap px-3 py-3 font-medium">{money(Number(product.price))}</td>
                        <td className={`px-3 py-3 font-semibold ${out ? "text-rose-600" : "text-slate-800"}`}>{product.stock}</td>
                        <td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${out ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{out ? <><PackageX className="h-3 w-3" /> Habis</> : <><PackageCheck className="h-3 w-3" /> Tersedia</>}</span></td>
                        <td className="px-3 py-3"><div className="flex justify-end gap-1.5"><button disabled={busyId === product.id} onClick={() => void setOutOfStock(product)} title={out ? "Aktifkan kembali dengan stok 1" : "Tandai habis"} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50">{out ? <PackageCheck className="h-4 w-4" /> : <PackageX className="h-4 w-4" />}</button><button onClick={() => startEdit(product)} title="Edit produk" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button><button disabled={busyId === product.id} onClick={() => void deleteProduct(product)} title="Hapus produk" className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></div></td>
                      </tr>;
                    })}
                  </tbody>
                </table></div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
