import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().min(1, "Nama pelanggan wajib diisi").trim(),
  customer_email: z.string().email("Format email tidak valid").trim(),
  customer_phone: z.string().min(6, "Nomor HP wajib diisi").max(30).trim(),
  shipping_address: z.string().min(8, "Alamat pengiriman wajib diisi").max(1000).trim(),
  items: z.array(z.object({
    product_id: z.string().min(1, "Product ID wajib diisi"),
    quantity: z.number().int("Quantity harus berupa bilangan bulat").positive("Quantity harus lebih dari 0"),
  })).min(1, "Minimal harus ada 1 produk"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;