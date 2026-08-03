import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route 2: Membuat Pesanan Baru (Status: PENDING)
app.post(
  "/api/checkout",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { customer_name, customer_email, items } = req.body;

      // 1. Validasi Input Dasar
      if (
        !customer_name ||
        !customer_email ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        res
          .status(400)
          .json({ success: false, message: "Data pesanan tidak lengkap!" });
        return;
      }

      // 2. Ambil ID semua produk yang dibeli untuk cek harga asli di Supabase
      const productIds = items.map(
        (item: { product_id: string }) => item.product_id,
      );
      const { data: dbProducts, error: productError } = await supabase
        .from("products")
        .select("id, price, stock")
        .in("id", productIds);

      if (productError || !dbProducts) {
        throw new Error("Gagal mengambil data produk dari database.");
      }

      // 3. Hitung Total Harga secara Aman di Backend
      let totalAmount = 0;
      const orderItemsToInsert = [];

      for (const item of items) {
        const product = dbProducts.find((p) => p.id === item.product_id);

        if (!product) {
          res.status(404).json({
            success: false,
            message: `Produk dengan ID ${item.product_id} tidak ditemukan.`,
          });
          return;
        }

        if (product.stock < item.quantity) {
          res.status(400).json({
            success: false,
            message: `Stok untuk produk ini tidak mencukupi.`,
          });
          return;
        }

        const itemTotalPrice = product.price * item.quantity;
        totalAmount += itemTotalPrice;

        orderItemsToInsert.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 4. Simpan Data Order Utama ke Tabel 'orders' (Status: PENDING)
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name,
            customer_email,
            total_amount: totalAmount,
            status: "PENDING",
          },
        ])
        .select()
        .single();

      if (orderError || !newOrder) {
        throw orderError;
      }

      // 5. Simpan Rincian Item ke Tabel 'order_items'
      const finalOrderItems = orderItemsToInsert.map((item) => ({
        ...item,
        order_id: newOrder.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(finalOrderItems);

      if (itemsError) {
        throw itemsError;
      }

      // 6. Kembalikan Response Sukses ke Client
      res.status(201).json({
        success: true,
        message: "Pesanan berhasil dibuat dengan status PENDING",
        data: {
          order_id: newOrder.id,
          customer_name: newOrder.customer_name,
          total_amount: newOrder.total_amount,
          status: newOrder.status,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
