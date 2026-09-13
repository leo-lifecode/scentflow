"use client";

import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";

type Props = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-800">
            {product.name}
          </h3>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isOutOfStock
                ? "bg-rose-100 text-rose-600"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isOutOfStock ? "Stok Habis" : `Stok: ${product.stock}`}
          </span>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
          {product.description || "Aroma eksklusif racikan ScentFlow."}
        </p>
      </div>

      <div className="px-5 pb-5 pt-0 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs text-slate-400 block">Harga</span>
          <span className="text-base font-bold text-slate-900">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
        </div>
        <button
          disabled={isOutOfStock}
          onClick={() => onAddToCart && onAddToCart(product)}
          className="flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Beli
        </button>
      </div>
    </div>
  );
}
