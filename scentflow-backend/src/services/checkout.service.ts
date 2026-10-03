import { supabase } from "../config/database";
import { snap } from "../config/midtrans";
import { env } from "../config/env";
import { CheckoutInput } from "../validators/checkout.validator";

export interface CheckoutItem {
  product_id: string;
  quantity: number;
}

interface OrderItemInsert extends CheckoutItem {
  price: number;
}

export async function createCheckout(input: CheckoutInput) {
  const { customer_name, customer_email, items } = input;

  // Normalize duplicate product IDs so one product is represented by one order item.
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.product_id, (quantities.get(item.product_id) ?? 0) + item.quantity);
  }

  const productIds = [...quantities.keys()];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, stock, price")
    .in("id", productIds);

  if (productsError) throw productsError;
  if (!products) throw new Error("Gagal mengambil data produk dari database");

  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems: OrderItemInsert[] = [];
  let totalAmount = 0;

  for (const [productId, quantity] of quantities) {
    const product = productMap.get(productId);

    if (!product) {
      const error = new Error(`Data dengan id ${productId} tidak ditemukan`);
      (error as Error & { statusCode?: number }).statusCode = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error("Stok produk ini sudah tidak mencukupi");
      (error as Error & { statusCode?: number }).statusCode = 400;
      throw error;
    }

    totalAmount += product.price * quantity;
    orderItems.push({ product_id: productId, quantity, price: product.price });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ customer_email, customer_name, total_amount: totalAmount, status: "PENDING" })
    .select()
    .single();

  if (orderError || !order) throw orderError || new Error("Gagal membuat order");

  const { error: itemsError } = await supabase.from("orders_items").insert(
    orderItems.map((item) => ({ ...item, order_id: order.id })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw itemsError;
  }

  try {
    const transaction = await snap.createTransaction({
      transaction_details: { order_id: order.id, gross_amount: totalAmount },
      callbacks: { finish: env.frontendUrl },
      customer_details: { first_name: customer_name, email: customer_email },
    });

    return {
      order_id: order.id,
      customer_name: order.customer_name,
      status: order.status,
      total_amount: order.total_amount,
      payment_url: transaction.redirect_url,
      snap_token: transaction.token,
    };
  } catch (error) {
    await supabase.from("orders").update({ status: "FAILED" }).eq("id", order.id);
    throw error;
  }
}
