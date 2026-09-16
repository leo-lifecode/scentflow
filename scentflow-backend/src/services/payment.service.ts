import { supabase } from "../config/database";
import { notifyPaymentSuccess } from "../integrations/n8n";

export async function processPaymentNotification(notification: {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  customer_email?: string;
}) {
  const { order_id, transaction_status, fraud_status, customer_email } = notification;

  if (transaction_status !== "settlement" && !(transaction_status === "capture" && fraud_status === "accept")) {
    return;
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "SUCCESS" })
    .eq("id", order_id);
  if (orderError) throw orderError;

  const { data: orderItems, error: itemsError } = await supabase
    .from("orders_items")
    .select("product_id, price, quantity")
    .eq("order_id", order_id);
  if (itemsError) throw itemsError;
  if (!orderItems) throw new Error("Order items tidak ditemukan");

  let totalIncome = 0;

  for (const item of orderItems) {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    if (productError) throw productError;

    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: product.stock - item.quantity })
      .eq("id", item.product_id);
    if (stockError) throw stockError;

    totalIncome += item.price * item.quantity;
  }

  const { error: transactionError } = await supabase.from("transactions").insert({
    amount: totalIncome,
    type: "income",
    category: "sales",
    description: `Penjualan Parfum untuk Order ID: ${order_id}`,
  });
  if (transactionError) throw transactionError;

  try {
    await notifyPaymentSuccess({
      amount: totalIncome,
      status: "SUCCESS",
      customer_email: customer_email || "customer@example.com",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gagal memanggil n8n webhook:", error);
  }
}
