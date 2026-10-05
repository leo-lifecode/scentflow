"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const [name, setName] = useState(String(user?.user_metadata?.full_name ?? ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [authLoading, user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/checkout",
        {
          customer_name: name,
          customer_email: user.email,
          items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        },
        { withCredentials: true }
      );

      clearCart();
      window.location.href = response.data.data.payment_url;
    } catch (requestError) {
      console.error(requestError);
      setError("Checkout gagal. Periksa stok lalu coba lagi.");
      setLoading(false);
    }
  }

  if (authLoading) return <main className="min-h-screen p-8">Memuat...</main>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-500">Pembayaran dibuat untuk akun {user.email}.</p>

          {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama penerima"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
            />
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Membuat pembayaran..." : "Lanjut ke Pembayaran"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Ringkasan</h2>
          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="text-slate-600">{item.name} × {item.quantity}</span>
                <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>
          <button onClick={() => router.back()} className="mt-4 w-full text-sm text-slate-500">
            Kembali
          </button>
        </aside>
      </div>
    </main>
  );
}
