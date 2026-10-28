"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { ShoppingBag, ShieldCheck, Truck, Award, ArrowLeft, Plus, Minus, Sparkles } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;
    async function fetchProductDetail() {
      try {
        const response = await api.get("/products");
        const products: Product[] = response.data.data || response.data || [];
        const found = products.find((item) => String(item.id) === String(productId));
        if (active) {
          setAllProducts(products);
          setProduct(found || null);
          setQuantity(1);
        }
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchProductDetail();
    return () => { active = false; };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500"><div className="mr-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />Memuat detail parfum...</div>;
  }

  if (!product) {
    return <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4"><h2 className="mb-2 font-serif text-xl text-slate-900">Produk tidak ditemukan</h2><p className="mb-6 text-xs text-slate-500">Varian parfum ini belum tersedia di katalog.</p><Link href="/" className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white"><ArrowLeft className="h-4 w-4" />Kembali ke katalog</Link></div>;
  }

  const isOutOfStock = product.stock <= 0;
  const variants = allProducts
    .filter((item) => item.name === product.name && (item.variant ?? "") === (product.variant ?? "") && typeof item.size === "number")
    .sort((a, b) => Number(a.size) - Number(b.size));

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-slate-900 antialiased">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500"><Link href="/" className="flex items-center gap-1 transition hover:text-slate-900"><ArrowLeft className="h-3.5 w-3.5" />Beranda</Link><span>/</span><span className="truncate font-medium text-slate-900">{product.name}</span></div>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl bg-slate-100">
              <img src={product.image_url || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"} alt={`${product.name}${product.size ? ` ${product.size} ml` : ""}`} className="h-full w-full object-cover" />
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold ${isOutOfStock ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{isOutOfStock ? "Stok habis" : `Tersedia · ${product.stock} botol`}</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 py-1">
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">{product.variant || "Signature collection"}</span>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-2xl font-bold text-slate-950">Rp {Number(product.price).toLocaleString("id-ID")}</p>
              <p className="mt-1 text-xs text-slate-500">{product.size ? `Ukuran botol ${product.size} ml` : "Ukuran botol belum ditentukan"}</p>
            </div>
            <div className="border-y border-slate-200 py-5"><p className="text-sm leading-7 text-slate-600">{product.description || "Parfum pilihan untuk melengkapi karakter dan suasana harian."}</p></div>
            {variants.length > 0 && (
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">Ukuran botol</label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => <button key={variant.id} disabled={variant.stock <= 0} onClick={() => { setQuantity(1); router.push(`/products/${variant.id}`); }} className={`rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${variant.id === product.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}><span className="block text-sm font-semibold">{variant.size} ml</span><span className={`mt-1 block text-[10px] ${variant.id === product.id ? "text-slate-300" : "text-slate-500"}`}>Rp {Number(variant.price).toLocaleString("id-ID")}</span></button>)}
                </div>
              </div>
            )}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-500">Jumlah</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                  <button aria-label="Kurangi jumlah" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"><Minus className="h-4 w-4" /></button>
                  <span className="w-9 text-center text-sm font-bold">{quantity}</span>
                  <button aria-label="Tambah jumlah" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"><Plus className="h-4 w-4" /></button>
                </div>
                <button disabled={isOutOfStock} onClick={handleAddToCart} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><ShoppingBag className="h-4 w-4 text-amber-400" />{isOutOfStock ? "Stok habis" : "Tambah ke keranjang"}</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-slate-200 pt-5 text-[10px] text-slate-600"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-amber-700" /><span>Checkout aman</span></div><div className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-amber-700" /><span>Info pengiriman</span></div><div className="flex items-center gap-2"><Award className="h-4 w-4 shrink-0 text-amber-700" /><span>Pilihan kurasi</span></div></div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="flex items-center gap-2 text-xs font-semibold text-amber-950"><Sparkles className="h-4 w-4" />Varian ukuran dan harga terhubung ke katalog</p><p className="mt-1 text-xs leading-5 text-amber-900/75">Setiap ukuran adalah produk tersendiri, sehingga stok, harga, dan jumlah keranjang dihitung secara terpisah.</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}
