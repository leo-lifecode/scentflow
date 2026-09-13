"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Refresh Trigger
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const res = await api.get("/products");
        if (isMounted) {
          setProducts(res.data.data || res.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    setIsSubmitting(true);
    try {
      await api.post("/products", {
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        image_url: imageUrl || undefined,
      });

      setName("");
      setPrice("");
      setStock("");
      setDescription("");
      setImageUrl("");

      setRefreshTrigger((prev) => prev + 1);
      alert("Varian produk berhasil ditambahkan ke katalog atelier!");
    } catch (err: any) {
      console.error("Gagal menambah produk:", err);
      alert(err.response?.data?.message || "Gagal menambahkan produk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const criticalStockCount = products.filter((p) => p.stock <= 2).length;

  return (
    <div className="bg-[#f2f3f5] text-slate-800 antialiased font-sans min-h-screen flex">
      {/* Sidebar Navigation */}
      <AdminSidebar productCount={products.length} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          title="Manajemen Produk & Katalog Atelier"
          subtitle="Kelola alokasi botol, penetapan harga, dan penambahan varian olfaktori baru."
          badgeCount={criticalStockCount}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Component (Col 5) */}
            <div className="lg:col-span-5">
              <ProductForm
                name={name}
                setName={setName}
                price={price}
                setPrice={setPrice}
                stock={stock}
                setStock={setStock}
                description={description}
                setDescription={setDescription}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                isSubmitting={isSubmitting}
                onSubmit={handleAddProduct}
              />
            </div>

            {/* Table Component (Col 7) */}
            <div className="lg:col-span-7">
              <ProductTable products={filteredProducts} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
