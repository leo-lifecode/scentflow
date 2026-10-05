// @ts-ignore midtrans-client does not provide compatible TypeScript declarations.
import midtransClient from "midtrans-client";
import { env } from "./env";

const midtransConfig = {
  isProduction: false,
  serverKey: env.midtransServerKey,
  clientKey: env.midtransClientKey,
};

export const snap = new midtransClient.Snap(midtransConfig);
export const coreApi = new midtransClient.CoreApi(midtransConfig);
