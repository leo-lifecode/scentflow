import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
        <Sparkles className="w-6 h-6 text-amber-500" />
      </div>

      <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-bold mb-2">
        Error 404 — Page Not Found
      </span>

      <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight mb-3">
        Jalur Olfaktori Tidak Ditemukan
      </h1>

      <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
        Halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL yang dimasukkan kurang
        tepat.
      </p>

      <Link
        href="/"
        className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Utama
      </Link>
    </div>
  );
}
