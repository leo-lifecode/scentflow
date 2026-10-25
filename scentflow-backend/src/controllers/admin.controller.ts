import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { supabase } from "../config/database";

export async function listAdminOrders(_req: AuthenticatedRequest, res: Response) {
  const { data, error } = await supabase.from("orders")
    .select("id,user_id,customer_name,customer_email,customer_phone,shipping_address,total_amount,status,shipping_status,shipping_courier,tracking_number,created_at,orders_items(id,quantity,price,products(name))")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json({ data: data ?? [] });
}

export async function listAdminCustomers(_req: AuthenticatedRequest, res: Response) {
  const [{ data: profiles, error: profileError }, { data: orders, error: orderError }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email,phone,role,created_at").order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id,customer_name,customer_email,customer_phone"),
  ]);
  if (profileError) throw profileError;
  if (orderError) throw orderError;
  const byUser = new Map<string, { name?: string; email?: string; phone?: string; count: number }>();
  for (const order of orders ?? []) {
    const current = byUser.get(order.user_id) ?? { count: 0 };
    byUser.set(order.user_id, {
      name: current.name || order.customer_name || undefined,
      email: current.email || order.customer_email || undefined,
      phone: current.phone || order.customer_phone || undefined,
      count: current.count + 1,
    });
  }
  res.json({ data: (profiles ?? []).map((profile) => {
    const details = byUser.get(profile.id);
    return { ...profile, full_name: profile.full_name || details?.name || null, email: profile.email || details?.email || null, phone: profile.phone || details?.phone || null, order_count: details?.count || 0 };
  }) });
}

export async function updateOrderShipping(req: AuthenticatedRequest, res: Response) {
  const { shipping_status, shipping_courier, tracking_number } = req.body as Record<string, unknown>;
  const allowed = ["UNPAID", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
  if (typeof shipping_status !== "string" || !allowed.includes(shipping_status)) {
    res.status(400).json({ message: "Status pengiriman tidak valid" });
    return;
  }
  const { data: existingOrder, error: lookupError } = await supabase.from("orders").select("status").eq("id", req.params.id).single();
  if (lookupError) throw lookupError;
  if (!["success", "settlement", "paid"].includes(String(existingOrder.status).toLowerCase())) {
    res.status(409).json({ message: "Pengiriman hanya dapat diproses setelah pembayaran berhasil" });
    return;
  }
  const { data, error } = await supabase.from("orders").update({
    shipping_status,
    shipping_courier: typeof shipping_courier === "string" ? shipping_courier.trim() || null : null,
    tracking_number: typeof tracking_number === "string" ? tracking_number.trim() || null : null,
  }).eq("id", req.params.id).select("id,shipping_status,shipping_courier,tracking_number").single();
  if (error) throw error;
  res.json({ data });
}