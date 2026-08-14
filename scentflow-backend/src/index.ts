import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
//@ts-ignore
import midtransClient from "midtrans-client";
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

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: (process.env.MIDTRANS_SERVER_KEY || "").trim(),
  clientKey: (process.env.MIDTRANS_CLIENT_KEY || "").trim(),
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
//route ke 2 : chekcout
app.post("/api/checkout", async (req: Request, res: Response) => {
  try {
    //1. validasi inputan atau orderan
    const { customer_name, customer_email, items } = req.body;
    if (
      !customer_name ||
      !customer_email ||
      !items ||
      items.length === 0 ||
      !Array.isArray(items)
    ) {
      res.status(400).json({
        success: false,
        message: "data tidak lengkap",
      });
      return;
    }

    //2. ambil id product yang di order
    const productIds = items.map((item: { product_id: String }) => {
      return item.product_id;
    });

    //cek di database apakah benar ada id nya
    const { data: dbProducts, error: productError } = await supabase
      .from("products")
      .select("id, stock , price")
      .in("id", productIds);

    if (!dbProducts || productError) {
      throw new Error("Gagal mengambil data dari database");
    }

    //3. cek harga nya dan masukkan orderan nya
    let total_amount = 0;
    const orderItemsToInsert = [];
    const productsMap = new Map(
      dbProducts.map((products) => {
        return [products.id, products];
      })
    );

    for (const item of items) {
      const product = productsMap.get(item.product_id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: `data dengan id ${item.product_id} tidak sama dengan database`,
        });
        return;
      }

      if (product?.stock < item?.quantity) {
        res.status(400).json({
          success: false,
          message: "stok produk ini sudah tidak mencukupi",
        });
        return;
      }

      const itemTotalPrice = product.price * item.quantity;
      total_amount += itemTotalPrice;

      orderItemsToInsert.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    //4. masukkan data order ke tabel order
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_email,
          customer_name,
          total_amount,
          status: "PENDING",
        },
      ])
      .select()
      .single();

    if (!newOrder || orderError) {
      throw new Error(`gagal masukkan orderan ${orderError?.message}`);
    }

    //5. masukkan data ke tabel orderitems
    const finalOrderItems = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }));
    const { error: orderItemsError } = await supabase
      .from("orders_items")
      .insert(finalOrderItems);

    if (orderItemsError) {
      throw new Error(orderItemsError.message);
    }

    //6. tampilkan informasi ke customer

    const parameter = {
      transaction_details: {
        order_id: newOrder.id,
        gross_amount: total_amount,
      },
      customer_details: {
        first_name: customer_name,
        email: customer_email,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(201).json({
      success: true,
      message: "Pesanan Berhasil Dilakukan",
      data: {
        order_id: newOrder.id,
        customer_name: newOrder.customer_name,
        status: newOrder.status,
        total_amount: newOrder.total_amount,
        payment_url: transaction.redirect_url,
        snap_token: transaction.token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// route ke 3 : payment
app.post(
  "/api/payments/notification",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const notificationJson = req.body;

      const orderId = notificationJson.order_id;
      const transactionStatus = notificationJson.transaction_status;
      const fraudStatus = notificationJson.fraud_status;

      console.log(
        `Pesan Webhook Masuk! Order ID: ${orderId} | Status: ${transactionStatus}`
      );

      // 1. Tangani Notifikasi Tes dari Midtrans Dashboard
      if (orderId.startsWith("payment_notif_test_")) {
        console.log(" Notifikasi tes dari Midtrans berhasil diterima.");
        res
          .status(200)
          .json({ status: "success", message: "Test notification received" });
        return;
      }

      console.log(
        `Pesan Webhook Masuk! Order ID: ${orderId} | Status: ${transactionStatus}`
      );
      //cek validasi payment status
      let isPaymentStatus = false;
      if (transactionStatus === "capture" && fraudStatus === "accept") {
        isPaymentStatus = true;
      } else if (transactionStatus === "settlement") {
        isPaymentStatus = true;
      }

      //payment sukses
      if (isPaymentStatus) {
        const { error: updateOrderError } = await supabase
          .from("orders")
          .update({
            status: "SUCCESS",
          })
          .eq("id", orderId);

        if (updateOrderError) throw updateOrderError;

        // update stock product & hitung hasil income untuk tabel transaksi database
        const { data: ordersItems, error: orderItemsError } = await supabase
          .from("orders_items")
          .select("product_id, price, quantity")
          .eq("order_id", orderId);

        if (orderItemsError || !ordersItems) throw orderItemsError;

        let totalIncome = 0;
        for (const item of ordersItems) {
          const { data: products } = await supabase
            .from("products")
            .select("stock, price")
            .eq("id", item.product_id)
            .single();

          if (products) {
            const newStock = products?.stock - item.quantity;

            await supabase
              .from("products")
              .update({ stock: newStock })
              .eq("id", item.product_id);
          }
          totalIncome += item.price * item.quantity;
        }
        // insert transaction database
        await supabase.from("transactions").insert({
          amount: totalIncome,
          type: "income",
          category: "sales",
          description: `Penjualan Parfum untuk Order ID: ${orderId}`,
        });
        console.log(
          `✅ Order ${orderId} Berhasil Diproses! Stok Dipotong & Income Dicatat.`
        );

        try {
          await fetch(
            "http://localhost:5678/webhook/scentflow-payment-success",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: totalIncome,
                status: "SUCCESS",
                customer_email:
                  notificationJson.customer_email || "customer@example.com",
                timestamp: new Date().toISOString(),
              }),
            }
          );
          console.log(
            "🚀 Event transaksi berhasil dikirim ke n8n Automation Engine."
          );
        } catch (n8nError: any) {
          console.error("⚠️ Gagal memanggil n8n webhook:", n8nError.message);
        }
      }

      res.status(200).json({
        success: true,
        status: "OK",
        message: "transaksi sudah dilakukan dan database berhasil di update",
      });
    } catch (error: any) {
      console.error("Error Webhook", error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
