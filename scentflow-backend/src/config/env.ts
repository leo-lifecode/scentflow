import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_KEY || "",
  midtransServerKey: (process.env.MIDTRANS_SERVER_KEY || "").trim(),
  midtransClientKey: (process.env.MIDTRANS_CLIENT_KEY || "").trim(),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  n8nWebhookUrl:
    process.env.N8N_WEBHOOK_URL ||
    "http://localhost:5678/webhook/scentflow-payment-success",
};
