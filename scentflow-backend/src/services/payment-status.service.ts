import { supabase } from "../config/database";
import { coreApi } from "../config/midtrans";
import { processPaymentNotification } from "./payment.service";

interface PaymentStatusResult {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  status: string;
}

export async function syncPaymentStatus(orderId: string, userId: string): Promise<PaymentStatusResult> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, status")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    const error = new Error("Pesanan tidak ditemukan");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (order.user_id !== userId) {
    const error = new Error("Tidak memiliki akses ke pesanan ini");
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }

  // Never trust the browser's payment result. Ask Midtrans using the server key.
  // @ts-ignore midtrans-client response typing is incomplete.
  const status = await coreApi.transaction.status(orderId);

  await processPaymentNotification({
    order_id: orderId,
    transaction_status: status.transaction_status,
    fraud_status: status.fraud_status,
  });

  const { data: refreshedOrder, error: refreshedOrderError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (refreshedOrderError) throw refreshedOrderError;

  return {
    order_id: orderId,
    transaction_status: status.transaction_status,
    fraud_status: status.fraud_status,
    status: refreshedOrder?.status ?? order.status,
  };
}
