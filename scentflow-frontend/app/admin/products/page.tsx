"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";

interface ApiErrorResponse { response?: { data?: { message?: string } } }

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Gagal membaca gambar"));
    reader.onerror = () => reject(new Error("Gagal membaca gambar"));
    reader.readAsDataURL(file);
  });
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    api.get("/products").then((res) => { if (active) setProducts(res.data.data || res.data || []); })
      .catch((err) => console.error("Gagal memuat produk:", err))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshTrigger]);

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !price || !stock) return;
    setIsSubmitting(true);
    try {
      let uploadedImageUrl = imageUrl.trim();
      if (imageFile) {
        const dataUrl = await readFileAsDataUrl(imageFile);
        const upload = await api.post("/uploads/product-image", {
          file_name: imageFile.name,
          content_type: imageFile.type,
          base64: dataUrl,
        }, { withCredentials: true });
        uploadedImageUrl = upload.data.data.image_url;
      }
      await api.post("/products", {
        name: name.trim(), price: Number(price), stock: Number(stock),
        description: description.trim(), image_url: uploadedImageUrl || undefined,
      }, { withCredentials: true });
      setName(""); setPrice(""); setStock(""); setDescription(""); setImageUrl(""); setImageFile(null);
      setRefreshTrigger((value) => value + 1);
      alert("Produk berhasil ditambahkan.");
    } catch (error: unknown) {
      console.error("Gagal menambah produk:", error);
      alert((error as ApiErrorResponse).response?.data?.message || (error instanceof Error ? error.message : "Gagal menambahkan produk."));
    } finally { setIsSubmitting(false); }
  };

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const criticalStockCount = products.filter((product) => product.stock <= 2).length;

  return (
    <div className="min-h-screen flex bg-[#f2f3f5] font-sans text-slate-800">
      <AdminSidebar productCount={products.length} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader title="Manajemen Produk & Katalog" subtitle="Tambah produk dengan foto JPG/PNG, atur harga, stok, dan deskripsi." badgeCount={criticalStockCount} searchValue={searchTerm} onSearchChange={setSearchTerm} />
        <main className="flex-1 space-y-6 overflow-y-auto p-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5"><ProductForm name={name} setName={setName} price={price} setPrice={setPrice} stock={stock} setStock={setStock} description={description} setDescription={setDescription} imageUrl={imageUrl} setImageUrl={setImageUrl} imageFile={imageFile} setImageFile={setImageFile} isSubmitting={isSubmitting} onSubmit={handleAddProduct} /></div>
            <div className="lg:col-span-7"><ProductTable products={filteredProducts} loading={loading} /></div>
          </div>
        </main>
      </div>
    </div>
  );
}