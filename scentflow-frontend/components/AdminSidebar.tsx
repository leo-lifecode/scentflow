"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, ShoppingBag, FileText, Users, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps { productCount?: number; }
export default function AdminSidebar({ productCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  async function handleLogout() {
    try { await logout(); } finally { router.push("/admin/login"); }
  }
  const links = [
    { href: "/admin/dashboard", label: "Overview", Icon: LayoutGrid },
    { href: "/admin/products", label: "Products", Icon: ShoppingBag },
    { href: "/admin/orders", label: "Orders", Icon: FileText },
    { href: "/admin/customers", label: "Customers", Icon: Users },
  ];
  return <aside className="flex min-h-screen w-64 flex-shrink-0 flex-col justify-between border-r border-slate-800/80 bg-[#121316] text-slate-300">
    <div>
      <Link href="/admin/dashboard" className="flex h-20 items-center gap-3 border-b border-slate-800/60 px-6"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#c5a059] to-amber-200 font-serif text-lg font-bold text-[#0a0b0d]">SF</div><div><span className="block font-serif text-base font-semibold uppercase tracking-widest text-white">ScentFlow</span><span className="text-[10px] uppercase tracking-wider text-amber-300/70">Haute Parfumerie</span></div></Link>
      <nav aria-label="Navigasi admin" className="mt-6 space-y-1.5 px-3">{links.map(({ href, label, Icon }) => <Link key={href} href={href} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${pathname === href ? "bg-slate-800/70 font-medium text-white" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}><span className="flex items-center gap-3"><Icon className={`h-4 w-4 ${pathname === href ? "text-amber-400" : ""}`} />{label}</span>{label === "Products" && productCount !== undefined && <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">{productCount}</span>}</Link>)}</nav>
    </div>
    <div className="space-y-2 border-t border-slate-800/80 p-4"><button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-slate-800/40"><LogOut className="h-4 w-4" />Keluar (Logout)</button><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-amber-300/90 hover:bg-slate-800/40"><ArrowLeft className="h-4 w-4" />Kembali ke Toko</Link></div>
  </aside>;
}