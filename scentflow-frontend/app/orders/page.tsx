"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface OrderItem { id: string; quantity: number; price: number; products?: { name?: string; variant?: string | null; size?: number | null } | null; }
interface Order {
  id: string; total_amount: number; status: string; created_at: string; orders_items: OrderItem[];
  shipping_address?: string | null; customer_phone?: string | null; shipping_status?: string | null;
  shipping_courier?: string | null; tracking_number?: string | null;
}
const paid = (status: string) => ["success", "settlement", "paid"].includes(status.toLowerCase());
const shippingLabels: Record<string, string> = { UNPAID: "Menunggu pembayaran", PROCESSING: "Pesanan sedang disiapkan", SHIPPED: "Pesanan sudah dikirim", IN_TRANSIT: "Paket dalam perjalanan", DELIVERED: "Pesanan telah diterima", CANCELLED: "Pengiriman dibatalkan" };

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace(`/login?redirect=${encodeURIComponent("/orders")}`); return; }
    api.get<{ data: Order[] }>("/orders", { withCredentials: true })
      .then((response) => setOrders(response.data.data ?? []))
      .catch(() => setError("Pesanan belum bisa dimuat. Coba masuk ulang lalu refresh halaman."))
      .finally(() => setLoading(false));
  }, [authLoading, user, router]);
  if (authLoading || loading) return <main className="min-h-screen bg-slate-50 p-8">Memuat pesanan...</main>;
  if (!user) return null;
  return <main className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-4xl">
    <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Kembali ke toko</Link>
    <h1 className="mt-4 text-2xl font-bold text-slate-900">Pesanan Saya</h1><p className="mt-1 text-sm text-slate-500">Status pembayaran, alamat penerima, resi, dan perkembangan pengiriman.</p>
    {error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    {orders.length === 0 ? <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Belum ada pesanan.</div> : <div className="mt-8 space-y-4">{orders.map(order => {
      const isPaid = paid(order.status);
      const shippingStatus = isPaid && (!order.shipping_status || order.shipping_status === "UNPAID") ? "PROCESSING" : order.shipping_status || "UNPAID";
      return <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">Pesanan #{order.id.slice(0, 8)}</p><p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString("id-ID")}</p></div><div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{isPaid ? "Pembayaran berhasil" : `Pembayaran: ${order.status}`}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{shippingLabels[shippingStatus] || shippingStatus}</span></div></div>
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">{(order.orders_items || []).map(item => <div key={item.id} className="flex justify-between text-sm"><span className="text-slate-600">{item.products?.name ?? "Produk"} × {item.quantity}</span><span className="font-medium text-slate-900">Rp {Number(item.price * item.quantity).toLocaleString("id-ID")}</span></div>)}</div>
        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4 font-bold text-slate-900">Total Rp {Number(order.total_amount).toLocaleString("id-ID")}</div>
        {isPaid && <section className="mt-4 rounded-xl bg-slate-50 p-4"><h2 className="font-semibold text-slate-900">Informasi pengiriman</h2><p className="mt-1 text-sm text-slate-600">{shippingLabels[shippingStatus] || shippingStatus}</p><p className="mt-2 text-sm text-slate-600">Kurir: <strong>{order.shipping_courier || "Belum ditentukan"}</strong></p><p className="text-sm text-slate-600">Nomor resi: <strong>{order.tracking_number || "Resi belum tersedia"}</strong></p>{order.shipping_address && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">Alamat: {order.shipping_address}</p>}{order.customer_phone && <p className="text-sm text-slate-600">No. HP: {order.customer_phone}</p>}</section>}
      </article>;
    })}</div>}
  </div></main>;
}