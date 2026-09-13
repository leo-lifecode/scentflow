"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, CreditCard, Gift, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Silakan lengkapi nama dan email Anda sebelum melakukan checkout.");
      return;
    }

    if (cart.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        customer_name: name,
        customer_email: email,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/checkout", payload);
      const { snap_token, order_id } = response.data.data || response.data;

      // Trigger Modal Midtrans Snap
      if (window.snap && snap_token) {
        window.snap.pay(snap_token, {
          onSuccess: function () {
            clearCart();
            setName("");
            setEmail("");
            onClose();
            // Redirect otomatis ke Halaman Success
            router.push(`/order-success?order_id=${order_id}`);
          },
          onPending: function () {
            alert("Menunggu penyelesaian pembayaran.");
          },
          onError: function () {
            alert("Pembayaran Gagal!");
          },
          onClose: function () {
            console.log("Customer menutup pop-up Snap.");
          },
        });
      } else {
        clearCart();
        onClose();
        router.push(`/order-success?order_id=${order_id || "LOCAL-TEST"}`);
      }
    } catch (error: any) {
      console.error("Error Checkout:", error);
      alert(error.response?.data?.message || "Gagal memproses checkout.");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between">
        {/* Header Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-950">Keranjang Belanja</h2>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {totalItems} Item Terpilih
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {/* Banner Free Shipping */}
          <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-amber-900 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" /> Gratis Ongkir Ekspres
              </span>
              <span className="bg-amber-200/80 text-amber-950 text-[10px] px-2 py-0.5 rounded-full uppercase">
                Aktif
              </span>
            </div>
            <p className="text-[11px] text-amber-700/80">
              Pengiriman terasuransi otomatis diterapkan pada setiap pesanan toko.
            </p>
          </div>

          {/* List Produk */}
          <div className="pt-3 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                Keranjang Anda masih kosong.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-medium text-slate-900 text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded text-slate-700 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-slate-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded text-slate-700 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Checkout & Form Pembeli */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/80 space-y-3">
            {/* Form Input Pembeli */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Adinda Saraswati"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-950 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Pembeli (Nota &amp; Resi)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-950 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Bonus Sample Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-amber-100/40 p-2 rounded-lg border border-amber-200/50">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Complimentary:</strong> 2x luxury sample vials (2ml) otomatis disertakan.
              </span>
            </div>

            {/* Total Summary */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs text-slate-500 font-medium">Total Pembayaran</span>
              <span className="text-lg font-bold text-slate-950">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Button Payment */}
            <button
              disabled={loading}
              onClick={handleCheckout}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              {loading ? "Memproses Token..." : "Bayar Sekarang"}
            </button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pembayaran Enkripsi Terproteksi Midtrans</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}