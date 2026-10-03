import { supabase } from "../config/database";
import { notifyPaymentSuccess } from "../integrations/n8n";

interface PaymentNotification {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  customer_email?: string;
}

export async function processPaymentNotification(notification: PaymentNotification) {
  const { order_id, transaction_status, fraud_status, customer_email } = notification;

  const isSuccessfulPayment =
    transaction_status === "settlement" ||
    (transaction_status === "capture" && fraud_status === "accept");

  if (!isSuccessfulPayment) return;

  const { data, error } = await supabase.rpc("process_paid_order", {
    p_order_id: order_id,
  });

  if (error) throw error;

  const result = Array.isArray(data) ? data[0] : data;
  const totalIncome = Number(result?.total_income ?? 0);
  const alreadyProcessed = Boolean(result?.already_processed);

  // A duplicate webhook is a normal payment-provider retry, not a new sale.
  if (alreadyProcessed) return;

  try {
    await notifyPaymentSuccess({
      amount: totalIncome,
      status: "SUCCESS",
      customer_email: customer_email || "customer@example.com",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Financial state is already committed. n8n failure must not make Midtrans retry
    // the webhook and accidentally re-run business logic.
    console.error("Gagal memanggil n8n webhook:", error);
  }
}
