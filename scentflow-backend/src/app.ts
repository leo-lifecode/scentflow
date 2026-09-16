import express from "express";
import cors from "cors";
import { env } from "./config/env";
import productRoutes from "./routes/product.routes";
import transactionRoutes from "./routes/transaction.routes";
import checkoutRoutes from "./routes/checkout.routes";
import paymentRoutes from "./routes/payment.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("ScentFlow API is running");
});

app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payments", paymentRoutes);

app.use(errorMiddleware);

export default app;
