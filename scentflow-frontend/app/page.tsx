"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const response = await api.get("/products");
        if (isMounted) {
          setProducts(response.data.data || response.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="w-full">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100/80 px-3 py-1 rounded-full mb-3 text-amber-800 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Koleksi Terbatas 2026
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-slate-950 font-medium">
                Ode to Rare Essences
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-2 max-w-xl">
                Koleksi Parfum Premium dengan Manajemen Stok Real-time. Diformulasikan secara presisi lewat
                tradisi maceration haute parfumerie.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-200/60 self-start md:self-auto">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Status Inventaris
                </span>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Gudang Utama • Sinkronisasi Aktif
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="text-center py-20 text-slate-500">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Memuat katalog haute parfumerie...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
              Belum ada produk parfum yang tersedia di katalog.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 4;

                return (
                  <article
                    key={product.id}
                    className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 group"
                  >
                    <div>
                      {/* Link ke Halaman Detail Produk */}
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden mb-4 cursor-pointer">
                          <img
                            src={
                              product.image_url ||
                              "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isOutOfStock ? "bg-rose-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                            <span
                              className={`text-xs font-semibold ${
                                isOutOfStock
                                  ? "text-rose-600"
                                  : isLowStock
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                              }`}
                            >
                              {isOutOfStock
                                ? "Stok Habis"
                                : isLowStock
                                  ? `Stok: ${product.stock} (Tersisa Sedikit)`
                                  : `Stok: ${product.stock}`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">
                            Extrait de Parfum
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">50ml / 1.7 FL. OZ.</span>
                        </div>

                        <h2 className="text-xl font-serif text-slate-900 mb-1 group-hover:text-amber-700 transition-colors cursor-pointer">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                        {product.description ||
                          "Aroma eksklusif racikan atelier ScentFlow dengan esens konsentrasi tinggi."}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                          Harga Resmi
                        </span>
                        <span className="text-base font-bold text-slate-950">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <button
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          setIsCartOpen(true);
                        }}
                        className="bg-slate-950 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95 text-xs font-semibold uppercase tracking-wider"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {isOutOfStock ? "Habis" : "Beli"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Brand Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-2">
              <span className="text-xs text-amber-600 uppercase tracking-widest font-bold">
                Komitmen Kualitas
              </span>
              <h3 className="text-xl font-serif text-slate-950">Master Formula dari Grasse</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Setiap sari pati melalui maceration 90 hari di tangki stainless baja sebelum dipindahkan ke
                botol kristal kaca tahan thermal.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 uppercase font-semibold">
                  Alokasi Batch Musim Ini
                </span>
                <span className="text-xs text-amber-700 font-bold">84% Terpesan</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "84%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                <span>Batch Terbit: 1.000 Botol</span>
                <span>Sisa Alokasi: 160 Botol</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 block">Keaslian Dijamin 100%</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dilengkapi segel hologram khusus &amp; sertifikasi BPOM resmi pada tiap botol.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-white border-t border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 ScentFlow Haute Parfumerie. Hak Cipta Dilindungi.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Privasi</span>
            <span className="hover:text-slate-900 cursor-pointer">Syarat &amp; Ketentuan</span>
            <span className="hover:text-slate-900 cursor-pointer">Sertifikasi BPOM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
