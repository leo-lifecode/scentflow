import { supabase } from "../config/database";

export async function getOrdersForUser(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, shipping_status, shipping_courier, tracking_number, created_at, orders_items(id, product_id, quantity, price, products(name, variant, size))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}