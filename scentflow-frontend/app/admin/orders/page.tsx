"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

interface Item { id: string; quantity: number; price: number; products?: { name?: string } | null; }
interface Order {
  id: string; user_id: string; customer_name: string; customer_email: string; customer_phone?: string | null;
  shipping_address?: string | null; total_amount: number; status: string; shipping_status?: string | null;
  shipping_courier?: string | null; tracking_number?: string | null; created_at: string; orders_items: Item[];
}
const paid = (status: string) => ["success", "settlement", "paid"].includes(status.toLowerCase());
const shippingLabels: Record<string, string> = { UNPAID: "Belum dibayar", PROCESSING: "Disiapkan", SHIPPED: "Dikirim", IN_TRANSIT: "Dalam perjalanan", DELIVERED: "Terkirim", CANCELLED: "Dibatalkan" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function fetchOrders() {
      try {
        const response = await api.get("/admin/orders", { withCredentials: true });
        if (active) { setOrders(response.data.data ?? []); setError(""); }
      } catch {
        if (active) setError("Gagal memuat pesanan. Pastikan migrasi database sudah diterapkan dan sesi admin masih aktif.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void fetchOrders();
    return () => { active = false; };
  }, []);

  async function saveShipping(order: Order, form: HTMLFormElement) {
    const data = new FormData(form);
    setSaving(order.id); setError("");
    try {
      await api.patch(`/admin/orders/${order.id}/shipping`, {
        shipping_status: String(data.get("shipping_status")),
        shipping_courier: String(data.get("shipping_courier") || ""),
        tracking_number: String(data.get("tracking_number") || ""),
      }, { withCredentials: true });
      const response = await api.get("/admin/orders", { withCredentials: true });
      setOrders(response.data.data ?? []);
    } catch { setError("Status pengiriman gagal disimpan."); }
    finally { setSaving(null); }
  }

  return <div className="flex min-h-screen bg-[#f2f3f5] text-slate-800"><AdminSidebar />
    <div className="flex min-w-0 flex-1 flex-col"><AdminHeader title="Orders & Pengiriman" subtitle="Periksa pembayaran, detail penerima, resi, dan progres pengiriman." badgeCount={orders.filter(o => paid(o.status)).length} searchValue="" onSearchChange={() => {}} />
      <main className="flex-1 space-y-5 p-6 lg:p-8">
        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {loading ? <p className="rounded-xl bg-white p-6 text-sm text-slate-500">Memuat pesanan...</p> : orders.length === 0 ? <p className="rounded-xl bg-white p-6 text-sm text-slate-500">Belum ada pesanan.</p> : orders.map(order => {
          const isPaid = paid(order.status);
          const shippingStatus = isPaid && (!order.shipping_status || order.shipping_status === "UNPAID") ? "PROCESSING" : order.shipping_status || "UNPAID";
          return <article key={order.id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div><p className="font-bold text-slate-900">Pesanan #{order.id.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{new Date(order.created_at).toLocaleString("id-ID")}</p></div>
              <div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{isPaid ? "Pembayaran berhasil" : `Pembayaran: ${order.status}`}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{shippingLabels[shippingStatus] || shippingStatus}</span></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <section><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Data penerima</h3><p className="font-semibold text-slate-900">{order.customer_name}</p><p className="text-sm text-slate-600">{order.customer_email}</p><p className="text-sm text-slate-600">{order.customer_phone || "Nomor HP belum tersedia"}</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{order.shipping_address || "Alamat belum tersedia"}</p></section>
              <section><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Produk dibeli</h3><div className="space-y-2">{(order.orders_items || []).map(item => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="text-slate-600">{item.products?.name || "Produk"} × {item.quantity}</span><span className="font-medium text-slate-900">Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}</span></div>)}</div><p className="mt-3 border-t border-slate-100 pt-3 font-bold text-slate-900">Total: Rp {Number(order.total_amount).toLocaleString("id-ID")}</p></section>
            </div>
            <form onSubmit={(event) => { event.preventDefault(); void saveShipping(order, event.currentTarget); }} className="grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-4">
              <label className="text-xs font-semibold text-slate-600">Status pengiriman<select name="shipping_status" defaultValue={shippingStatus} disabled={!isPaid} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="UNPAID">Belum dibayar</option><option value="PROCESSING">Disiapkan</option><option value="SHIPPED">Dikirim</option><option value="IN_TRANSIT">Dalam perjalanan</option><option value="DELIVERED">Terkirim</option><option value="CANCELLED">Dibatalkan</option></select></label>
              <label className="text-xs font-semibold text-slate-600">Kurir<input name="shipping_courier" defaultValue={order.shipping_courier || ""} disabled={!isPaid} placeholder="JNE / J&T / SiCepat" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100" /></label>
              <label className="text-xs font-semibold text-slate-600">Nomor resi<input name="tracking_number" defaultValue={order.tracking_number || ""} disabled={!isPaid} placeholder="Masukkan nomor resi" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:bg-slate-100" /></label>
              <div className="flex items-end"><button disabled={!isPaid || saving === order.id} className="w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{saving === order.id ? "Menyimpan..." : "Simpan pengiriman"}</button></div>
              {!isPaid && <p className="text-xs text-amber-700 md:col-span-4">Data pengiriman baru dapat diubah setelah pembayaran terkonfirmasi.</p>}
            </form>
          </article>;
        })}
      </main>
    </div>
  </div>;
}