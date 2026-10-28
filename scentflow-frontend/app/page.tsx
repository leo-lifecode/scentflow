"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { ShoppingBag, ShieldCheck, Sparkles, SlidersHorizontal, X, ChevronDown } from "lucide-react";

const money = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState("Semua");
  const [selectedSize, setSelectedSize] = useState("Semua");
  const [priceRange, setPriceRange] = useState("Semua");
  const [stockOnly, setStockOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;
    async function fetchProducts() {
      try {
        const response = await api.get("/products");
        const data: Product[] = response.data.data || response.data || [];
        if (active) setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchProducts();
    return () => { active = false; };
  }, []);

  const families = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((product) => product.variant).filter((value): value is string => Boolean(value))))],
    [products],
  );
  const sizes = useMemo(
    () => Array.from(new Set(products.map((product) => product.size).filter((value): value is number => typeof value === "number"))).sort((a, b) => a - b),
    [products],
  );
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesFamily = selectedFamily === "Semua" || product.variant === selectedFamily;
      const matchesSize = selectedSize === "Semua" || String(product.size ?? "") === selectedSize;
      const matchesPrice = priceRange === "Semua"
        || (priceRange === "under500" && product.price < 500000)
        || (priceRange === "500to1500" && product.price >= 500000 && product.price <= 1500000)
        || (priceRange === "over1500" && product.price > 1500000);
      const matchesStock = !stockOnly || product.stock > 0;
      const matchesSearch = `${product.name} ${product.variant ?? ""} ${product.description ?? ""}`.toLowerCase().includes(search.trim().toLowerCase());
      return matchesFamily && matchesSize && matchesPrice && matchesStock && matchesSearch;
    });
    if (sort === "priceAsc") filtered.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") filtered.sort((a, b) => b.price - a.price);
    if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [products, selectedFamily, selectedSize, priceRange, stockOnly, search, sort]);

  const resetFilters = () => {
    setSelectedFamily("Semua");
    setSelectedSize("Semua");
    setPriceRange("Semua");
    setStockOnly(false);
    setSearch("");
    setSort("recommended");
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await api.get("/products");
      const liveProducts: Product[] = response.data.data || response.data || [];
      setProducts(liveProducts);
      const liveProduct = liveProducts.find((item) => String(item.id) === String(product.id));
      if (!liveProduct || liveProduct.stock <= 0) {
        alert("Maaf, stok produk ini sudah habis.");
        return;
      }
      addToCart(liveProduct);
      setIsCartOpen(true);
    } catch {
      alert("Stok belum bisa diverifikasi. Coba lagi sebelum menambahkan produk ke keranjang.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-slate-900 antialiased">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative my-7 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:my-10 sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-amber-400/20 sm:right-12 sm:h-96 sm:w-96" />
          <div className="pointer-events-none absolute -right-3 -top-14 h-60 w-60 rounded-full border border-amber-400/15 sm:right-20 sm:h-80 sm:w-80" />
          <div className="relative max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300"><Sparkles className="h-3.5 w-3.5" /> Curated fragrance collection</span>
            <h1 className="max-w-xl font-serif text-4xl font-medium leading-tight tracking-tight sm:text-6xl">Temukan aroma yang terasa seperti <span className="italic text-amber-300">kamu.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Jelajahi parfum dari karakter fresh dan citrus sampai woody yang hangat. Pilih aroma, ukuran botol, dan anggaran tanpa harus berkeliling seperti sedang mencari jarum di toko parfum.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><ShieldCheck className="h-4 w-4 text-amber-300" /> Katalog terpusat</span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><ShoppingBag className="h-4 w-4 text-amber-300" /> Keranjang per varian</span>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">Shop by scent</p><h2 className="mt-1 font-serif text-3xl text-slate-950 sm:text-4xl">Koleksi parfum</h2><p className="mt-2 text-sm text-slate-500">Gunakan filter untuk menemukan ukuran dan karakter aroma yang cocok.</p></div>
            <span className="text-xs text-slate-500">{filteredProducts.length} produk ditemukan</span>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950"><SlidersHorizontal className="h-4 w-4 text-amber-700" /> Filter produk</h3>
                <button onClick={resetFilters} className="text-[11px] font-semibold text-slate-500 underline underline-offset-4 hover:text-slate-950">Reset</button>
              </div>
              <label className="mb-2 block text-xs font-semibold text-slate-700">Cari parfum</label>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nama atau karakter aroma" className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100" />

              <div className="border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-700">Karakter aroma</p>
                <div className="space-y-2.5">
                  {families.map((family) => <label key={family} className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600"><input type="radio" name="family" checked={selectedFamily === family} onChange={() => setSelectedFamily(family)} className="accent-slate-950" /><span>{family}</span></label>)}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-3 text-xs font-semibold text-slate-700">Ukuran botol</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedSize("Semua")} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${selectedSize === "Semua" ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}>Semua</button>
                  {sizes.map((size) => <button key={size} onClick={() => setSelectedSize(String(size))} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${selectedSize === String(size) ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}>{size} ml</button>)}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <label htmlFor="price-filter" className="mb-3 block text-xs font-semibold text-slate-700">Rentang harga</label>
                <div className="relative">
                  <select id="price-filter" value={priceRange} onChange={(event) => setPriceRange(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-xs text-slate-700 outline-none focus:border-slate-400">
                    <option value="Semua">Semua harga</option>
                    <option value="under500">Di bawah Rp500.000</option>
                    <option value="500to1500">Rp500.000–Rp1.500.000</option>
                    <option value="over1500">Di atas Rp1.500.000</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600"><input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} className="h-4 w-4 accent-slate-950" /> Hanya produk tersedia</label>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <p className="text-xs text-slate-500">Menampilkan <strong className="text-slate-900">{filteredProducts.length}</strong> dari {products.length} varian</p>
                <div className="flex items-center gap-2">
                  {(selectedFamily !== "Semua" || selectedSize !== "Semua" || priceRange !== "Semua" || stockOnly || search) && <button onClick={resetFilters} className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900"><X className="h-3.5 w-3.5" /> Hapus filter</button>}
                  <label htmlFor="sort-products" className="text-[11px] text-slate-500">Urutkan</label>
                  <select id="sort-products" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none">
                    <option value="recommended">Rekomendasi</option><option value="priceAsc">Harga terendah</option><option value="priceDesc">Harga tertinggi</option><option value="name">Nama A–Z</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-sm text-slate-500"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />Memuat katalog parfum...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Sparkles className="mx-auto mb-3 h-7 w-7 text-amber-600" /><h3 className="font-serif text-xl text-slate-900">Tidak ada produk yang cocok</h3><p className="mt-2 text-xs text-slate-500">Coba ubah filter atau reset semua pilihan.</p><button onClick={resetFilters} className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">Reset filter</button></div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const outOfStock = product.stock <= 0;
                    return (
                      <article key={product.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                        <Link href={`/products/${product.id}`} className="relative block aspect-[4/4.6] overflow-hidden bg-slate-100">
                          <img src={product.image_url || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"} alt={`${product.name}${product.size ? ` ${product.size} ml` : ""}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700 backdrop-blur">{product.size ? `${product.size} ml` : "Ukuran belum diatur"}</span>
                          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${outOfStock ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{outOfStock ? "Stok habis" : "Tersedia"}</span>
                        </Link>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-700">{product.variant || "Signature collection"}</p>
                          <Link href={`/products/${product.id}`} className="mt-1 font-serif text-lg leading-snug text-slate-950 hover:text-amber-800">{product.name}</Link>
                          <p className="mt-2 line-clamp-2 min-h-9 text-xs leading-5 text-slate-500">{product.description || "Aroma pilihan untuk melengkapi karakter dan suasana harian."}</p>
                          <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                            <div><p className="text-[9px] uppercase tracking-wider text-slate-400">Harga</p><p className="mt-1 text-sm font-bold text-slate-950">{money(Number(product.price))}</p><p className="mt-1 text-[10px] text-slate-400">Stok: {product.stock} botol</p></div>
                            <button disabled={outOfStock} onClick={() => { void handleAddToCart(product); }} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><ShoppingBag className="h-3.5 w-3.5 text-amber-400" />Tambah</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-16 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3 sm:p-8">
          <div><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">01 · Temukan</span><h3 className="mt-2 font-serif text-xl">Pilih karakter aroma</h3><p className="mt-2 text-xs leading-5 text-slate-500">Fresh, citrus, floral, hingga woody. Filter dibuat dari kategori katalog, bukan tebakan UI.</p></div>
          <div><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">02 · Sesuaikan</span><h3 className="mt-2 font-serif text-xl">Pilih ukuran botol</h3><p className="mt-2 text-xs leading-5 text-slate-500">Varian 50 ml dan 100 ml disimpan sebagai item berbeda, termasuk harga dan stoknya.</p></div>
          <div><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">03 · Belanja</span><h3 className="mt-2 font-serif text-xl">Keranjang akurat</h3><p className="mt-2 text-xs leading-5 text-slate-500">Menambahkan satu botol berarti bertambah satu. Tidak ada bonus botol hasil aritmetika React.</p></div>
        </section>
      </main>
    </div>
  );
}
