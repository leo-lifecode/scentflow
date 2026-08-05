# 🧪 ScentFlow - Perfume Inventory & Financial Automation System (Backend)

ScentFlow adalah sistem backend berbasis **Event-Driven Architecture** yang dirancang untuk mengelola inventaris toko parfum, transaksi penjualan, dan otomatisasi laporan keuangan.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (v22+)
* **Language:** TypeScript
* **Framework:** Express.js
* **Database & BaaS:** Supabase (PostgreSQL)
* **Runner & Watcher:** `tsx`
* **Architecture:** RESTful API & Event-Driven Webhooks

---

## 📊 Skema Database (Supabase)

Proyek ini menggunakan 4 tabel utama relasional di Supabase:

* `products` : Menyimpan katalog parfum (varian, ukuran ml, harga, dan stok).
* `orders` : Menyimpan data transaksi pesanan pelanggan (`status`: `PENDING`, `SUCCESS`, `FAILED`).
* `order_items` : Detail produk yang dibeli dalam satu pesanan.
* `transactions` : Pencatatan arus kas keuangan (*income* & *outcome*).

---

## 🚀 Fitur yang Sudah Selesai (Minggu 1)

- [x] Inisialisasi Express server dengan TypeScript & Node.js 22.
- [x] Integrasi Supabase Client dengan penanganan native WebSocket.
- [x] **GET /api/products**: Mengambil seluruh daftar parfum dari database.
- [x] **POST /api/checkout**: Mengolah pembuatan pesanan baru (Status: `PENDING`) dengan kalkulasi total harga aman dari backend (*anti-tampering*).

---

## 💻 Panduan Instalasi Lokal

### 1. Prasyarat
Pastikan sudah terinstall di komputer:
* **Node.js** (versi 22.0.0 ke atas)
* **Git**
* Akun **Supabase**

### 2. Clone Repository
```bash
git clone [https://github.com/USERNAME_KAMU/scentflow-backend.git](https://github.com/USERNAME_KAMU/scentflow-backend.git)
cd scentflow-backend
