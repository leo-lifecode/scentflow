"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Download, Send } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ORD-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-serif text-slate-950 font-semibold mb-2">Pembayaran Berhasil!</h1>
      <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
        Terima kasih, pesanan Anda telah terkonfirmasi dan sedang disiapkan oleh tim atelier kami.
      </p>

      {/* Identitas Pesanan */}
      <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-800 mb-8 border border-slate-200/60">
        <span>Order ID: #{orderId}</span>
      </div>

      {/* Informasi n8n Bot Automation */}
      <div className="bg-slate-950 text-white p-4 rounded-xl text-left mb-8 flex items-start gap-3 shadow-sm">
        <Send className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-amber-400">Notifikasi Otomatis Terkirim</p>
          <p className="text-slate-300">
            Rincian transaksi dan pembaruan nomor resi telah dikirimkan secara langsung melalui Bot Telegram
            dan email Anda.
          </p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-200"
        >
          <Download className="w-4 h-4" />
          Cetak Struk Transaksi
        </button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 flex items-center justify-center">
      <Suspense fallback={<div className="text-slate-500 text-xs">Memuat konfirmasi pesanan...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
