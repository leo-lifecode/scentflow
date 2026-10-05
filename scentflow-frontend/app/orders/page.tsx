"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products?: { name?: string; variant?: string | null; size?: number | null } | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  orders_items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent("/orders")}`);
      return;
    }

    api.get<{ data: Order[] }>("/orders", { withCredentials: true })
      .then((response) => setOrders(response.data.data))
      .finally(() => setLoading(false));
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return <main className="min-h-screen p-8">Memuat pesanan...</main>;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900">Pesanan Saya</h1>
        <p className="mt-1 text-sm text-slate-500">Hanya pesanan milik akun yang sedang login.</p>

        {orders.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {order.orders_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.products?.name ?? "Produk"} × {item.quantity}
                      </span>
                      <span className="font-medium text-slate-900">
                        Rp {Number(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end border-t border-slate-100 pt-4 font-bold text-slate-900">
                  Rp {Number(order.total_amount).toLocaleString("id-ID")}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
