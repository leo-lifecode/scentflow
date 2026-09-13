"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Award,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("50ml");

  useEffect(() => {
    let isMounted = true;

    async function fetchProductDetail() {
      try {
        const response = await api.get("/products");
        const allProducts: Product[] = response.data.data || response.data || [];
        const found = allProducts.find((p) => String(p.id) === String(productId));

        if (isMounted) {
          setProduct(found || null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProductDetail();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3" />
        Memuat detail wewangian...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-serif text-slate-900 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 text-xs mb-6">Varian parfum ini tidak tersedia di katalog atelier.</p>
        <Link
          href="/"
          className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Beranda Toko
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </div>

        {/* Layout Grid 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Kolom Kiri: Galeri Gambar Flacon */}
          <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden">
              <img
                src={
                  product.image_url ||
                  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isOutOfStock ? "Stok Habis" : `Tersedia ${product.stock} Botol`}
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Rincian Formulasi & Pembelian */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
                Extrait de Parfum • Haute Collection
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-slate-950 font-medium mb-3">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-slate-950">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="border-t border-b border-slate-200 py-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description ||
                  "Komposisi wewangian mewah dengan maceration 90 hari di tangki baja stainless untuk menghasilkan daya tahan dan ketajaman aroma tingkat tinggi."}
              </p>
            </div>

            {/* Piramida Olfaktori (Scent Notes) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Piramida Olfaktori
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Top Notes</span>
                  <span className="font-medium text-slate-800">Bergamot &amp; Peppercorn</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Heart Notes</span>
                  <span className="font-medium text-slate-800">Damask Rose &amp; Iris</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Base Notes</span>
                  <span className="font-medium text-slate-800">Cendana &amp; Amber</span>
                </div>
              </div>
            </div>

            {/* Pilihan Ukuran & Jumlah */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Ukuran Botol
                </label>
                <div className="flex gap-3">
                  {["50ml", "100ml"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-slate-950 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Tombol CTA */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-slate-600 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Garansi BPOM Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pengiriman Thermal</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>2x Vial Discovery Sample</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}