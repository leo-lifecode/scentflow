import { env } from "../config/env";

export async function notifyPaymentSuccess(payload: {
  amount: number;
  status: string;
  customer_email: string;
  timestamp: string;
}) {
  const response = await fetch(env.n8nWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`n8n webhook returned ${response.status}`);
  }
}
