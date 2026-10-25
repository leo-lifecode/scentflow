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
  const { data, error } = await supabase.from("profiles")
    .select("id,full_name,phone,role,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json({ data: data ?? [] });
}

export async function updateOrderShipping(req: AuthenticatedRequest, res: Response) {
  const { shipping_status, shipping_courier, tracking_number } = req.body as Record<string, unknown>;
  const allowed = ["UNPAID", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];
  if (typeof shipping_status !== "string" || !allowed.includes(shipping_status)) {
    res.status(400).json({ message: "Status pengiriman tidak valid" });
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