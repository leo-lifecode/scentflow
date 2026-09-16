// @ts-ignore midtrans-client does not provide compatible TypeScript declarations.
import midtransClient from "midtrans-client";
import { env } from "./env";

export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: env.midtransServerKey,
  clientKey: env.midtransClientKey,
});
