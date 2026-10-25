"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

interface Customer { id: string; full_name?: string | null; email?: string | null; phone?: string | null; role?: string; created_at: string; order_count?: number; }
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/admin/customers", { withCredentials: true })
      .then((response) => setCustomers(response.data.data ?? []))
      .catch(() => setError("Gagal memuat pelanggan. Pastikan migrasi database sudah diterapkan dan sesi admin masih aktif."))
      .finally(() => setLoading(false));
  }, []);
  return <div className="flex min-h-screen bg-[#f2f3f5] text-slate-800"><AdminSidebar />
    <div className="flex min-w-0 flex-1 flex-col"><AdminHeader title="Customers" subtitle="Daftar akun pelanggan dan informasi kontak yang tersedia." badgeCount={customers.length} searchValue="" onSearchChange={() => {}} />
      <main className="flex-1 p-6 lg:p-8">{error && <p className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">Daftar pelanggan</h2><p className="mt-1 text-xs text-slate-500">Data kontak hanya ditampilkan jika tersedia pada profil atau pesanan.</p></div>
          {loading ? <p className="p-5 text-sm text-slate-500">Memuat pelanggan...</p> : customers.length === 0 ? <p className="p-5 text-sm text-slate-500">Belum ada pelanggan.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Nama</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">No. HP</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Terdaftar</th></tr></thead><tbody className="divide-y divide-slate-100">{customers.map(customer => <tr key={customer.id}><td className="px-5 py-4 font-medium text-slate-900">{customer.full_name || "Nama belum diisi"}</td><td className="px-5 py-4 text-slate-600">{customer.email || "Belum tersedia"}</td><td className="px-5 py-4 text-slate-600">{customer.phone || "Belum tersedia"}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{customer.role || "customer"}</span></td><td className="px-5 py-4 text-slate-500">{new Date(customer.created_at).toLocaleDateString("id-ID")}</td></tr>)}</tbody></table></div>}
        </div>
      </main>
    </div>
  </div>;
}